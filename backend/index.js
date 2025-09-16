// server.js
import dotenv from "dotenv";
import express from "express";
import { chromium } from "playwright";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

const videoDir = path.join(__dirname, "videos");
if (!fs.existsSync(videoDir)) {
  fs.mkdirSync(videoDir);
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function runRender(props) {
  return new Promise((resolve, reject) => {
    const outputPath = "out/screen-rec.mp4";

    const child = spawn(
      "npx",
      [
        "remotion",
        "render",
        "Main",
        outputPath,
        `--props=${JSON.stringify(props).replace(/"/g, '\\"')}`,
        "--height",
        "1200",
        "--width",
        "1920",
        "--concurrency",
        "50%",
      ],
      {
        cwd: "video", // ensures output goes into video/out/
        shell: true,
      }
    );

    child.stdout.on("data", (data) => console.log(`stdout: ${data}`));
    child.stderr.on("data", (data) => console.error(`stderr: ${data}`));

    child.on("close", (code) => {
      if (code === 0) {
        resolve(path.join("video", outputPath));
      } else {
        reject(new Error(`Render failed with exit code ${code}`));
      }
    });
  });
}

async function create_full_video(face_video_payload, screen_video_payload) {
  try {
    // Run Remotion render
    const outputPath = await runRender({
      screen: screen_video_payload,
      face: face_video_payload,
    });

    // Read and upload final video
    const videoBuffer = fs.readFileSync(outputPath);
    const videoBase64 = videoBuffer.toString("base64");

    const final_video = await uploadImages({
      payload: videoBase64,
      userId: `${new Date().toDateString()}`,
    });

    console.log("Uploaded final video:", final_video);
    return final_video;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

app.post("/record", async (req, res) => {
  const body = req.body;
  const duration = body?.duration || 30; // seconds
  const websiteUrl = body?.website_url || "https://google.com";
  const faceVideo = body?.face_video;

  const framesDir = path.join(__dirname, "temp_screenshots");
  const videosDir = path.join(__dirname, "videos");
  const videoFileName = `recording-${Date.now()}.mp4`;
  const videoFile = path.join(videosDir, videoFileName);

  const fps = 10;
  const interval = 1000 / fps;

  // Ensure directories exist
  if (!fs.existsSync(framesDir)) fs.mkdirSync(framesDir, { recursive: true });
  if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir, { recursive: true });

  // Launch browser
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1200 },
  });
  const page = await context.newPage();

  // Navigate and wait for load
  await page.goto(websiteUrl, { waitUntil: "networkidle" });

  // Capture frames
  const totalFrames = duration * fps;
  for (let i = 0; i < totalFrames; i++) {
    const framePath = path.join(
      framesDir,
      `frame-${String(i).padStart(5, "0")}.png`
    );
    await page.screenshot({ path: framePath });
    await new Promise((r) => setTimeout(r, interval));
  }

  await browser.close();

  // FFmpeg command
  const ffmpegArgs = [
    "-y",
    "-r",
    String(fps),
    "-i",
    path.join(framesDir, "frame-%05d.png"),
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    videoFile,
  ];

  const ffmpeg = spawn("ffmpeg", ffmpegArgs);
  ffmpeg.stderr.on("data", (d) => console.log("ffmpeg:", d.toString()));

  ffmpeg.on("close", async (code) => {
    try {
      // Clean up frames
      fs.rmSync(framesDir, { recursive: true, force: true });

      console.log("Video created:", videoFile);

      // Read file and encode
      const videoBuffer = fs.readFileSync(videoFile);
      const videoBase64 = videoBuffer.toString("base64");

      // Upload
      const uploadedVideo = await uploadImages({
        payload: videoBase64,
        userId: `${new Date().toDateString()}`,
      });

      const finishedVideo = await create_full_video(faceVideo, uploadedVideo);
      res.status(200).send({ success: true, video: finishedVideo });
    } catch (err) {
      console.error("Error processing video:", err);
      res.status(500).send(`Failed to process video: \n${err}`);
    }
  });
});

app.listen(PORT, () => {
  console.log(`API server running on Port ${PORT}`);
});

export async function uploadImages({ payload, userId }) {
  try {
    const formdata = new FormData();
    formdata.append("file", payload);
    formdata.append("fileName", `${new Date().toLocaleString()}_${userId}`);
    const uploadRes = await fetch(
      `https://upload.imagekit.io/api/v1/files/upload`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Basic ${generateAuthorizationHeader(
            {
              clientId: process.env.IMAGE_KIT_API_KEY,
              clientSecret: "",
            } //this api doesnt use passwords to encode
          )}`,
        },
        body: formdata,
      }
    );
    if (!uploadRes.ok) {
      const error = await uploadRes.json();
      throw new Error(`Failed to upload: ${error.message} `, error);
    }
    const upload = await uploadRes.json();
    return upload.url;
  } catch (error) {
    console.error(error.message);
  }
}
export function generateAuthorizationHeader({ clientId, clientSecret }) {
  // Combine clientId and clientSecret with a colon
  const credentials = `${clientId}:${clientSecret}`;

  // Encode the credentials to Base64
  const encodedCredentials = Buffer.from(credentials).toString("base64");

  // Return the Authorization header value
  return encodedCredentials;
}

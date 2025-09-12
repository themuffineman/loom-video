// server.js
const express = require("express");
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

const videoDir = path.join(__dirname, "videos");
if (!fs.existsSync(videoDir)) {
  fs.mkdirSync(videoDir);
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/record", async (req, res) => {
  const body = req.body;
  const duration = body?.duration || 30; // seconds
  const url = body?.url || "https://google.com";
  const fileName = body?.file_name;
  const output = path.join(
    __dirname,
    fileName || `recording-${Date.now().toString()}.mp4`
  );

  // 1. Launch browser (headful mode)
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(url);

  // 2. Start FFmpeg recording
  let ffmpegArgs;
  if (process.platform === "win32") {
    // Windows: use gdigrab to capture the whole desktop
    ffmpegArgs = [
      "-y",
      "-f",
      "gdigrab",
      "-framerate",
      "30",
      "-i",
      "desktop",
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-pix_fmt",
      "yuv420p",
      "-t",
      duration.toString(), // 👈 duration handled by ffmpeg
      output,
    ];
  } else {
    // Linux: assumes Xvfb running on :99
    ffmpegArgs = [
      "-y",
      "-f",
      "x11grab",
      "-r",
      "30",
      "-s",
      "1280x720",
      "-i",
      ":99.0",
      output,
    ];
  }

  const ffmpeg = spawn("ffmpeg", ffmpegArgs);

  ffmpeg.stderr.on("data", (d) => console.log("FFmpeg:", d.toString()));

  // Only move after FFmpeg fully exits
  ffmpeg.on("close", (code) => {
    console.log(`FFmpeg exited with code ${code}`);

    const videoDir = path.join(__dirname, "videos");
    if (!fs.existsSync(videoDir)) {
      fs.mkdirSync(videoDir);
    }

    const dest = path.join(videoDir, path.basename(output));
    try {
      fs.renameSync(output, dest);
      console.log("File moved successfully:", dest);
      res.send("ok");
      browser?.close();
    } catch (err) {
      console.error("Error moving file:", err);
      res.status(500).send("Failed to move file");
    }
  });
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

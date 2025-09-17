import { chromium } from "playwright";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function index(duration) {
  const framesDir = path.join(__dirname, "temp_screenshots");
  const videosDir = path.join(__dirname, "videos");
  const fps = 120;
  const interval = 1000 / fps;

  // Ensure directories exist
  if (!fs.existsSync(framesDir)) fs.mkdirSync(framesDir, { recursive: true });
  if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir, { recursive: true });
  let browser;
  try {
    browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.setContent(html);
    await page.waitForSelector("video");
    await page.evaluate(async () => {
      const video = document.querySelector("video");
      video.muted = true;
      await new Promise((resolve) => {
        if (video.readyState >= 4) {
          resolve();
        } else {
          video.addEventListener("canplaythrough", resolve, { once: true });
        }
      });
      video.play();
    });
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

    // Use ffmpeg to stitch images into a video
    const outputVideo = path.join(videosDir, "output.mp4");
    const ffmpegCmd = `ffmpeg -y -framerate ${fps} -i "${framesDir}/frame-%05d.png" -c:v libx264 -pix_fmt yuv420p "${outputVideo}"`;

    exec(ffmpegCmd, (error) => {
      if (error) {
        console.error("ffmpeg error:", error);
      } else {
        console.log("Video created at:", outputVideo);
      }
    });
  } catch (error) {
    console.error(error);
    await browser?.close();
  } finally {
    fs.rm(framesDir, { recursive: true, force: true }, (err) => {
      if (err) {
        console.error("Error deleting temp frames:", err);
      } else {
        console.log("Temporary frames deleted.");
      }
    });
  }
}
const html = `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body
     style="
      display: flex;
      justify-content: center;
      align-items: center;
      height: 95vh;
    "
  >
    <video
      src="https://ik.imagekit.io/tm42pfpfj2/face-rec.mp4?updatedAt=1757832679385"
      controls
      width="640"
      height="360"
    />
  </body>
</html>
`;
index(23);

import dotenv from "dotenv";
dotenv.config();

/**
 * Class for converting HTML content to a video using the html5animationtogif.com API.
 * Handles uploading HTML as a ZIP, converting it to video, and polling for the output URL.
 *
 * @class
 * @property {Object} input - Input parameters for the video.
 * @property {string} input.html - The HTML content to render.
 * @property {number} input.width - The width of the video.
 * @property {number} input.height - The height of the video.
 * @property {number} input.duration - The duration of the video in seconds.
 * @property {number} input.fps - The frames per second for the video.
 * @property {string} clientId - The client ID for API authentication (from environment variable).
 * @property {string} apiKey - The API key for authentication (from environment variable).
 */
export class HTML_TO_VIDEO {
  input = {
    html: null,
    width: null,
    height: null,
    duration: null,
    fps: null,
    userId: null,
  };
  videoEngineUrl = `${process.env.VIDEO_ENGINE_URL}/generate-video`;

  constructor({ html, width, height, duration, fps, userId }) {
    this.input.html = html;
    this.input.width = width;
    this.input.height = height;
    this.input.duration = duration;
    this.input.fps = fps;
    this.input.userId = userId;
  }
  async render() {
    const url = await fetch(this.videoEngineUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        htmlContent: this.input.html,
        duration: this.input.duration,
        width: this.input.width,
        height: this.input.height,
        framerate: this.input.fps,
        userId: this.input.userId,
      }),
    });
    return url;
  }
  htmlToJsonSafeString(htmlString) {
    return JSON.stringify(htmlString).slice(1, -1);
  }
}

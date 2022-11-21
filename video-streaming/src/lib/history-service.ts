import debug from "debug";
import http  from "http";

const log = debug("video-streaming:history")

type HistoryOptions = {
  host: string;
}

/**
 * Sends viewed request to history service
 * @param {string} videoPath
 */
async function sendViewedMessage(options: HistoryOptions, videoPath: string) {
  const url  = `${options.host}/viewed`
  const body = {
    videoPath
  };

  log(`sending viewed request to ${url}`);

  const request = http.request(url, {
    method : "POST",
    headers: {
      "Content-Type": "application/json"
    }
  });

  request.on("close", () => {
    log(`sent viewed message ${videoPath}`);
  });

  request.on("error", (error) => {
    log(`could not send viewed message for ${videoPath}`)
    log(error);
  });

  request.write(JSON.stringify(body))
  request.end();
}

export {
  sendViewedMessage
}
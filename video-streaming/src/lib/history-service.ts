import {Channel} from "amqplib";
import debug     from "debug";
import http      from "http";

const log = debug("video-streaming:history")

type HistoryOptions = {
  host: string;
}

type HistoryMessagingOptions = {
  channel: Channel;
  queueName: string;
  videoPath: string;
}

/**
 * Send viewed message to queue
 *
 * @param options
 */
async function publishMessage(options: HistoryMessagingOptions) {
  const {
          queueName,
          channel,
          videoPath
        } = options;

  const body = {
    videoPath,
    ts: new Date().toISOString()
  };

  const payload = JSON.stringify(body);

  log(`publishing message to ${queueName}`);
  channel.publish("", queueName, Buffer.from(payload))
}

/**
 * Sends viewed request to history service
 * @param {string} videoPath
 */
async function sendViewedMessageHTTP(options: HistoryOptions, videoPath: string) {
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
  sendViewedMessageHTTP,
  publishMessage
}
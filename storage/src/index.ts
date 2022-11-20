import express, {Response} from 'express';
import {initializeClient}  from "./lib/minio";
import debug               from "debug";

const pkg = require("../package.json")

const PORT             = process.env.PORT || 4001;
const STORAGE_BUCKET   = process.env.STORAGE_BUCKET || "videos";
const STORAGE_ENDPOINT = process.env.STORAGE_ENDPOINT;
const STORAGE_KEY      = process.env.STORAGE_KEY;
const STORAGE_SECRET   = process.env.STORAGE_SECRET;

const app = express();
const log = debug("storage:api");

app.get("/videos", async (req, res) => {
  log("videos path");

  try {
    const path = req.query["path"];

    if (!path) {
      throw new Error("Must have a path for the video")
    }

    if (!STORAGE_KEY) {
      throw new Error("Could not access storage without storage key")
    }

    if (!STORAGE_SECRET) {
      throw new Error("Could not access storage without storage secret")
    }

    log("initializing minio client")

    const client = initializeClient({
      useSSL   : false,
      endPoint : STORAGE_ENDPOINT,
      accessKey: STORAGE_KEY,
      secretKey: STORAGE_SECRET
    });

    log("client initialized")

    const bucket = STORAGE_BUCKET;

    log(`getting object ${bucket}/${path}`)

    client.statObject(bucket, path as string, (err, stat) => {
      if (err != null) {
        sendError(res, err);
        return;
      }

      const contentLength = stat.size;
      const contentType   = stat?.metaData['content-type'] || "video/mp4";

      log(`type ${contentType}`)
      log(`length ${contentLength}`)

      res.writeHead(200,
        {
          "Content-Length": contentLength,
          "Content-Type"  : contentType
        }
      );

      client.getObject(bucket, path as string, (err, data) => {
        data.once("error", err => {
          if (err != null) {
            sendError(res, err);
            return;
          }
        });

        log(`sending object ${path}`);

        data.pipe(res)
      });

    });

  } catch (ex) {
    let message = "Error: Unknown"

    if (ex instanceof Error) {
      message = `${ex.name}: ${ex.message}`;
    }

    sendError(res, new Error(message))
  }
});

app.get("/healthz", (req, res) => {
  res.json({
    ok: true
  })
})

app.listen(PORT, () => {
  log(`${pkg.name} service started on port ${PORT}`)
})

function sendError(res: Response, error: Error, code: number = 500) {
  log(error);

  res.status(code);

  res.send({
    ok   : false,
    error: error
  })
}
import express, {
  Request,
  Response
}                              from 'express';
import http, {IncomingMessage} from "http";
import debug                   from "debug";
import * as mongodb            from "mongodb";
import {
  publishMessage,
  sendViewedMessageHTTP
}                              from "./lib/history-service";
import {createChannel}         from "./lib/messaging-service";

const app = express();
const log = debug("video-streaming:api")

const port         = process.env.PORT || 4000;
const STORAGE_HOST = process.env.STORAGE_HOST || "localhost";
const STORAGE_PORT = process.env.STORAGE_PORT || 4001;
const DB_HOST      = process.env.DB_HOST || "mongodb://localhost:4002";
const DB_NAME      = process.env.DB_NAME || "video-streaming";
const HISTORY_HOST = process.env.HISTORY_HOST || "http://history";
const RABBIT       = process.env.RABBIT || "amqp://guest:guest@localhost:5672";
const QUEUE_NAME   = "viewed";

const main = async () => {
  log(`connecting to ${DB_HOST}`)
  const client     = await mongodb.MongoClient.connect(DB_HOST);
  const db         = client.db(DB_NAME);
  const collection = db.collection("videos");

  log(`creating channel to queue ${QUEUE_NAME}`);
  const channel = await createChannel({host: RABBIT, queueName: QUEUE_NAME});

  app.get("/healthz", (req: Request, res: Response) => {
    log("health check");

    res.send({
      ok: true
    })
  });

  app.get("/videos", async (req: Request, res: Response) => {
    const id = new mongodb.ObjectId(req.query["id"] as string)

    log(`finding ${id}`);

    const record = await collection.findOne({_id: id});

    if (!record) {
      sendError(res, new Error(`Could not find record ${id}`), 404);
      return;
    }

    const videoPath = record.path;

    if (!videoPath) {
      sendError(res, new Error(`Could not find video path for ${id}`), 404);
      return;
    }

    log(`found ${videoPath}`);

    log(`fetching ${videoPath} at ${STORAGE_HOST}:${STORAGE_PORT}`)

    const forwardRequest = http.request({
        host   : STORAGE_HOST,
        port   : STORAGE_PORT,
        path   : `/videos/?path=${videoPath}`,
        method : "GET",
        headers: req.headers
      },
      (forwardResponse: IncomingMessage) => {
        log(`forwarded callback with ${forwardResponse.statusCode}`)

        if (forwardResponse.statusCode) {
          res.writeHead(forwardResponse.statusCode, forwardResponse.headers);
        }

        forwardResponse.pipe(res)
      });

    req.pipe(forwardRequest);

    const queueName = QUEUE_NAME;

    await publishMessage({channel, videoPath, queueName});
    // previous HTTP direct messaging
    //await sendViewedMessageHTTP({host: HISTORY_HOST}, videoPath);
  });

  app.listen(port, () => {
    log(`starting server on port ${port}`);
  })
}

function sendError(res: Response, error: Error, code: number = 500) {
  log(error);

  res.status(code);

  res.send({
    ok     : false,
    message: error.message
  })
}

main().catch(err => {
  log(err);
})
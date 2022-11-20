import express, {
  Request,
  Response
}                              from 'express';
import http, {IncomingMessage} from "http";
import debug                   from "debug";

const app = express();
const log = debug("video-streaming:api")

const port         = process.env.PORT || 4000;
const STORAGE_HOST = process.env.STORAGE_HOST || "localhost";
const STORAGE_PORT = process.env.STORAGE_PORT || 4001;

app.get("/healthz", (req: Request, res: Response) => {
  log("health check");

  res.send({
    ok: true
  })
});

app.get("/videos", async (req: Request, res: Response) => {
  const videoPath = "SampleVideo_1280x720_1mb.mp4";

  log(`fetching ${videoPath} at ${STORAGE_HOST}:${STORAGE_PORT}`)

  const forwardRequest = http.request({
      host   : STORAGE_HOST,
      port   : STORAGE_PORT,
      path   : `/videos/?path=${videoPath}`,
      method : "GET",
      headers: req.headers
    },
    (forwardResponse: IncomingMessage) => {
      log('callback')
      if (forwardResponse.statusCode) {
        res.writeHead(forwardResponse.statusCode, forwardResponse.headers);
      }

      forwardResponse.pipe(res)
    });

  req.pipe(forwardRequest);
})

app.listen(port, () => {
  log(`starting server on port ${port}`);
})

import express    from "express";
import debug      from "debug";
import bodyParser from "body-parser";
import * as mongo from "mongodb";

const log = debug("history:api")

const DB_NAME = process.env.DB_NAME || "history";
const DB_HOST = process.env.DB_HOST || "mongodb://localhost:4002";

type VideoStreamedBody = {
  videoPath: string;
}

const main = async () => {
  const port = process.env.PORT || 4003;

  const app = express();

  log(`enable body parsing JSON`);
  app.use(bodyParser.json());

  log(`connect to mongodb client`);
  const client = await mongo.MongoClient.connect(DB_HOST);

  log(`get database ${DB_NAME}`);
  const db = client.db(DB_NAME);

  log(`get collection for metadata`);
  const collection = db.collection("videos");

  app.get("/healthz", (_, res) => {
    log("/healthz check");

    res.json({
      ok: true
    });
  });

  app.post("/viewed", async (req, res) => {
    try {
      const body = req.body as VideoStreamedBody;
      const ts   = new Date().toISOString();

      await collection.insertOne({videoPath: body.videoPath, ts});

      log(`added viewed ${body.videoPath}`);

      res.sendStatus(200);
    } catch (ex) {
      log(ex);
    }
  });

  app.listen(port, () => {
    log(`starting history service listening on ${port}`);
  });
}

main().catch(err => {
  log(`error in history service`)
  log(err);
});
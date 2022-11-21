import express    from "express";
import debug      from "debug";
import bodyParser from "body-parser";

const log = debug("history:api")

type VideoStreamedBody = {
  videoPath: string;
}

const main = async () => {
  const port = process.env.PORT || 4003;

  const app = express();

  // Enables JSON body parsing
  app.use(bodyParser.json());

  app.get("/healthz", (_, res) => {
    log("/healthz check");

    res.json({
      ok: true
    });
  });

  app.post("/viewed", async (req, res) => {
    try{
      const body = req.body as VideoStreamedBody;
      console.log(body);
      if(body){
        log(`viewed ${body.videoPath}`);

        //TODO: store in mongodb viewed video
      }
    }catch(ex){
      //TODO
      console.log(ex);
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
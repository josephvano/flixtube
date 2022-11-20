import express from "express";
import debug   from "debug";

const log = debug("history:api")

const main = async () => {
  const port = process.env.PORT || 4003;

  const app = express();

  app.get("/healthz", (_, res) => {
    log("/healthz check");

    res.json({
      ok: true
    });
  })

  app.listen(port, () => {
    log(`starting history service listening on ${port}`);
  });
}

main().catch(err => {
  log(`error in history service`)
  log(err);
});
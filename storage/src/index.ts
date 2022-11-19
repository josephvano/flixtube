import express from 'express';

const pkg = require("../package.json")

const PORT = process.env.PORT || 4001;

const app = express();

app.get( "/healthz", (req, res) => {
  res.json({
    ok: true
  })
})

app.listen(PORT, () => {
  console.log(`${pkg.name} service started on port ${PORT}`)
})
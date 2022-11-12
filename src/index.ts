import express    from 'express';
import path       from 'path';
import fsPromises from "fs/promises";
import fs         from "fs";

const app = express();

const port        = process.env.PORT || 3000;
const PUBLIC_PATH = path.join(__dirname, "../public");

app.get("/", (req, res) => {
  res.send("Hello world!");
})

app.get("/video", async (req, res) => {
  const videoPath = path.join(PUBLIC_PATH, "SampleVideo_1280x720_1mb.mp4");
  const file      = await fsPromises.stat(videoPath)

  res.writeHead(200, {
    "Content-Length": file.size,
    "Content-Type"  : "video/mp4"
  });

  fs.createReadStream(videoPath).pipe(res);
})

app.listen(port, () => {
  console.log(`Starting server on port ${port}`);
})

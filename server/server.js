const express = require("express");
const multer = require("multer");
const s3Storage = require("multer-sharp-s3");
const aws = require("aws-sdk");
const { getFileStream } = require('./s3')

const s3 = new aws.S3();
const app = express();

const storage = s3Storage({
  s3,
  Bucket: "BUCKET_NAME",  // replace with your bucket name
  resize: {
    width: 400,
    height: 400,
   options:
   { fit: 'contain'},
    max: true,
  }
});

const upload = multer({ storage: storage });

app.get("/images/:key", (req, res) => {
  console.log(req.params);
  const key = req.params.key;
  const readStream = getFileStream(key);

  readStream.pipe(res);
});

app.post("/upload", upload.single("image"), (req, res, next) => {
  console.log(req.file); // Print upload details
  res.send("Successfully uploaded!");
});

app.listen(8080, () => console.log("listening on port 8080"));

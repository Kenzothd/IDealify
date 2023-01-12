const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

const s3 = new aws.S3({
  accessKetId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.BUCKET_REGION,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    metadeta: function (req, file, cb) {
      cb(null, { fieldname: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now());
    },
  }),
}).array("uploadedFiles", 10);

//* Upload MULTIPLE Files
exports.createFiles = (req, res, next) => {
  console.log("route works");
  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
      res.status(400).json({ success: false, message: err.message });
    } else {
      res.status(200).send(req.files);
    }
  });
};

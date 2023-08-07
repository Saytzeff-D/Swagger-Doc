const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const dotenv = require("dotenv");


dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});


const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('application/pdf')) {
        return cb(new Error('Only image and PDF files are allowed!'));
    }
    cb(null, true);
  }
});


module.exports = { upload }
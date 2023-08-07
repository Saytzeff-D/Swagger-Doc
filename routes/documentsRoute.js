const DocumentRouter = require("express").Router()
const { upload } = require("../middlewares/uploadMiddleware")
const { uploadDoc } = require("../controllers/documents.controller")

DocumentRouter.post('/upload', upload.single('file'), uploadDoc);


module.exports = DocumentRouter
const DocumentRouter = require("express").Router()
const { upload } = require("../middlewares/upload.middleware")
const { uploadDoc } = require("../controllers/documents.controller")

DocumentRouter.post('/upload', upload.single('file'), uploadDoc);


module.exports = DocumentRouter
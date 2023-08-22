const ChapterRouter = require("express").Router()
const { isAuth, isAdmin, authJWT } = require("../middlewares/auth.middleware")
const { updateChapter, deleteChapter, createChapter, getChapter, getChapters, chooseChapter } = require("../controllers/chapter.controller")

ChapterRouter.get('/chapters', getChapters);
ChapterRouter.get('/chapters/:id', getChapter);
ChapterRouter.post('/chapters', createChapter);
ChapterRouter.put('/chapters/:id', updateChapter);
ChapterRouter.delete('/chapters/:id', deleteChapter);
ChapterRouter.put('/choose', authJWT, chooseChapter)



module.exports = ChapterRouter
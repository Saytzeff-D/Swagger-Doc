const ChapterRouter = require("express").Router()
const { isAuth, isAdmin } = require("../middlewares/auth.middleware")
const { updateChapter, deleteChapter, createChapter, getChapter, getChapters } = require("../controllers/chapter.controller")

ChapterRouter.get('/chapters', getChapters);
ChapterRouter.get('/chapters/:id', getChapter);
ChapterRouter.post('/chapters', isAuth, isAdmin, createChapter);
ChapterRouter.put('/chapters/:id', isAuth, isAdmin, updateChapter);
ChapterRouter.delete('/chapters/:id', isAuth, isAdmin, deleteChapter);



module.exports = ChapterRouter
const express = require("express")
const Router = express.Router()
const { auth, isAdmin } = require("../Middleware/Auth")
const forumCommentController = require("../Controller/forumCommentController")

Router.post('/create-comment/:post_id', auth, forumCommentController.CreateComment)
Router.get('/get-all', auth, forumCommentController.getAllPost)
Router.put('/update-comment/:comment_id', auth, forumCommentController.updateComment)
Router.delete('/delete-comment/:comment_id', auth, forumCommentController.deletecomment)
module.exports = Router;
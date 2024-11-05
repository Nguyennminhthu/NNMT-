const express = require("express")
const Router = express.Router()
const forumPostController = require("../Controller/forumPostController");
const { auth, isAdmin } = require("../Middleware/Auth")

Router.post('/create-post', auth, forumPostController.CreatePost)
Router.get('/get-only/:post_id', auth, forumPostController.getOnlyPost)
Router.get('/get-all', auth, forumPostController.getAllPost)
Router.put('/update-post/:post_id', auth, forumPostController.updatePost)
Router.delete('/delete-post/:post_id', auth, forumPostController.deletePost)
module.exports = Router;
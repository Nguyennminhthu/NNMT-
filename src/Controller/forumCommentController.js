const { commit } = require("../config/Data");
const Comment = require("../Model/forumCommentModel")

const CreateComment = async (req, res) => {
    const id = req.user.customer_id;
    const { post_id } = req.params;
    const { comment_content } = req.body;

    try {
        await Comment.CreateComment(post_id, id, comment_content);
        res.status(201).json({ message: 'Comment created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllPost = async (req, res) => {
    try {
        const result = await Comment.getAllComments();
        res.status(200).json({ comments: result });
    } catch (error) {
        console.error('Error getting comments:', error);
        res.status(500).json({ message: 'Error getting comments' });
    }
};
const updateComment = async (req, res) => {
    const { comment_id } = req.params;
    const { comment_content } = req.body;

    try {
        await Comment.update(comment_id, comment_content);
        res.status(200).json({ message: 'Comment updated successfully' });
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ message: 'Error updating comment' });
    }
};

const deletecomment = async (req, res) => {
    const { comment_id } = req.params;
    try {
        const result = await Comment.delete(comment_id);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Comment deleted successfully' });
        } else {
            res.status(404).json({ message: 'Comment not found' });
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Error deleting comment' });
    }
};
module.exports = {
    CreateComment,
    getAllPost,
    updateComment,
    deletecomment
}
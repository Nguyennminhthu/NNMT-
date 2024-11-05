const Post = require("../Model/forumPostModel")

const CreatePost = async (req, res) => {

    try {
        const customer_id = req.user.customer_id;
        const { post_title, post_content } = req.body;
        await Post.createPost(customer_id, post_title, post_content);
        res.status(201).json({ message: 'Post created successfully' })
    } catch (error) {
        console.error('Error registering post:', error);
        res.status(500).json({ message: 'Error registering post' });
    }
}
const getOnlyPost = async (req, res) => {
    const { post_id } = req.params
    try {
        const result = await Post.getOnly(post_id)
        res.status(201).json({ message: result })
    } catch (error) {
        onsole.error('Error get post:', error);
        res.status(500).json({ message: 'Error get post' });
    }
}
const getAllPost = async (req, res) => {
    try {
        const result = await Post.getAll();
        res.status(201).json({ message: result })
    } catch (error) {
        onsole.error('Error get post:', error);
        res.status(500).json({ message: 'Error get post' });
    }
}
const updatePost = async (req, res) => {
    const { post_id } = req.params;
    const { post_title, post_content } = req.body;

    try {
        await Post.updatePost(post_id, post_title, post_content);
        res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Error updating post' });
    }
};

const deletePost = async (req, res) => {
    const { post_id } = req.params;
    try {
        const result = await Post.Delete(post_id);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Post deleted successfully' });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Error deleting post' });
    }
};

module.exports = {
    CreatePost,
    getOnlyPost,
    getAllPost,
    updatePost,
    deletePost
}
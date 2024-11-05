const db = require("../config/Data")

const Post = {
    createPost: async (customer_id, post_title, post_content) => {
        const query = 'INSERT INTO forum_posts (customer_id, post_title, post_content) VALUES (?, ?, ?)'
        const value = [customer_id, post_title, post_content];
        return db.query(query, value)
    },
    getOnly: async (post_id) => {
        const query = 'SELECT * FROM forum_posts WHERE post_id = ?';
        const [rows] = await db.query(query, [post_id]);
        return rows[0];
    },
    getAll: async () => {
        const query = 'SELECT * FROM forum_posts';
        const [rows] = await db.query(query);
        return rows;
    },
    updatePost: async (post_id, post_title, post_content) => {
        const query = 'UPDATE forum_posts SET post_title = ?, post_content = ? WHERE post_id = ?';
        const values = [post_title, post_content, post_id];
        return db.query(query, values);
    },
    Delete: async (post_id) => {
        const query = 'DELETE FROM forum_posts WHERE post_id = ?';
        const [result] = await db.query(query, [post_id]);
        return result;;
    }
}
module.exports = Post;
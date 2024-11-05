const db = require('../config/Data')

const Comment = {
    CreateComment: async (post_id, customer_id, comment_content) => {
        const query = 'INSERT INTO forum_comments (post_id, customer_id, comment_content) VALUES (?, ?, ?)';
        const [result] = await db.query(query, [post_id, customer_id, comment_content]);
        return result;
    },
    getAllComments: async () => {
        const query = 'SELECT * FROM forum_comments';
        const [rows] = await db.query(query);
        return rows;
    },
    update: async (comment_id, comment_content) => {
        const query = 'UPDATE forum_comments SET comment_content = ?, comment_date = CURRENT_TIMESTAMP WHERE comment_id = ?';
        const [result] = await db.query(query, [comment_content, comment_id]);
        return result;
    },
    delete: async (id) => {
        const query = 'DELETE FROM forum_comments WHERE comment_id = ?';
        const [result] = await db.query(query, [id]);
        return result;
    }
}
module.exports = Comment;
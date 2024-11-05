const db = require("../config/Data")

const User = {
    findByEmail: async (email) => {
        const query = 'SELECT * FROM admins WHERE email = ?';
        const [rows] = await db.query(query, [email]);
        return rows[0];
    },
    createAdmin: async (username, email, passrowd, role) => {
        const query = 'INSERT INTO admins (username, email, password, role) VALUES (?, ?, ?, ?)'
        const value = [username, email, passrowd, role];
        return db.query(query, value)
    },
    updatepass : async(email, hashedPassword) => {
        return await db.query('UPDATE admins SET password = ? WHERE email = ?', [hashedPassword, email]);
    }
}

module.exports = User
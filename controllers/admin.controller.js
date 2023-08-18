const pool = require("../connections/pool")



const allNotifications = (req, res) => {
    
    const sql = `
        SELECT n.id, n.transaction_id, n.document_id, n.user_id,
            n.type, n.read, n.date,
            t.service_id AS transaction_service_id, t.user_id AS transaction_user_id,
            d.service_id AS document_service_id, d.user_id AS document_user_id,
            u.email AS user_email
        FROM notifications n
        LEFT JOIN transactions t ON n.transaction_id = t.id
        LEFT JOIN documents d ON n.document_id = d.id
        LEFT JOIN users u ON n.user_id = u.id
            `;
    
    pool.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching services:', err);
            return res.status(500).send({ message: 'Internal Server Error' });
        }
    
    
        return res.status(200).send({ notifications: result });
    });
};



const getAllUsers = (req, res) => {
    const sql = `
        SELECT id, email, firstname, lastname, username, isAdmin
        FROM users
    `;
    
    pool.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Internal Server Error', err });
        }

        return res.status(200).json({ users: result });
    });
};



const deleteUser = (req, res) => {
    const userId = req.params.userId;

    const sql = `
        DELETE FROM users
        WHERE id = ?
    `;

    pool.query(sql, [userId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Internal Server Error', err });
        }

        return res.status(200).json({ message: 'User deleted successfully' });
    });
};



const getTransactionNotifications = (req, res) => {
    const sql = `
        SELECT n.id, n.type, n.read, n.date, t.service_id, t.user_id
        FROM notifications n
        JOIN transactions t ON n.transaction_id = t.id
        WHERE n.transaction_id IS NOT NULL AND n.document_id IS NULL AND n.user_id IS NULL
    `;
    
    pool.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Internal Server Error', err });
        }

        return res.status(200).json({ notifications: result });
    });
};


const getDocumentNotifications = (req, res) => {
    const sql = `
        SELECT n.id, n.type, n.read, n.date, d.service_id, d.user_id
        FROM notifications n
        JOIN documents d ON n.document_id = d.id
        WHERE n.document_id IS NOT NULL AND n.transaction_id IS NULL AND n.user_id IS NULL
    `;
    
    pool.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Internal Server Error', err });
        }

        return res.status(200).json({ notifications: result });
    });
};


const getNewUserNotifications = (req, res) => {
    const sql = `
        SELECT n.id, n.type, n.read, n.date, u.id AS user_id
        FROM notifications n
        JOIN users u ON n.user_id = u.id
        WHERE n.user_id IS NOT NULL AND n.transaction_id IS NULL AND n.document_id IS NULL
    `;
    
    pool.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Internal Server Error', err });
        }

        return res.status(200).json({ notifications: result });
    });
};








module.exports = { getAllUsers, deleteUser, allNotifications, getTransactionNotifications, getDocumentNotifications, getNewUserNotifications };
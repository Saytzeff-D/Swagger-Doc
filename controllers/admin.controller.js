const pool = require("../connections/pool")
const bcrypt = require('bcrypt')
const { accessToken } = require("./auth.controller")

const dashboardCount = (req, res)=>{    
    let count = { }
    const adminSql = `SELECT COUNT(*) AS count FROM users WHERE is_Admin = 1`
    const userSql = `SELECT COUNT(*) AS count FROM users WHERE is_Admin = 0`
    const notifSql = `SELECT COUNT(*) AS count FROM notifications`
    const chaptSql = `SELECT COUNT(*) AS count FROM chapters`
    const docSql = `SELECT COUNT(*) AS count FROM documents`
    pool.query(adminSql, (err, result)=>{
        if (!err) {
            count = {...count, admin: result[0].count}
            pool.query(userSql, (err, result)=>{
                if (!err) {
                    count = {...count, users: result[0].count}
                    pool.query(notifSql, (err, result)=>{
                        if (!err) {
                            count = {...count, notifications: result[0].count}
                            pool.query(chaptSql, (err, result)=>{
                                if (!err) {
                                    count = {...count, chapters: result[0].count}
                                    pool.query(docSql, (err, result)=>{
                                        if (!err) {
                                            count = {...count, docs: result[0].count}
                                            res.status(200).json({count})
                                            // Now sending the response to the frontend                                                                                        // 
                                        } else {
                                            res.status(500).json('Internal Server Error')
                                        }
                                    })
                                } else {
                                    res.status(500).json('Internal Server Error')
                                }
                            })
                        } else {
                            res.status(500).json('Internal Server Error')
                        }
                    })
                } else {
                    res.status(500).json('Internal Server Error')
                }
            })
        } else {
            res.status(500).json('Internal Server Error')
        }
    })
}
const allNotifications = (req, res) => {    
    const sql = `
        SELECT n.id, n.transaction_id, n.document_id, n.user_id,
            n.type, n.unread, n.date,
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
            console.error('Error fetching notifications:', err);
            return res.status(500).send({ message: 'Internal Server Error' });
        }
    
        return res.status(200).send({ notifications: result });
    });
};
const getAllUsers = (req, res) => {
    const sql = `
        SELECT id, email, firstname, lastname, username, is_Admin
        FROM users
    `;
    
    pool.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).send({ message: 'Internal Server Error', err });
        }
        return res.status(200).send({ users: result });
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
            return res.status(500).send({ 
                message: 'Internal Server Error', 
                err 
            });
        }
        return res.status(200).send({ 
            message: 'User deleted successfully' 
        });
    });
};
const getTransactionNotifications = (req, res) => {
    const sql = `
        SELECT n.id, n.type, n.unread, n.date, t.service_id, t.user_id
        FROM notifications n
        JOIN transactions t ON n.transaction_id = t.id
        WHERE n.transaction_id IS NOT NULL AND n.document_id IS NULL AND n.user_id IS NULL
    `;
    
    pool.query(sql, (err, result) => {
        if (err) {
            return res.status(500).send({ message: 'Internal Server Error', err });
        }

        return res.status(200).send({ notifications: result });
    });
};
const getDocumentNotifications = (req, res) => {
    const sql = `
        SELECT n.id, n.type, n.unread, n.date, d.service_id, d.user_id
        FROM notifications n
        JOIN documents d ON n.document_id = d.id
        WHERE n.document_id IS NOT NULL AND n.transaction_id IS NULL AND n.user_id IS NULL
    `;
    
    pool.query(sql, (err, result) => {
        if (err) {
            return res.status(500).send({ message: 'Internal Server Error', err });
        }

        return res.status(200).send({ notifications: result });
    });
};
const getNewUserNotifications = (req, res) => {
    const sql = `
        SELECT n.id, n.type, n.unread, n.date, u.id AS user_id
        FROM notifications n
        JOIN users u ON n.user_id = u.id
        WHERE n.user_id IS NOT NULL AND n.transaction_id IS NULL AND n.document_id IS NULL
    `;
    
    pool.query(sql, (err, result) => {
        if (err) {
            return res.status(500).send({ message: 'Internal Server Error', err });
        }

        return res.status(200).send({ notifications: result });
    });
};
const addAdmin = (req, res) => {
    const email = req.body.email;
    const sql = `
        UPDATE users
        SET is_Admin = 1
        WHERE email = ?
    `;
    pool.query(sql, [email], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Internal Server Error', err });
        }else {
            if (result.affectedRows == 1) {
                return res.status(200).json({ status: true, message: 'User has been added as an admin' });
            } else {
                res.status(200).json({status: false, message: 'Such Email does not exist'})
            }
        }        
    });
};
const adminLogin = (req, res) => {
    let payload = req.body
    const values = [payload.email]
    const checkEmail = `SELECT * FROM users WHERE email = ?`
    pool.query(checkEmail, values, async (err, result)=>{
        const user = result
        if (err) {
            return res.status(500).json({message: 'Internal Server Error'})
        }else {
            if (user.length == 0) {
                return res.status(200).json({status: false, message: 'User not found'})
            }else {
                if (await bcrypt.compare(payload.password, user[0].password)) {
                    if (user[0].is_Admin == 1) {
                        const token = accessToken(user[0])
                        res.status(200).json({status: true, token, verify: true})
                    } else {
                        return res.status(200).json({status: false, message: 'You cannot proceed because you are not an admin'})
                    }
                } else {
                    return res.status(200).json({status: false, message: 'Incorrect Password'})
                }
            }
        }        
    })
}
const adminFunc = { 
    getAllUsers, 
    deleteUser, 
    allNotifications, 
    getTransactionNotifications, 
    getDocumentNotifications, 
    getNewUserNotifications, 
    addAdmin, 
    adminLogin, 
    dashboardCount 
};

module.exports = adminFunc
const pool = require("./connections/pool")

const createNotification = (type, id, user) => {
    let sql, description, arrayVar;
    switch (type) {
        case "signup":
            description = `${user.email} joined and registered as a Foreign Wives Reign member`;
            arrayVar = [user.id, type, description]
            sql = `INSERT INTO notifications (user_id, type, description) VALUES(?, ?, ?)`;
            break;
        case "upload":
            description = `${user.email} uploaded a document`;
            arrayVar = [user.id, id, type, description]
            sql = `INSERT INTO notifications (user_id, document_id, type, description) VALUES(?, ?, ?, ?)`;
            break;
        case "transaction":
            description = `${user.email} made a transaction`;
            arrayVar = [user.id, id, type, description]
            sql = `INSERT INTO notifications (user_id, transaction_id, type, description) VALUES(?, ?, ?, ?)`;
            break;
    }
    

    pool.query(sql, arrayVar, (notifErr, notifResult) => {
        if (!notifErr) {
            console.log("Admin notification created");
        } else {
            console.log("Could not create admin notification", notifErr);
        }
    });
}

module.exports = { createNotification };

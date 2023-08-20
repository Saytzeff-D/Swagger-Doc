const pool = require("../connections/pool")

const createTables = (req, res) => {
    const sql = `
        CREATE TABLE chapters (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            image VARCHAR(255),
            description TEXT
        );
    `;
    pool.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Internal Server Error', err });
        }

        const sql2 = `
            CREATE TABLE services (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                image VARCHAR(255),
                price DECIMAL(10, 2),
                chapter_id INT,
                category VARCHAR(50),
                FOREIGN KEY (chapter_id) REFERENCES chapters(id)
            );
        `;
        pool.query(sql2, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Internal Server Error', err });
            }

            const sql3 = `
            CREATE TABLE foreignwr.users (id INT NOT NULL AUTO_INCREMENT , email VARCHAR(255) NOT NULL , password VARCHAR(255) NOT NULL , firstname VARCHAR(255) NULL , lastname VARCHAR(255) NULL , username VARCHAR(255) NULL , phonenum VARCHAR(255) NOT NULL , image VARCHAR(255) NULL , documents TEXT NULL , email_verification_code INT NULL , phone_verification_code INT NULL , is_phone_verified BOOLEAN DEFAULT false , is_Admin BOOLEAN DEFAULT false , chapter_id INT NULL , category VARCHAR(255) NULL , PRIMARY KEY (id), UNIQUE (email))`
            // const sql3 = `
            //     CREATE TABLE users (
            //         id INT AUTO_INCREMENT PRIMARY KEY,
            //         email VARCHAR(255) UNIQUE NOT NULL,
            //         password VARCHAR(255) NOT NULL,
            //         firstname VARCHAR(255),
            //         lastname VARCHAR(255),
            //         username VARCHAR(255),
            //         phonenum VARCHAR(255),
            //         image VARCHAR(255),
            //         documents TEXT,
            //         email_verification_code INT,
            //         phone_verification_code INT,
            //         is_phone_verified BOOLEAN DEFAULT false
            //         isAdmin BOOLEAN DEFAULT false,
            //         chapter_id INT,
            //         category VARCHAR(50),
            //         FOREIGN KEY (chapter_id) REFERENCES chapters(id)
            //     );
            // `;
            pool.query(sql3, (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'Internal Server Error', err });
                }

                const sql4 = `
                    CREATE TABLE transactions (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        service_id INT,
                        user_id INT,
                        price DECIMAL(10, 2),
                        paid BOOLEAN,
                        FOREIGN KEY (service_id) REFERENCES services(id),
                        FOREIGN KEY (user_id) REFERENCES users(id)
                    );
                `;
                pool.query(sql4, (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: 'Internal Server Error', err });
                    }

                    const sql5 = `
                        CREATE TABLE documents (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            service_id INT,
                            user_id INT,
                            name VARCHAR(255) NOT NULL,
                            url VARCHAR(255) NOT NULL,
                            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (service_id) REFERENCES services(id),
                            FOREIGN KEY (user_id) REFERENCES users(id)
                        );
                    `;
                    pool.query(sql5, (err, result) => {
                        if (err) {
                            return res.status(500).json({ message: 'Internal Server Error', err });
                        }

                        const sql6 = `
                            CREATE TABLE notifications (
                                id INT AUTO_INCREMENT PRIMARY KEY,
                                transaction_id INT,
                                document_id INT,
                                user_id INT,
                                type VARCHAR(255) NOT NULL,
                                unread BOOLEAN DEFAULT false,
                                date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                FOREIGN KEY (document_id) REFERENCES documents(id),
                                FOREIGN KEY (transaction_id) REFERENCES transactions(id),
                                FOREIGN KEY (user_id) REFERENCES users(id)
                            );
                        `;
                        pool.query(sql6, (err, result) => {
                            if (err) {
                                return res.status(500).json({ message: 'Internal Server Error', err });
                            }

                            return res.status(200).json({ message: 'Success' });
                        });
                    });
                });
            });
        });
    });
}


const dropAll = (req, res) => {
    const dropTables = [
        'DROP TABLE IF EXISTS notifications;',
        'DROP TABLE IF EXISTS transactions;',
        'DROP TABLE IF EXISTS documents;',
        'DROP TABLE IF EXISTS users;',
        'DROP TABLE IF EXISTS services;',
        'DROP TABLE IF EXISTS chapters;'
    ];
  
    let errorOccurred = false;
    let completedCount = 0;
  
    dropTables.forEach((sql) => {
        pool.query(sql, (err, result) => {
            completedCount++;
    
            if (err) {
                errorOccurred = true;
                console.error('Error dropping table:', err);
            }
    
            if (completedCount === dropTables.length) {
                if (errorOccurred) {
                    return res.status(500).json({ message: 'Error dropping tables', err });
                }
                return res.status(200).json({ message: 'Tables dropped successfully' });
            }
        });
    });
};

  


module.exports = { createTables, dropAll }

// CREATE TABLE `foreignwr`.`users` (`id` INT NOT NULL AUTO_INCREMENT , `email` VARCHAR(255) NOT NULL , `password` VARCHAR(255) NOT NULL , `firstname` VARCHAR(255) NOT NULL , `lastname` VARCHAR(255) NOT NULL , `username` VARCHAR(255) NOT NULL , `phonenum` VARCHAR(255) NOT NULL , `image` VARCHAR(255) NOT NULL , `documents` TEXT NOT NULL , `email_verification_code` INT NOT NULL , `phone_verification_code` INT NOT NULL , `is_phone_verified` BOOLEAN NOT NULL , `is_Admin` BOOLEAN NOT NULL , `chapter_id` INT NOT NULL , `category` VARCHAR(255) NOT NULL , PRIMARY KEY (`id`), UNIQUE (`email`))
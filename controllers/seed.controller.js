const pool = require("../connections/pool")

const createTables = async (req, res) => {
    const sql = `
        CREATE TABLE countries (
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
                image VARCHAR(255)
            );
        `;
        pool.query(sql2, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Internal Server Error', err });
            }

            const sql3 = `
                CREATE TABLE users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    email VARCHAR(255) NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    firstname VARCHAR(255),
                    lastname VARCHAR(255),
                    image VARCHAR(255),
                    documents TEXT,
                    country_id INT,
                    FOREIGN KEY (country_id) REFERENCES countries(id)
                );
            `;
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

                    return res.status(200).json({ message: 'Success' });
                });
            });
        });
    });
}

module.exports = { createTables }

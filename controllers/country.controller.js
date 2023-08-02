const pool = require("../connections/pool")


const getCountries = (req, res) => {
    const sql = 'SELECT * FROM countries';
  
    pool.query(sql, (err, result) => {
      if (err) {
        console.error('Error fetching countries:', err);
        return res.status(500).send({ message: 'Internal Server Error' });
      }

      return res.status(200).send(result);
    });
};


const getCountry = (req, res) => {
    const values = [req.params.id]
    const sql = `SELECT * FROM countries WHERE id = ?`
  
    pool.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error fetching country:', err);
        return res.status(500).send({ message: 'Internal Server Error' });
      }

      return res.status(200).send(result);
    });
};




const createCountry = (req, res) => {
    const { name, image, description } = req.body;
    const values = [ name, image, description ];
    const countryExistsQuery = `SELECT COUNT(*) AS count FROM countries WHERE name = ?`;
    pool.query(countryExistsQuery, [ name ], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
  
        const countryExists = result[0].count > 0;
        if (countryExists) {
            return res.status(409).json({ message: 'Country with the same name already exists' });
        }
        const sql = `INSERT INTO countries (name, image, description) VALUES (?, ?, ?)`;
        pool.query(sql, values, (err, result) => {
            if (err) {
            console.error('Error creating a new country:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
            }
            return res.status(201).json({ message: 'Country created successfully', countryId: result.insertId });
        });
    });
};

  



const updateCountry = (req, res) => {
    const { name, image, description } = req.body;
    const values = [ name, image, description, req.params.id ];

    const sql = `UPDATE countries SET name = ?, image = ?, description = ? WHERE id = ?`;
    
    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error updating country:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Country not found' });
        }
        return res.status(200).json({ message: 'Country updated successfully' });
    });
};
  



const deleteCountry = (req, res) => {
    const sql = `DELETE FROM countries WHERE id = ?`;
    pool.query(sql, [ req.params.id ], (err, result) => {
        if (err) {
            console.error('Error deleting country:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Country not found' });
        }
        return res.status(200).json({ message: 'Country deleted successfully' });
    });
};
  

module.exports = { getCountries, createCountry, getCountry, updateCountry, deleteCountry }
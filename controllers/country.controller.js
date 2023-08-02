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




module.exports = { getCountries }
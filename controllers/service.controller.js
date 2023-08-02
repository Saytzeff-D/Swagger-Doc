const pool = require("../connections/pool")



const allCountryServices = (req, res) => {
    const countryId = req.params.countryId;
    
    const sql = `
        SELECT s.id, s.name, s.description, s.image, s.price, s.category, c.name AS country
        FROM services s
        LEFT JOIN countries c ON s.country_id = c.id
        WHERE c.id = ?`;
    
    pool.query(sql, [countryId], (err, result) => {
        if (err) {
            console.error('Error fetching services:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    
        // Group services under categories like the Airport escorts under Airport category
        const servicesByCategory = {};
        result.forEach((service) => {
            if (!servicesByCategory[service.category]) {
            servicesByCategory[service.category] = [];
            }
            servicesByCategory[service.category].push(service);
        });
    
        return res.status(200).json({ servicesByCategory });
    });
};

  


const getService = (req, res) => {
    const serviceId = req.params.serviceId;

    const sql = 'SELECT * FROM services WHERE id = ?';
  
    pool.query(sql, [serviceId], (err, result) => {
        if (err) {
            console.error('Error fetching service:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        
        if (result.length === 0) {
            return res.status(404).json({ message: 'Service not found' });
        }
    
        const service = result[0];
        return res.status(200).json({ service });
    });
};


module.exports = { allCountryServices, getService }
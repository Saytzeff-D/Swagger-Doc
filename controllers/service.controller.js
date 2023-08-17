const pool = require("../connections/pool")



const allChapterServices = (req, res) => {
    const chapterId = req.params.chapterId;
    
    const sql = `
        SELECT s.id, s.name, s.description, s.image, s.price, s.category, c.name AS chapter
        FROM services s
        LEFT JOIN chapters c ON s.chapter_id = c.id
        WHERE c.id = ?`;
    
    pool.query(sql, [chapterId], (err, result) => {
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



const createService = (req, res) => {
    const { name, description, image, price, chapter_id, category } = req.body;

    const serviceExistsQuery = 'SELECT COUNT(*) AS count FROM services WHERE name = ? AND chapter_id = ?';
    const serviceExistsValues = [name, chapter_id];

    pool.query(serviceExistsQuery, serviceExistsValues, (err, result) => {
        if (err) {
            console.error('Error checking if service exists:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
  
        const serviceExists = result[0].count > 0;
  
        if (serviceExists) {
            return res.status(409).json({ message: 'Service with the same name and chapter already exists' });
        }
  
        const createServiceSql = 'INSERT INTO services (name, description, image, price, chapter_id, category) VALUES (?, ?, ?, ?, ?, ?)';
        const createServiceValues = [name, description, image, price, chapter_id, category];
  
        pool.query(createServiceSql, createServiceValues, (err, result) => {
            if (err) {
                console.error('Error creating a new service:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            return res.status(201).json({ message: 'Service created successfully', serviceId: result.insertId });
        });
    });
};
  


const editService = (req, res) => {
    const serviceId = req.params.serviceId;
    const { name, description, image, price, chapter_id, category } = req.body;

    const updateServiceSql = `
        UPDATE services
        SET name = ?, description = ?, image = ?, price = ?, chapter_id = ?, category = ?
        WHERE id = ?
    `;
    const updateServiceValues = [name, description, image, price, chapter_id, category, serviceId];

    pool.query(updateServiceSql, updateServiceValues, (err, result) => {
        if (err) {
            console.error('Error updating service:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        return res.status(200).json({ message: 'Service updated successfully' });
    });
};



const deleteService = (req, res) => {
    const serviceId = req.params.serviceId;

    const deleteServiceSql = 'DELETE FROM services WHERE id = ?';

    pool.query(deleteServiceSql, [serviceId], (err, result) => {
        if (err) {
            console.error('Error deleting service:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        return res.status(200).json({ message: 'Service deleted successfully' });
    });
};

module.exports = { allChapterServices, getService, createService, editService, deleteService };
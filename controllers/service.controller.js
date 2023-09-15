const pool = require("../connections/pool")

/**
 * @swagger
 * tags:
 *  name: Services
 *  description: The ForeignWR Services API
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     Services:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - image
 *         - price
 *         - chapter_id
 *         - category
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         image:
 *             type: bytes
 *         price:
 *             type: string
 *         chapter_id:
 *             type: string
 *         category:
 *             type: string
 */

/**
 * @swagger
 * /services/chapter/{chapterId}:
 *  get:
 *    summary: gets the services for the specified chapter
 *    tags: [Services]
 *    parameters:
 *      - name: chapterId
 *        in: path
 *        type: string
 *        description: the id of the chapter 
 *    responses:
 *      200:
 *        description: returns service as a key of an array
 *      404:
 *        description: Service not found
 *      500:
 *        description: Internal Server Error
 *    
 */
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

  

/**
 * @swagger
 * /services/{serviceId}:
 *  get:
 *    summary: retrieves the service with the service_id
 *    tags: [Services]
 *    parameters:
 *      - name: serviceId
 *        in: path
 *        type: string
 *        description: the id of the service 
 *    responses:
 *      200:
 *        description: returns service as a key of an array
 *      404:
 *        description: Service not found
 *      500:
 *        description: Internal Server Error
 *    
 */
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


/**
 * @swagger
 * /services/:
 *  post:
 *    summary: create a new service
 *    tags: [Services]
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            required: 
 *              - name
 *              - description
 *              - image
 *              - price
 *              - chapter_id
 *              - category
 *            properties:
 *              name:
 *                type: string
 *              description:
 *                type: string
 *              image:
 *                  type: bytes
 *              price:
 *                  type: string
 *              chapter_id:
 *                  type: string
 *              category:
 *                  type: string
 *            example: 
 *              name: "Airport"
 *              description: "description"
 *              image: "data:image/jpg:base64xjkksjsiiw"
 *              price: "5000"
 *              chapter_id: "1"
 *              category: "category"
 *    responses:
 *      200:
 *        description: Service created successfully 
 *      500:
 *        description: Internal Server Error 
 *    
 */
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
  

/**
 * @swagger
 * /services/{serviceId}:
 *  put:
 *    summary: edit a service
 *    tags: [Services]
 *    parameters: 
 *     - name: authorization
 *       in: header
 *       description: an authorization header
 *       required: true
 *       type: string
 *     - name: serviceId
 *       in: path
 *       description: id of the service
 *       required: true
 *       type: string
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            required: 
 *              - name
 *              - description
 *              - image
 *              - price
 *              - chapter_id
 *              - category
 *            properties:
 *              name:
 *                type: string
 *              description:
 *                type: string
 *              image:
 *                  type: bytes
 *              price:
 *                  type: string
 *              chapter_id:
 *                  type: string
 *              category:
 *                  type: string
 *            example: 
 *              name: "Airport"
 *              description: "description"
 *              image: "data:image/jpg:base64xjkksjsiiw"
 *              price: "5000"
 *              chapter_id: "1"
 *              category: "category"
 *    responses:
 *      200:
 *        description: Success
 *      500:
 *        description: Internal Server Error
 *    
 */
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


/**
 * @swagger
 * /services/{serviceId}:
 *  delete:
 *    summary: deletes a service
 *    tags: [Services]
 *    parameters: 
 *     - name: authorization
 *       in: header
 *       description: an authorization header
 *       required: true
 *       type: string
 *     - name: serviceId
 *       in: path
 *       description: id of the service
 *       type: string
 *    responses:
 *      200:
 *        description: Service deleted successfully
 *      500:
 *        description: Internal Server Error 
 *    
 */
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
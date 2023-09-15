const pool = require("../connections/pool")
const fs = require("fs")
const cloudinary = require("cloudinary")

/**
 * @swagger
 * tags:
 *  name: Documents
 *  description: The Document API
*/

/**
 * @swagger
 * /documents/upload:
 *  post:
 *    summary: uploads document to the server
 *    tags: [Documents]
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            required: 
 *              - service
 *              - name
 *            properties:
 *              service:
 *                type: string
 *              name:
 *                type: string
 *            example: 
 *              service: visa services
 *              name: "name"
 *    responses:
 *      200:
 *        description: Document uploaded successfully
 *      500:
 *        description: Internal Server Error
 *    
 */
const uploadDoc = async (req, res) => {
    const { service, name } = req.body;
    try {
        const url = await cloudinary.uploader.upload(req.file.path).then(result => result.secure_url);
        fs.unlinkSync(req.file.path);
        console.log(url)
        const insertDocumentSql = `
            INSERT INTO documents (user, service, url, name)
            VALUES (?, ?, ?, ?)
        `;
        const insertDocumentValues = [req.user, service, url, name];
        
        pool.query(insertDocumentSql, insertDocumentValues, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            return res.status(201).json({ message: 'Document uploaded successfully', serviceId: result.insertId });
        });
    } catch (err) {
        fs.unlinkSync(req.file.path);
        return res.json({error: err})
    }
}


module.exports = { uploadDoc }
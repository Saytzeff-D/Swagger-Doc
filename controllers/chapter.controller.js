const pool = require("../connections/pool")

/**
 * @swagger
 * components:
 *   schemas:
 *     Chapter:
 *       type: object
 *       required:
 *         - name
 *         - image
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the chapter
 *         name:
 *           type: string
 *         image:
 *           type: string
 *         description:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *  name: Chapters
 *  description: Chapter API
*/

/**
 * @swagger
 * /chapter/chapters:
 *  get:
 *    summary: retrieves all chapters
 *    tags: [Chapters]
 *    parameters: 
 *     - name: authorization
 *       in: header
 *       description: an authorization header
 *       required: true
 *       type: string
 *    responses:
 *      200:
 *        description: returns chapters as a key of an array
 *      500:
 *        description: Error fetching chapters
 *    
 */
const getChapters = (req, res) => {
    const sql = 'SELECT * FROM chapters';
  
    pool.query(sql, (err, result) => {
      if (err) {
        console.error('Error fetching chapters:', err);
        return res.status(500).send({ message: 'Internal Server Error' });
      }
      return res.status(200).send({chapters: result, chapterCount: result.length});      
    });
};

/**
 * @swagger
 * /chapter/chapters/{id}:
 *  get:
 *    summary: retrieves a chapter
 *    tags: [Chapters]
 *    parameters: 
 *     - name: authorization
 *       in: header
 *       description: an authorization header
 *       required: true
 *       type: string
 *     - name: id
 *       in: path
 *       description: id of a chapter
 *       required: true
 *       type: string
 *    responses:
 *      200:
 *        description: returns a chapter as a key of an object
 *      500:
 *        description: Error fetching chapters
 *    
 */
const getChapter = (req, res) => {
    const values = [req.params.id]
    const sql = `SELECT * FROM chapters WHERE id = ?`
  
    pool.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error fetching chapter:', err);
        return res.status(500).send({ message: 'Internal Server Error' });
      }
      return res.status(200).send(result);
      
    });
};

/**
 * @swagger
 * /chapter/choose:
 *  put:
 *    summary: choose a chapter
 *    tags: [Chapters]
 *    parameters: 
 *     - name: authorization
 *       in: header
 *       description: an authorization header
 *       required: true
 *       type: string
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            required: 
 *              - chapter_id
 *            properties:
 *              chapter_id:
 *                type: string
 *            example: 
 *              chapter_id: "1"
 *    responses:
 *      200:
 *        description: Success
 *      500:
 *        description: Internal Server Error
 *    
 */
const chooseChapter = (req, res)=>{
    const payload = req.body
    console.log(payload, req.user)
    const sql = `UPDATE users SET chapter_id = ? WHERE id = ?`
    pool.query(sql, [payload.chapter_id, req.user.id], (err, result)=>{
        if (!err) {
            res.status(200).json({message: 'Success'})
        } else {
            res.status(500).json({message: 'Internal Server Error'})
        }
    })
}

/**
 * @swagger
 * /chapter/chapters:
 *  post:
 *    summary: create a chapters
 *    tags: [Chapters]
 *    parameters: 
 *     - name: authorization
 *       in: header
 *       description: an authorization header
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
 *              - image
 *              - description
 *            properties:
 *              name:
 *                type: string
 *              image:
 *                type: string
 *              description:
 *                type: string  
 *            example: 
 *              name: "Nigeria"
 *              image: "data:image/jpeg:base64xkiod..."
 *              description: "Akwaaba"
 *    responses:
 *      200:
 *        description: Chapter created successfully
 *      201:
 *        description: Chapter with the same name already exists
 *      500:
 *        description: Error fetching chapters
 *    
 */
const createChapter = (req, res) => {
    const { name, image, description } = req.body;
    const values = [ name, image, description ];
    const chapterExistsQuery = `SELECT COUNT(*) AS count FROM chapters WHERE name = ?`;
    pool.query(chapterExistsQuery, [ name ], (err, result) => {
        if (err) {            
            return res.status(500).json({ message: 'Internal Server Error' });
        }
  
        const chapterExists = result[0].count > 0;
        if (chapterExists) {
            return res.status(201).json({ status: false, message: 'Chapter with the same name already exists' });
        }
        const sql = `INSERT INTO chapters (name, image, description) VALUES (?, ?, ?)`;
        pool.query(sql, values, (err, result) => {
            if (err) {    
                console.log(err)        
            return res.status(500).json({ message: 'Internal Server Error' });
            }
            return res.status(200).json({ status: true, message: 'Chapter created successfully', chapterId: result.insertId });
        });
    });
};


/**
 * @swagger
 * /chapter/chapters/{id}:
 *  put:
 *    summary: updates a chapter
 *    tags: [Chapters]
 *    parameters: 
 *     - name: authorization
 *       in: header
 *       description: an authorization header
 *       required: true
 *       type: string
 *     - name: id
 *       in: path
 *       description: id of a chapter
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
 *              - image
 *              - description
 *            properties:
 *              name:
 *                type: string
 *              image:
 *                type: string
 *              description:
 *                type: string  
 *            example: 
 *              name: "Nigeria"
 *              image: "data:image/jpeg:base64xkiod..."
 *              description: "Akwaaba"
 *    responses:
 *      200:
 *        description: chapter updated successfully
 *      404:
 *        description: chapter not found
 *      500:
 *        description: Error fetching chapters
 *    
 */
const updateChapter = (req, res) => {
    const { name, image, description } = req.body;
    const values = [ name, image, description, req.params.id ];

    const sql = `UPDATE chapters SET name = ?, image = ?, description = ? WHERE id = ?`;
    
    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error updating chapter:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Chapter not found' });
        }
        return res.status(200).json({ message: 'Chapter updated successfully' });
    });
};


/**
 * @swagger
 * /chapter/chapters/{id}:
 *  delete:
 *    summary: deletes a chapter
 *    tags: [Chapters]
 *    parameters: 
 *     - name: authorization
 *       in: header
 *       description: an authorization header
 *       required: true
 *       type: string
 *     - name: id
 *       in: path
 *       description: id of a chapter
 *       required: true
 *       type: string
 *    responses:
 *      200:
 *        description: Chapter deleted successfully
 *      500:
 *        description: Internal Server Error
 *    
 */
const deleteChapter = (req, res) => {
    const sql = `DELETE FROM chapters WHERE id = ?`;
    pool.query(sql, [ req.params.id ], (err, result) => {
        if (err) {
            console.error('Error deleting chapter:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (result.affectedRows === 0) {
            return res.status(200).json({ status: false, message: 'Chapter not found' });
        }
        return res.status(200).json({ status: true, message: 'Chapter deleted successfully' });
    });
};
  

module.exports = { getChapters, createChapter, getChapter, updateChapter, deleteChapter, chooseChapter }
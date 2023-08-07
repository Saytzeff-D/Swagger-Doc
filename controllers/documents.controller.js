const pool = require("../connections/pool")
const fs = require("fs")
const cloudinary = require("cloudinary")


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
const pool = require("../connections/pool")


const getChapters = (req, res) => {
    const sql = 'SELECT * FROM chapters';
  
    pool.query(sql, (err, result) => {
      if (err) {
        console.error('Error fetching chapters:', err);
        return res.status(500).send({ message: 'Internal Server Error' });
      }

      return res.status(200).send(result);
    });
};


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
            return res.status(409).json({ message: 'Chapter with the same name already exists' });
        }
        const sql = `INSERT INTO chapters (name, image, description) VALUES (?, ?, ?)`;
        pool.query(sql, values, (err, result) => {
            if (err) {
            console.error('Error creating a new chapter:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
            }
            return res.status(201).json({ message: 'Chapter created successfully', chapterId: result.insertId });
        });
    });
};

  



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
  



const deleteChapter = (req, res) => {
    const sql = `DELETE FROM chapters WHERE id = ?`;
    pool.query(sql, [ req.params.id ], (err, result) => {
        if (err) {
            console.error('Error deleting chapter:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Chapter not found' });
        }
        return res.status(200).json({ message: 'Chapter deleted successfully' });
    });
};
  

module.exports = { getChapters, createChapter, getChapter, updateChapter, deleteChapter }
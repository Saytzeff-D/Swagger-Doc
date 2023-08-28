const pool = require('../connections/pool');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { transporter, mailOption } = require('../mailer');

const sendOtpCode = (req, res) => {
    const email = req.body.email
    const otp = Math.floor(Math.random() * 1000000);

    const sql = `SELECT * FROM users WHERE email = ?`;
    pool.query(sql, [email], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (result.length !== 0) {
            const updateUserCodes = `UPDATE users SET email_verification_code = ? WHERE email = ?`;
            pool.query(updateUserCodes, [otp, email], (err, updateResult) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Internal Server Error' });
                }
                transporter.sendMail(mailOption(otp, email), (err, info) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ status: false, message: 'Fail to send email verification code' });
                    }
                    return res.status(200).json({ status: true, message: 'Verification codes sent successfully', email });
                });
            });
        } else {
            return res.status(200).json({ status: false, message: 'User not found' });
        }
    });
}
const verifyOtpCode = (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const sql = 'SELECT email_verification_code FROM users WHERE email = ?';
    pool.query(sql, [email], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        const userEmailCode = result[0].email_verification_code;        

        if (userEmailCode === parseInt(otp)) {
            const token = jwt.sign({ result: email }, process.env.JWT_SECRET, { expiresIn: '5m' })
            return res.status(200).json({ status: true, message: 'OTP verified successfully', token });
        } else {
            return res.status(200).json({ status: false, message: 'Invalid OTP code' });
        }
    });
}
const resetPassword = async (req, res)=>{
    const email = req.email
    const payload = req.body    
    const password = await bcrypt.hash(payload.password, 10)        
    const sql = `UPDATE users SET password = ? WHERE email = ?`
    pool.query(sql, [password, email], (err, result)=>{
        if (!err) {
            res.status(200).json({status: true, message: 'Password reset successfully'})
        } else {
            console.log(err)
            res.status(500).json({status: false, message: 'Internal Server Error'})
        }
    })
}

module.exports = { sendOtpCode, verifyOtpCode, resetPassword };

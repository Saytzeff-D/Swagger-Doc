const pool = require('../connections/pool');
const { transporter, mailOption } = require('../mailer');

const verifySmsCode = (req, res) => {
    const userId = req.params.userId;
    const smsCode = req.body.smsCode;

    const getUserSmsCodeQuery = 'SELECT phone_verification_code FROM users WHERE id = ?';
    pool.query(getUserSmsCodeQuery, [userId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        const userSmsCode = result[0].phone_verification_code;

        if (userSmsCode === smsCode) {
            const updateUserVerifiedQuery = 'UPDATE users SET is_phone_verified = true WHERE id = ?';
            pool.query(updateUserVerifiedQuery, [userId], (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Internal Server Error' });
                }
                return res.status(200).json({ message: 'SMS code verified successfully' });
            });
        } else {
            return res.status(400).json({ message: 'Invalid SMS code' });
        }
    });
};




const sendPasswordResetCode = (req, res) => {
    const email = req.body.email
    const emailCode = Math.floor(Math.random() * 1000000);

    const sql = `SELECT * FROM users WHERE email = ?`;
    pool.query(sql, [email], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (result.length !== 0) {
            const updateUserCodes = `UPDATE users SET email_verification_code = ? WHERE email = ?`;
            pool.query(updateUserCodes, [emailCode, email], (err, updateResult) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Internal Server Error' });
                }
                transporter.sendMail(mailOption(emailCode, email), (err, info) => {
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





const verifyEmailCodeForReset = (req, res) => {
    const email = req.body.email;
    const emailCode = req.body.emailCode;

    const sql = 'SELECT email_verification_code FROM users WHERE email = ?';
    pool.query(sql, [email], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        const userEmailCode = result[0].email_verification_code;
        console.log(userEmailCode, emailCode)

        if (userEmailCode === emailCode) {
            return res.status(200).json({ status: true, message: 'Email code verified successfully' });
        } else {
            return res.status(200).json({ status: false, message: 'Invalid OTP code' });
        }
    });
};

module.exports = { verifySmsCode, sendPasswordResetCode, verifyEmailCodeForReset };

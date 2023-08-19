const pool = require('../connections/pool');

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



const verifyEmailCode = (req, res) => {
    const userId = req.params.userId;
    const emailCode = req.body.emailCode;

    const getUserEmailCodeQuery = 'SELECT email_verification_code FROM users WHERE id = ?';
    pool.query(getUserEmailCodeQuery, [userId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        const userEmailCode = result[0].email_verification_code;

        if (userEmailCode === emailCode) {
            const updateUserVerifiedQuery = 'UPDATE users SET is_email_verified = true WHERE id = ?';
            pool.query(updateUserVerifiedQuery, [userId], (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Internal Server Error' });
                }
                return res.status(200).json({ message: 'Email code verified successfully' });
            });
        } else {
            return res.status(400).json({ message: 'Invalid email code' });
        }
    });
};

module.exports = { verifySmsCode, verifyEmailCode };

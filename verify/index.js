const twilio = require('twilio');
const pool = require('../connections/pool');


const sendVerificationCode = (res, user) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    const smsCode = Math.floor(Math.random() * 1000000);

    const sql = `SELECT * FROM users WHERE id = ?`;
    pool.query(sql, [user.id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (result.length !== 0) {
            const updateUserCodes = `UPDATE users SET phone_verification_code = ? WHERE id = ?`;
            pool.query(updateUserCodes, [smsCode, user.id], (err, updateResult) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Internal Server Error' });
                }

                client.verify.v2.services('VAe23bef213ac150cd108e53c4b24efc38')
                    .verificationChecks
                    .create({ to: phone, code: smsCode, channel: 'sms' })
                    .then(verification => res.json({message: 'Sent', verify: verification.sid}))
                    .catch(error => {
                        console.error(error);
                        return res.json({message: 'Error sending phone verification code'});
                    });

                return res.status(200).json({ status: true, message: 'Verification code sent successfully' });
            });
        } else {
            return res.status(200).json({ status: false, message: 'User not found' });
        }
    });
};


module.exports = { sendVerificationCode }
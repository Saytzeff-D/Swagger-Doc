const twilio = require('twilio');
const { transporter, mailOption } = require('../mailer');
const pool = require('../connections/pool');


const sendVerificationCodes = (res, email, phone) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    const emailCode = Math.floor(Math.random() * 1000000);
    const smsCode = Math.floor(Math.random() * 1000000);

    const checkEmail = `SELECT * FROM users WHERE email = ?`;
    pool.query(checkEmail, [email], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (result.length !== 0) {
            const updateUserCodes = `UPDATE users SET email_verification_code = ?, phone_verification_code = ? WHERE email = ?`;
            pool.query(updateUserCodes, [emailCode, smsCode, email], (err, updateResult) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Internal Server Error' });
                }

                transporter.sendMail(mailOption(emailCode, email), (err, info) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ status: false, message: 'Fail to send email verification code' });
                    }

                    client.verify.v2.services('VAe23bef213ac150cd108e53c4b24efc38')
                        .verificationChecks
                        .create({ to: phone, code: smsCode, channel: 'sms' })
                        .then(verification => res.json({message: 'Sent', verify: verification.sid}))
                        .catch(error => {
                            console.error(error);
                            return res.json({message: 'Error sending phone verification code'});
                        });

                    return res.status(200).json({ status: true, message: 'Verification codes sent successfully' });
                });
            });
        } else {
            return res.status(200).json({ status: false, message: 'User not found' });
        }
    });
};


module.exports = { sendVerificationCodes }
const twilio = require('twilio');
const pool = require('../connections/pool');


const sendVerificationCode = (res, email) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    const smsCode = Math.floor(Math.random() * 1000000);
    const updateUserCodes = `UPDATE users SET phone_verification_code = ? WHERE email = ?`;
        pool.query(updateUserCodes, [smsCode, email], (err, updateResult) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }

            client.verify.v2.services('VAe23bef213ac150cd108e53c4b24efc38')
                .verificationChecks
                .create({ to: 'phone', code: smsCode, channel: 'sms' })
                .then(verification =>{                        
                    return res.status(200).json({ status: true, verify: false, message: 'Sent', verify: verification.sid });
                })
                .catch(error => {
                    console.log(error);
                    return res.status(500).json({status: true, verify: false, message: 'Error sending phone verification code'});
                });                
        });    
};


module.exports = { sendVerificationCode }
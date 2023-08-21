const twilio = require('twilio');
const pool = require('../connections/pool');


const sendVerificationCode = (res, user) => {    
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    const smsCode = Math.floor(Math.random() * 1000000);
    const updateUserCodes = `UPDATE users SET phone_verification_code = ? WHERE email = ?`;
        pool.query(updateUserCodes, [smsCode, user.email], (err, updateResult) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            client.messages
                .create({
                    body: `Your Foreign WIves Reign (FWR) Verification Code is ${smsCode}`,
                    from: '+16083445163',
                    to: `${user.phonenum}`
                }).then((message)=>{
                    return res.status(200).json({ status: true, verify: false, message: 'Sent', sid: message.sid });
                }).catch((error)=>{
                    console.log(error);
                    return res.status(500).json({status: true, verify: false, message: 'Error sending phone verification code'});
                })                         
        });    
};


module.exports = { sendVerificationCode }
const twilio = require('twilio');
const { transporter, mailOption } = require('../mailer');
const pool = require('../connections/pool');

const sendSMS = (req, res)=>{
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    client.verify.v2.services('VAe23bef213ac150cd108e53c4b24efc38')
        .verifications
        .create({to: '+2347060546163', channel: 'sms'})
        .then(verification =>{
            res.json({message: 'Sent', verify: verification.sid})
        });
}
const verifyEmail = (req, res)=>{
    const email = req.body.email 
    let verificationCode = Math.floor(Math.random()*1000000)
    const checkEmail = `SELECT * FROM users WHERE email = ?`
    pool.query(checkEmail, [email], (err, result)=>{
        if (err) {
            res.status(500).json({message: 'Internal Server Error'})
        } else {
            if (result.length !== 0) {
                transporter.sendMail(mailOption(verificationCode, email), (err, info)=>{
                    if(err){
                        console.log(err)
                        res.status(500).json({status: false, message: 'Fail to send code', email})
                    }else{
                        res.status(200).json({status: true, message: 'Success', email, info})
                    }
                })
            } else {
                res.status(200).json({status: false, message: 'User not found'})
            }
        }
    })    
}

module.exports = { sendSMS, verifyEmail }
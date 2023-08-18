const twilio = require('twilio')

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

module.exports = { sendSMS }
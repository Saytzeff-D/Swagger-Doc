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
}

/**
 * @swagger
 * /verify/sms/:userId:
 *  post:
 *    summary: verifies the otp code sent to the user's phone number
 *    tags: [Verify]
 *    parameters:
 *      - name: userId
 *        in: path
 *        type: string
 *        description: user id of the user
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            required: 
 *              - smsCode
 *            properties:
 *              smsCode:
 *                type: string  
 *            example: 
 *              smsCode: "049870"
 *    responses:
 *      200:
 *        description: SMS Code verified successfully
 *      300:
 *        description: Invalid SMS code
 *      500:
 *        description: Internal Server Error
 *    
 */
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
            return res.status(300).json({ message: 'Invalid SMS code' });
        }
    });
}


module.exports = { sendVerificationCode, verifySmsCode }
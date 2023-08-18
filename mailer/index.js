const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    port: 465,
    auth: {
        user: process.env.SITE_EMAIL,
        pass: process.env.SITE_PASSWORD
    }
})

const mailOption = (code, email)=>{
    return {
        from: process.env.SITE_EMAIL,
        to: email,
        subject: 'Poetically-Me Confirmation Code',
        html: `
            <center>
                <div>
                    <b>Foreign Wives Reign
                </div>
                <p>
                    <strong>Confirmation Code</strong>
                </p>
                <h1 style='color: #FE9747;'>
                    ${code}
                </h1>
                <p>
                    <b>Kindly enter the code to verify your email address.</b>
                </p>
            </center>
        `
    }
}

module.exports = { transporter, mailOption }
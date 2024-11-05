const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const dotenv = require('dotenv');
dotenv.config();

const config = {
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
};

const transporter = nodemailer.createTransport(config);

const MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "CAPSTONE 1",
        link: 'https://example.com/'
    }
});

const forgotPasswordMail = async (user) => {
    const emailContent = {
        body: {
            name: user.id,
            intro: `RESET YOUR PASSWORD!`,
            table: {
                data: [
                    {
                        item: 'Account ID',
                        description: user.id,
                    },
                    {
                        item: 'Email',
                        description: user.email,
                    },
                    {
                        item: 'Link Reset Password',
                        description: `http://localhost:5000/api/user/reset-password/${user.email}/`
                    }
                ]
            },
            outro: 'Thank you!',
        },
    };
    const emailBody = MailGenerator.generate(emailContent);
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: user.email,
        subject: '[CAPSTONE_1 - GROUP_45] RESET PASSWORD',
        html: emailBody,
    };

    return transporter.sendMail(mailOptions);
}

module.exports = {
    forgotPasswordMail
};

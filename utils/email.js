const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `AAM TV <${process.env.EMAIL_FROM}>`;
    };

    newTransport() {
        if(process.env.NODE_ENV === 'production') {
            // cpanel email
            return nodemailer.createTransport({
                host: 'your-cpanel-smtp-host',
                port: your-cpanel-smtp-port,
                secure: false,
                auth: {
                    user: 'your-email@example.com',
                    pass: 'your-email-password'
                }
            });
        }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    };

    async send(template, subject) {
        // 1) Render HTML template
        const html = template;

        // 2) Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html
        };

        // 3) Create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    };

    async sendWelcome() {
        await this.send('welcome', 'Welcome to African Art Music Tv');
    };

    async sendVerificationCode(msg) {
        await this.send(msg, 'Verification code');
    };

    
};

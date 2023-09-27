// const nodemailer = require('nodemailer');
// const htmlToText = require('html-to-text');

// module.exports = class Email {
//     constructor(user, url) {
//         this.to = user.email;
//         this.firstName = user.name.split(' ')[0];
//         this.url = url;
//         this.from = `AAMTV <${process.env.EMAIL_FROM}>`;
//     };

//     newTransport() {
//         if(process.env.NODE_ENV === 'production') {
//             // cpanel email
//             return nodemailer.createTransport({
//                 host: 'your-cpanel-smtp-host',
//                 port: your-cpanel-smtp-port,
//                 secure: false,
//                 auth: {
//                     user: 'your-email@example.com',
//                     pass: 'your-email-password'
//                 }
//             });
//         }

//         return nodemailer.createTransport({
//             host: process.env.EMAIL_HOST,
//             port: process.env.EMAIL_PORT,
//             auth: {
//                 user: process.env.EMAIL_USERNAME,
//                 pass: process.env.EMAIL_PASSWORD
//             }
//         });
//     };

//     async send(template, subject) {
//         // 1) Render HTML template
//         const html = template;

//         // 2) Define email options
//         const mailOptions = {
//             from: this.from,
//             to: this.to,
//             subject,
//             html
//         };

//         // 3) Create a transport and send email
//         await this.newTransport().sendMail(mailOptions);
//     };

//     async sendWelcome() {
//         await this.send('welcome', 'Welcome to African Art Music Tv');
//     };

//     async sendVerificationCode(msg) {
//         await this.send(msg, 'Verification code');
//     };

    
// };


/**
 const sendinBlue = require("sendinblue-api");

// Initialize SendinBlue with your API key
const apiKey = "YOUR_SENDINBLUE_API_KEY";
const sendinBlueClient = new sendinBlue({ apiKey });

// Define your email verification message
const message = {
  to: [{ email: "recipient@example.com" }],
  subject: "Email Verification",
  htmlContent: "<p>Click <a href='verification_link'>here</a> to verify your email.</p>",
};

// Send the email
sendinBlueClient
  .transactionalEmails_sendTransacEmail({ "message": message })
  .then((response) => {
    console.log("Email sent:", response);
  })
  .catch((error) => {
    console.error("SendinBlue error:", error);
  });

 */




const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1', // Replace with your desired AWS region
});

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `AAMTV <${process.env.EMAIL_FROM}>`;
        this.ses = new AWS.SES({ apiVersion: '2010-12-01' });        
    };

    async send(template, subject) {
        
        this.params = {
            Destination: {
              ToAddresses: this.to, // Replace with the recipient's email address
            },
            Message: {
              Body: {
                Text: {
                  Data: template
                },
              },
              Subject: {
                Data: subject,
              },
            },
            Source: process.env.EMAIL_FROM, // Replace with your verified sender email address in SES
          };

          this.ses.sendEmail(this.params, (err, data) => {
            if (err) {
              console.error('Error sending email:', err);
            } else {
              console.log('Email sent successfully:', data.MessageId);
            }
          });
    };

    async sendWelcome() {
        await this.send('welcome', 'Welcome to African Art Music Tv');  
    };

    async sendVerificationCode(msg) {
        
    };  
};
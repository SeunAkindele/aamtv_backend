const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // Create a transporter

        // for gmail which is not good for production
        /*const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }

            // Activate in gmail account "less secure app" option
        });*/

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

    // Define the email options
    const mailOptions = {
        from: 'Oriade Akindele <oriadeakindele@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: 
    }
    // Send email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
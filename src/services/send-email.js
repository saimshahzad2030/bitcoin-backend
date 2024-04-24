const nodemailer = require('nodemailer');



const sendEmail = async (userEmail, subject, message, req, res) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'saimshehzad2040@gmail.com',
            pass: 'grtd dmvh rjdw vlbo'
        },
    });
  
    const mailOptions = {
        from: 'noreply@get2Gether.com',
        to: userEmail,
        subject: subject,
        text: message,
    };
  
  await transporter.sendMail(mailOptions);


}

module.exports = sendEmail
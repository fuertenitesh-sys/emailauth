import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  try {
    // Ye nodemailer ka ek transporter (courier/daakiya) banata hai jo emails deliver karega.
    let transporter;

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      // Agar .env me real email settings hain (Jaise Gmail), toh usko use karega.
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // DEVELOPMENT KE LIYE (Agar real email nahi hai): 
      // Ye ek fake Ethereal account banata hai taaki email test ho sake bina original account ke.
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      });
      console.log('Using Ethereal (Fake) Email for testing.');
    }

    // Email bhejne ki puri setting (Kisko, kahan se, kya topic hai, aur message kya hai)
    const message = {
      from: `${process.env.FROM_NAME || 'EmailAuth Team'} <${process.env.FROM_EMAIL || 'noreply@emailauth.com'}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html, // Agar HTML design bhejna ho
    };

    // Yahan actual mein email send ho raha hai
    const info = await transporter.sendMail(message);

    // Agar fake email use hua hai toh console me ek link generate hogi jahan se hum email padh sakte hain
    if (!process.env.SMTP_HOST) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    return true;
  } catch (error) {
    console.error("Error sending email: ", error);
    return false;
  }
};

export default sendEmail;

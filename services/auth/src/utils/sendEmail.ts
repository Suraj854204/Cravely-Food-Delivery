import nodemailer from "nodemailer";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

const sendEmail = async ({ to, subject, html }: SendEmailOptions) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL as string,
      pass: process.env.SMTP_PASSWORD as string,
    },
  });

  await transporter.sendMail({
    from: `"Cravely" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html,
  });
};

export default sendEmail;
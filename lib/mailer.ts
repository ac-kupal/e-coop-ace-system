import nodemailer from "nodemailer"
import { emailTemplateNames, getTemplate, transformer } from "./server-utils";

export const sendMail = async (subject : string, toEmail : string, templateName : emailTemplateNames, values : Record<string, any>) : Promise<boolean> => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PW,
    },
  });

  var mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: toEmail,
    subject: subject,
    html : transformer(getTemplate(templateName), values)
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error: Error | null, info) {
      if (error) {
        console.error("[NodeMailer Error] : Error sending email:", error);
        reject(error);
      } else {
        resolve(true);
      }
    });
  });
}
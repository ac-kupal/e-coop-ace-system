import { promises as fs } from "fs";
import nodemailer from "nodemailer";
import * as handlebars from "handlebars";

type emailTemplates = "vote-submit.html"

const getEmailTemplate = async(templateFile : emailTemplates, payload : Record<string, any>) => {
    const templateContent = await fs.readFile(`${process.cwd()}/email-templates/${templateFile}`, 'utf8') 
    const template = handlebars.compile(templateContent)
    const generatedTemplate = template(payload);
    return generatedTemplate
}

export const sendMail = async (
    subject: string,
    toEmail: string,
    templateName: emailTemplates,
    payload: Record<string, any>,
): Promise<boolean> => {
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
        html : await getEmailTemplate(templateName, payload)
    };
   
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function(error: Error | null, info) {
            if (error) {
                console.error("[NodeMailer Error] : Error sending email:", error);
                reject(error);
            } else {
                resolve(true);
            }
        });
    });
};

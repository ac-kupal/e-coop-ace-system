import { promises as fs } from "fs";
import nodemailer from "nodemailer";
import * as handlebars from "handlebars";
import path from "path";
import { TMailTemplate } from "@/types";

const getEmailTemplate = async ( {templateFile, payload} : { templateFile: string, payload: Record<string, any>} ) => {
    const templateContent = await fs.readFile(
        path.join(process.cwd(), "public", "email-templates", templateFile),
        "utf8",
    );
    const template = handlebars.compile(templateContent);
    const generatedTemplate = template(payload);
    return generatedTemplate;
};


interface ISendMailProps { 
    subject : string,
    toEmail : string,
    template : TMailTemplate 
}

export const sendMail = async ({ subject, toEmail, template } : ISendMailProps): Promise<boolean> => {
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
        html: await getEmailTemplate(template)
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

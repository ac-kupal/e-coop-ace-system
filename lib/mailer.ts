import path from "path";
import { promises as fs } from "fs";
import nodemailer from "nodemailer";
import * as handlebars from "handlebars";
import { ISendMailProps, TMailSendObject } from "@/types";

const getEmailTemplate = async ({ templateFile, payload } : { templateFile: string; payload: Record<string, any> }) => {
    const templateContent = await fs.readFile(
        path.join(process.cwd(), "public", "email-templates", templateFile),
        "utf8"
    );
    const template = handlebars.compile(templateContent);
    const generatedTemplate = template(payload);
    return generatedTemplate;
};

export const sendMail = async (sendMailsContent: ISendMailProps[]) : Promise<TMailSendObject> => {
    var transporter = nodemailer.createTransport({
        pool: true,
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PW,
        },
    });

    let successSend: { success: true; to: string }[] = [];
    let errorSend: { success: false; to: string; reason: string }[] = [];

    await Promise.all(
        sendMailsContent.map(async (mailContent) => {
            const { subject, toEmail, template } = mailContent;

            var mailOptions = {
                from: process.env.NODEMAILER_EMAIL,
                to: toEmail,
                subject: subject,
                html: await getEmailTemplate(template),
            };

            return new Promise((resolve, reject) => {
                transporter.sendMail(
                    mailOptions,
                    function (error: Error | null, info) {
                        if (error) {
                            console.error(
                                "[NodeMailer Error] : Error sending email : Error -> ",
                                error
                            );
                            errorSend.push({
                                success: false,
                                to: mailOptions.to,
                                reason: error.message,
                            });
                            reject(error);
                        } else {
                            console.log(
                                "[NodeMailer Success] : Email sent to " +
                                    mailOptions.to
                            );
                            successSend.push({
                                success: true,
                                to: mailOptions.to,
                            });
                            resolve(true);
                        }
                    }
                );
            });
        })
    );

    transporter.close();

    return { successSend, errorSend };
};

import path from "path";
import DOMPurify from "dompurify";
import { promises as fs } from "fs";
import * as handlebars from "handlebars";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

import { ISendMailProps, TMailSendObject } from "@/types";

const getEmailTemplate = async ({
    templateFile,
    payload,
}: {
    templateFile: string;
    payload: Record<string, any>;
}) => {
    const templateContent = await fs.readFile(
        path.join(process.cwd(), "public", "email-templates", templateFile),
        "utf8"
    );
    const template = handlebars.compile(templateContent);
    const generatedTemplate = template(payload);

    const sanitizedTemplate = DOMPurify.sanitize(generatedTemplate);

    return sanitizedTemplate;
};

const mailerSend = new MailerSend({
    apiKey: process.env.MAILER_SEND_API_KEY || "",
});

const validateEnv = () => {
    if (!process.env.MAILER_SEND_API_KEY)
        throw new Error(
            "MAILER_SEND_API_KEY is missing in environment variables."
        );
    if (!process.env.MAILER_SEND_DOMAIN)
        throw new Error(
            "MAILER_SEND_DOMAIN is missing in environment variables."
        );
};

const sendEmail = async (
    toEmail: string,
    subject: string,
    htmlContent: string
) => {
    try {
        const sentFrom = new Sender(process.env.MAILER_SEND_DOMAIN!, "eCoop");
        const recipients = [new Recipient(toEmail, "Recipient")];

        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setSubject(subject)
            .setHtml(htmlContent)
            .setText("This is a fallback text content.");

        await mailerSend.email.send(emailParams);
        return { success: true, to: toEmail };
    } catch (error: any) {
        return { success: false, to: toEmail, reason: error.message };
    }
};

export const sendMail = async (
    sendMailsContent: ISendMailProps[],
    options: { isBulkSend?: boolean } = {}
): Promise<TMailSendObject> => {
    validateEnv();
    const { isBulkSend = false } = options;
    let successSend: { success: true; to: string }[] = [];
    let errorSend: { success: false; to: string; reason: string }[] = [];

    try {
        const sentFrom = new Sender(process.env.MAILER_SEND_DOMAIN!, "eCoop");

        if (isBulkSend) {
            const bulkEmails = await Promise.all(
                sendMailsContent.map(async ({ subject, toEmail, template }) => {
                    const recipients = [new Recipient(toEmail, "Recipient")];

                    return new EmailParams()
                        .setFrom(sentFrom)
                        .setTo(recipients)
                        .setSubject(subject)
                        .setHtml(await getEmailTemplate(template))
                        .setText("This is a fallback text content.");
                })
            );

            try {
                const response = await mailerSend.email.sendBulk(bulkEmails);

                successSend = sendMailsContent.map(({ toEmail }) => ({
                    success: true,
                    to: toEmail,
                }));
            } catch (error: any) {
                // Extracting API limit error message
                const errorMessage =
                    error.response?.body?.message ||
                    "Unknown error occurred during bulk sending";

                errorSend = sendMailsContent.map(({ toEmail }) => ({
                    success: false,
                    to: toEmail,
                    reason: errorMessage,
                }));
            }
        } else {
            const results = await Promise.all(
                sendMailsContent.map(async ({ subject, toEmail, template }) => {
                    const htmlContent = await getEmailTemplate(template);
                    return sendEmail(toEmail, subject, htmlContent);
                })
            );

            successSend = results.filter((result) => result.success) as {
                success: true;
                to: string;
            }[];
            errorSend = results.filter((result) => !result.success) as {
                success: false;
                to: string;
                reason: string;
            }[];
        }
    } catch (error: any) {
        const errorMessage =
            error.response?.body?.message ||
            "Unknown error occurred during email sending";

        errorSend = sendMailsContent.map(({ toEmail }) => ({
            success: false,
            to: toEmail,
            reason: errorMessage,
        }));
    }

    return { successSend, errorSend };
};

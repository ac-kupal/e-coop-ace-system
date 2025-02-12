import path from "path";
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
  return generatedTemplate;
};

const mailerSend = new MailerSend({
  apiKey: process.env.MAILER_SEND_API_KEY || "",
});

const validateEnv = () => {
  if (!process.env.MAILER_SEND_API_KEY)
    throw new Error("MAILER_SEND_API_KEY is missing in environment variables.");
  if (!process.env.MAILER_SEND_DOMAIN)
    throw new Error("MAILER_SEND_DOMAIN is missing in environment variables.");
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
    console.log("[MailerSend Success] : Email sent to", toEmail);

    return { success: true, to: toEmail };
  } catch (error: any) {
    console.error(
      "[MailerSend Error] : Failed to send email to",
      toEmail,
      error.message
    );
    return { success: false, to: toEmail, reason: error.message };
  }
};

/**
 * Sends emails using MailerSend, supporting both bulk and single email sending.
 * @param sendMailsContent - Array of emails to be sent.
 * @param options - Configuration options (e.g., isBulkSend).
 * @returns {Promise<TMailSendObject>}
 */
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

      const response = await mailerSend.email.sendBulk(bulkEmails);
      console.log(
        "[MailerSend Success] : Bulk emails sent successfully",
        response
      );

      successSend = sendMailsContent.map(({ toEmail }) => ({
        success: true,
        to: toEmail,
      }));
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
    console.error("[MailerSend Error] : General sending error:", error.message);
    errorSend = sendMailsContent.map(({ toEmail }) => ({
      success: false,
      to: toEmail,
      reason: error.message,
    }));
  }

  return { successSend, errorSend };
};

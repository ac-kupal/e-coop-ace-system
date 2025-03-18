import path from "path";
import { promises as fs } from "fs";
import * as handlebars from "handlebars";

const FROM_EMAIL = process.env.EMAIL_SENDER!;

import {
    IMailer,
    TMailTemplate,
    IFinalSendMail,
    TMailSendObject,
    ISendMailRawProps,
} from "@/types";

const getEmailTemplate = async ({ templateFile, payload }: TMailTemplate) => {
    const templateContent = await fs.readFile(
        path.join(process.cwd(), "public", "email-templates", templateFile),
        "utf8"
    );
    const template = handlebars.compile(templateContent);
    const generatedTemplate = template(payload);
    return generatedTemplate;
};

export const sendMail = async (
    sendMailsContent: ISendMailRawProps[],
    mailer: IMailer
): Promise<TMailSendObject> => {
    let successSend: { success: true; to: string }[] = [];
    let errorSend: { success: false; to: string; reason: string }[] = [];

    for (const mailContent of sendMailsContent) {
        const { subject, to, mailTemplate } = mailContent;
        const content = await getEmailTemplate(mailTemplate);

        const preparedMail: IFinalSendMail = {
            to,
            subject,
            content,
        };

        const sendMailResult = await mailer.sendMail(
            [preparedMail],
            FROM_EMAIL
        );

        successSend = successSend.concat(sendMailResult.successSend);
        errorSend = errorSend.concat(sendMailResult.errorSend);
    }

    console.log("Mail Task:", { successSend, errorSend });
    return { successSend, errorSend };
};

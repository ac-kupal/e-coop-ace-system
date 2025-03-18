import mailchimp, { MessagesMessage } from "@mailchimp/mailchimp_transactional";

import { IFinalSendMail, IMailer, TMailSendObject } from "@/types";

const API_KEY = process.env.MAILCHIMP_API_KEY!;

export class MailchimpMailer implements IMailer {
    private client: mailchimp.ApiClient;

    constructor() {
        this.client = mailchimp(API_KEY);
    }

    async sendMail(
        sendMailsContent: IFinalSendMail[],
        fromEmail: string
    ): Promise<TMailSendObject> {
        let successSend: { success: true; to: string }[] = [];
        let errorSend: { success: false; to: string; reason: string }[] = [];

        await Promise.all(
            sendMailsContent.map(async (mailContent) => {
                const { subject, to, content } = mailContent;

                const message: MessagesMessage = {
                    from_email: fromEmail,
                    to: [{ email: to }],
                    subject,
                    html: content,
                };

                try {
                    const sendMailResponse = await this.client.messages.send({
                        message,
                    });

                    const responses = Array.isArray(sendMailResponse)
                        ? sendMailResponse
                        : [sendMailResponse];

                    responses.forEach((mailStatus) => {
                        if (
                            mailStatus.status === "sent" ||
                            mailStatus.status === "queued" ||
                            mailStatus.status === "scheduled"
                        ) {
                            successSend.push({
                                success: true,
                                to: mailStatus.email,
                            });
                        } else {
                            console.log("ERR: ", mailContent);
                            errorSend.push({
                                success: false,
                                to: mailContent.to,
                                reason:
                                    mailStatus.status?.toString() ??
                                    "Unknown Error",
                            });
                        }
                    });
                } catch (error: any) {
                    console.error(
                        "[Mailchimp Error] Error sending email:",
                        error.message
                    );

                    if (error.response?.data) {
                        errorSend.push({
                            success: false,
                            to,
                            reason: JSON.stringify(error.response.data),
                        });
                    } else {
                        errorSend.push({
                            success: false,
                            to,
                            reason: error.message || "Unknown Mailchimp error",
                        });
                    }
                }
            })
        );

        return { successSend, errorSend };
    }
}

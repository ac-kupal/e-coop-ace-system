import mailchimp, {
    MessagesMessage,
    RejectReason,
} from "@mailchimp/mailchimp_transactional";

import { IFinalSendMail, IMailer, TMailSendObject } from "@/types";

const API_KEY = process.env.MAILCHIMP_API_KEY!;

export class MailchimpMailer implements IMailer {
    private client: mailchimp.ApiClient;

    constructor() {
        this.client = mailchimp(API_KEY);
    }

    translateReason(rejectReason: RejectReason) {
        switch (rejectReason) {
            case "hard-bounce":
                return "Invalid email address or the email does not exist";
            case "soft-bounce":
                return "Recepient's email mailbox possibly full";
            default:
                return "Unknown error sending email";
        }
    }

    async sendMail(
        sendMailsContent: IFinalSendMail[],
        fromEmail: string
    ): Promise<TMailSendObject> {
        let successSend: { success: true; to: string }[] = [];
        let errorSend: {
            success: false;
            to: string;
            reason: string;
            reasonDescription?: string;
        }[] = [];

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
                            errorSend.push({
                                success: false,
                                to: mailContent.to,
                                reason:
                                    mailStatus.status?.toString() ??
                                    "Unknown Error",
                                reasonDescription:
                                    mailStatus.status === "rejected"
                                        ? this.translateReason(
                                              mailStatus.reject_reason as RejectReason
                                          )
                                        : "unkown reason",
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
                            reasonDescription : 'unknown reason'
                        });
                    }
                }
            })
        );

        return { successSend, errorSend };
    }
}

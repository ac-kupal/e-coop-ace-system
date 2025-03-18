export type TMailTemplate =
    | {
          templateFile: "vote-submit.html";
          payload: {
              iconImage: string;
              participantName: string;
              title: string;
              coverImage: string;
              eventLink: string;
              voted: string;
              ecoopLogo: string;
          };
      }
    | {
          templateFile: "vote-otp.html";
          payload: {
              iconImage: string;
              otp: string;
              memberName: string;
              eventTitle: string;
              eventCoverImage: string;
              eventLink: string;
              ecoopLogo: string;
          };
      };

export interface IMailer {
    sendMail(
        sendMailsContent: IFinalSendMail[],
        fromEmail: string
    ): Promise<TMailSendObject>;
}

export type TMailSendObject = {
    successSend: { success: true; to: string }[];
    errorSend: { success: false; to: string; reason: string }[];
};

export interface ISendMailRawProps {
    subject: string;
    to: string;
    mailTemplate: TMailTemplate;
}

export interface IFinalSendMail {
    subject: string;
    to: string;
    content: string;
}

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
      };
    };

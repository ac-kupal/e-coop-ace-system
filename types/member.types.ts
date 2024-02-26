import { $Enums, EventAttendees } from "@prisma/client";

export type TCreateMember = {
    passbookNumber: string;
    firstName: string;
    middleName: string;
    lastName: string;
    gender: $Enums.gender;
    birthday: Date;
    contact: string;
    picture: string | null;
    voteOtp: string
    eventId:number
}

export  type TMember = EventAttendees
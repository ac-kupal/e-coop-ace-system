import { EventAttendees } from "@prisma/client";

export type TMemberAttendees = EventAttendees;

export type TMemberAttendeesMinimalInfo = {
    id : string;
    firstName: string;
    middleName: string;
    lastName: string;
    contact: string;
    picture: string | null;
    passbookNumber : string;
    registered: boolean;
    voted: boolean;
};

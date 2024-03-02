import { EventAttendees } from "@prisma/client";
import { TUserMinimalInfo } from "./user.types";

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

export type TMemberAttendeesWithRegistrationAssistance = TMemberAttendees & {
    registeredBy? : TUserMinimalInfo
}
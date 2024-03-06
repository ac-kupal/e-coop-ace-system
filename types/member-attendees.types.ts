import { EventAttendees } from "@prisma/client";
import { TUserMinimalInfo } from "./user.types";
import { TIncentiveClaimsWithIncentiveAndAssisted } from "./incentive-claims.types";

export type TMemberAttendees = EventAttendees;

export type TMemberAttendeesMinimalInfo = {
    id : string;
    firstName: string;
    middleName: string | null;
    lastName: string;
    contact: string | null;
    picture: string | null;
    passbookNumber : string;
    registered: boolean;
    voted: boolean;
};

export type TMemberAttendeesWithRegistrationAssistance = TMemberAttendees & {
    registeredBy? : TUserMinimalInfo
}

export type TMemberAttendeeMinimalInfo = {
    passbookNumber: string;
    firstName: string;
    lastName: string;
    registered: boolean;
}

export type TMemberAttendeesMinimalInfoWithClaims = TMemberAttendeesMinimalInfo & {
    incentiveClaimed : TIncentiveClaimsWithIncentiveAndAssisted[]
}
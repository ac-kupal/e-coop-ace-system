import z from "zod"
import { TBranch, TCoop, TElection } from ".";
import { EventType } from "@prisma/client";
import { Event, MemberSearchMode } from "@prisma/client";
import { eventSettingsSchema } from "@/validation-schema/event-settings";

export type TCreateEvent = {
    title: string;
    description: string;
    date: Date;
    location: string;
    category?: EventType;
    deleted: boolean;
    branchId:number,
    coopId:number,
};
export type Election = {
    title: string;
    description: string;
};
export type TCreateEventWithElection = {
    title: string;
    description: string;
    date: Date;
    location: string;
    category?: EventType;
    electionName?: string;
};

export type TUpdateEvent = {
    title: string;
    description: string;
    date: Date;
    location: string;
    coverImage: string;
    branchId:number;
};

export type TEvent = Event;

export type TEventWithElection = Event & { election: TElection | null};
export type TEventWithElectionWithCoopWithBranch = Event & { election: TElection | null, branch:TBranch, coop:TCoop };


export type TEventSettingsUpdate = z.infer<typeof eventSettingsSchema>;

export type TEventSettings = {
    registrationOnEvent: boolean;
    defaultMemberSearchMode: MemberSearchMode;
};

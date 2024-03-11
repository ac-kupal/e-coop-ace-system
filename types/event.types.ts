import z from "zod"
import { TElection } from ".";
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
};

export type TEvent = Event;

export type TEventWithElection = Event & { election: TElection | null };

export type TEventSettingsUpdate = z.infer<typeof eventSettingsSchema>;

export type TEventSettings = {
    registrationOnEvent: boolean;
    defaultMemberSearchMode: MemberSearchMode;
};

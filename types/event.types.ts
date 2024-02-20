import { Event } from "@prisma/client";
import { EventType } from "@prisma/client";
import { TElection } from "./election.types";

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
};

export type TEvent = Event;

export type TEventWithElection = Event & { election: TElection };

import { Election, Event } from "@prisma/client";
import { EventType } from "@prisma/client";
import { TElection } from "../election/TCreateElection";

export type TCreateEvent = {
   title: string;
   description: string;
   date: Date;
   location: string;
   category: EventType;
   deleted: boolean;
   electionId:number;
};

export type TEvent = Event;
export type TCreateEventWithElection = TCreateEvent & { election?: TElection}
export type TEventWithElection = TEvent & {election: Election}


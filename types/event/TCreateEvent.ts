import { Event } from "@prisma/client";
import { EventType } from "@prisma/client";

export type TCreateEvent = {
   title: string;
   description: string;
   date: Date;
   location: string;
   category: EventType;
   deleted: boolean;
};

export type TEvent = Event;

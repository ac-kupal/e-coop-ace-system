import {  $Enums, ElectionStatus, Event } from "@prisma/client";
import { EventType } from "@prisma/client";
import {  Election as election } from "@prisma/client";

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
   electionName?:string;
};

export type TUpdateEvent = {
   title:string,
   description: string;
   date: Date;
   location: string;
}

export type TEvent = Event&{election:election}


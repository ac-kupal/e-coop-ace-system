import db from "@/lib/database";
import { validateId } from "@/lib/server-utils";
import { TCreateElection } from "@/types";
import { createEventSchema, updateEventSchema } from "@/validation-schema/event";
import { VotingEligibility } from "@prisma/client";
import { z } from "zod";

export const createEvent = async (
   event: z.infer<typeof createEventSchema>,election:TCreateElection, includeElection = false ,userId:number) => {
      try {
      const CreateEvent = await db.event.create({
         data:includeElection ? {
            title: event.title,
            description: event.description,
            date: event.date,
            location: event.location,
            category: event.category,
            deleted: false,
            coverImage:event.coverImage,
            election:{
               create:{
                  electionName:election.electionName,
                  status:election.status,
                  voteEligibility:VotingEligibility.MIGS,
                  createdBy:userId
               }
            },
            createdBy:userId,
         }:{
            title: event.title,
            description: event.description,
            date: event.date,
            location: event.location,
            category: event.category,
            deleted: false,
            coverImage:event.coverImage,
            createdBy:userId,
         },
         include:{
            election:true
         }
      })
      return CreateEvent
   } catch (error) {
      console.log(error);
   }
};

export const getEvent = async (eventId: number) => {
   try {
      const id = Number(eventId)
      return await db.event.findUnique({
         where: { id: id, deleted: false },
         include: { election: true, },
      });
   } catch (error) {
      console.log(error);
   }
};

export const getAllEvent = async (includeElection = false) => {
   try {
      return await db.event.findMany({
         where: {
            deleted: false,
         },
         orderBy: { createdAt: "desc" },
         select: {
            id: true,
            title: true,
            description: true,
            location: true,
            category: true,
            date: true,
            election: includeElection,
            coverImage:true
         },
      });
   } catch (error) {
      console.log(error);
   }
};

export const updateEvent = async (
   event: z.infer<typeof updateEventSchema>,
   eventId: number,
   userId?: number
) => {
   try {
      const updateEvent = await db.event.update({
         where: { id: eventId },
         data: {
            title: event.title,
            description: event.description,
            location: event.location,
            date: event.date,
            updatedBy: userId,
         },
      });
      return updateEvent;
   } catch (error) {
      console.log(error);
   }
};

export const deleteEvent = async (
   userId: number,
   eventId: number,
   isPermanentDelete = false
) => {
   try {
      if (isPermanentDelete) await db.event.delete({ where: { id: eventId } });
      return await db.event.update({
         where: { id: eventId },
         data: {
            deleted: true,
            deletedBy: userId,
         },
      });
   } catch (error) {
      console.log(error);
   }
};

export const getElectionId = async (eventId: number) => {
   try {
      const id = Number(eventId)
      const event = await db.event.findUnique({
         where: { id: id, deleted: false },
         include: { election: true, },
      });
      return event?.election?.id 
   } catch (error) {
      console.log(error);
   }
};
export const getElection = async (eventId: number) => {
   try {
      const id = Number(eventId)
      const event = await db.event.findUnique({
         where: { id: id, deleted: false },
         include: { election: true, },
      });
      if(!event) return
      return event.election 
   } catch (error) {
      console.log(error);
   }
}

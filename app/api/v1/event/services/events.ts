import db from "@/lib/database";
import { TCreateEvent, TCreateEventWithElection } from "@/types/event/TCreateEvent";
import { createEventSchema } from "@/validation-schema/event";
import { z } from "zod";

export const createEvent = async (event: z.infer<typeof createEventSchema>, electionId:number) => {
   try {
       return await db.event.create({
         data: {
            title: event.title,
            description: event.description,
            date: event.date,
            location: event.location,
            category: event.category,
            deleted: false,
            electionId:electionId
         } 
      });
   } catch (error) {
      console.log(error);
   }
};

export const getAllEvent = async () => {
   try {
      return await db.event.findMany({where : { deleted : false }, orderBy : { createdAt : "desc" }});
   } catch (error) {
      console.log(error);
   }
};

export const deleteEvent = async (userId:number,eventId: number,isPermanentDelete = false) => {
   try {
      if (isPermanentDelete) await db.event.delete({ where: { id: eventId } });
      return await db.event.update({
         where: { id: eventId },
         data: {
            deleted: true,
            deletedBy:userId
         },
      });
   } catch (error) {
      console.log(error);
   }
};

import db from "@/lib/database";
import { TCreateEvent, TCreateEventWithElection } from "@/types/event/TCreateEvent";

export const createEvent = async (event: TCreateEventWithElection, withElection = false) => {
   try {
      let events : TCreateEventWithElection = withElection ? {
         title: event.title,
         description: event.description,
         date: event.date,
         location: event.location,
         category: event.category,
         deleted: false,
      } : {
         title: event.title,
         description: event.description,
         date: event.date,
         location: event.location,
         category: event.category,
         deleted: false,
         election:event.election
      }
      // return await db.event.create({data: events });
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

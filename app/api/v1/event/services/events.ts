import db from "@/lib/database";
import { TCreateEvent } from "@/types/event/TCreateEvent";

export const createEvent = async (event: TCreateEvent) => {
   return await db.event.create({
      data: {
         title: event.title,
         description: event.description,
         date: event.date,
         location: event.location,
         category: event.category,
         deleted: false,
      },
   });
};

export const getAllEvent = async () => {
   try {
      return await db.event.findMany({});
   } catch (error) {
      console.log(error);
   }
};

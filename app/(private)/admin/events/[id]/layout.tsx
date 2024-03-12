import db from "@/lib/database"
import React, { ReactNode } from "react";

import NotFound from "./_components/not-found";
import EventNav from "./_components/event-nav";
import { eventIdSchema } from "@/validation-schema/commons";
import { Separator } from "@/components/ui/separator";
import { CalendarCheck, CalendarDays, MapPin } from "lucide-react";
import moment from "moment";

type Props = {
   children: ReactNode;
   params: { id: number; electionId: number };
};

const EventLayout = async ({ children, params }: Props) => {

    const eventIdValidation = eventIdSchema.safeParse(params.id)

    if(!eventIdValidation.success) throw eventIdValidation.error.issues[0].message

   const event = await db.event.findUnique({ where : { id : eventIdValidation.data }, include : { election : true }})

   if (!event) return <NotFound />

   
   return (
      <div className="font-poppins pt-5 lg:p-7 space-y-4 h-fit overflow-hidden">
         <div className="p-5 w-full rounded-2xl flex flex-col lg:flex-row space-x-0 space-y-3 lg:space-x-16 lg:space-y-0  justify-start shadow-md bg-background dark:bg-secondary/30">
            <div className="flex space-x-2 items-center ">
               <div className="bg-[#22C55E] rounded-lg p-1">
                  <CalendarCheck className="text-primary" />
               </div>
               <h1 className="text-[min(18px,4vw)] font-bold text-black/80  dark:text-white/80">{event.title}</h1>
            </div>
            <div className="flex space-x-2 items-center ">
               <div className="dark:bg-yellow-500 bg-yellow-400   rounded-lg p-1">
                  <MapPin className="text-yellow-700 dark:text-white " />
               </div>
               <h1 className="text-[min(16px,3.8vw)] font-normal text-black/80 dark:text-white/80">
                  {event.location}
               </h1>
            </div>
            <div className="flex space-x-2 items-center">
               <div className="bg-blue-500 dark:bg-blue-800 rounded-lg p-1">
               <CalendarDays className="text-blue-800 dark:text-white" />
               </div>
               <h1 className="text-[min(16px,3.8vw)] font-normal text-black/80 dark:text-white/80">
                  {moment(event.date).format("LL")}
               </h1>
            </div>
         </div>
         <div className="flex flex-col bg-background  border-[#00000012] min-h-screen shadow-xl dark:bg-secondary/30 py-4 rounded-3xl space-y-2 overflow-x-hidden lg:p-5  w-full ">
            <div className="p-5 w-full">
               <EventNav event={event} />
               <Separator className=""></Separator>
            </div>
            <div>{children}</div>
         </div>
      </div>
   );
};

export default EventLayout;

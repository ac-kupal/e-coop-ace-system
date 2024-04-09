import db from "@/lib/database"
import React, { ReactNode } from "react";

import NotFound from "./_components/not-found";
import EventNav from "./_components/event-nav";
import { eventIdSchema } from "@/validation-schema/commons";
import { Separator } from "@/components/ui/separator";
import { CalendarCheck, CalendarDays, MapPin } from "lucide-react";
import moment from "moment";
import BackButton from "@/components/back";
import EventHeader from "./_components/event-header";

type Props = {
   children: ReactNode;
   params: { id: number; electionId: number };
};

const EventLayout = async ({ children, params }: Props) => {
  
    const eventIdValidation = eventIdSchema.safeParse(params.id)

    if(!eventIdValidation.success) throw eventIdValidation.error.issues[0].message

   const event = await db.event.findUnique({ where : { id : eventIdValidation.data }, include : { election : true}})

   
   
   if (!event) return <NotFound />
   
   console.log(event.date)

   return (
      <div className="font-poppins pt-2 lg:px-7 space-y-2 lg:space-y-4 h-fit overflow-hidden">
         <div className="w-full px-2 lg:p-2 flex items-center justify-between">
         <EventHeader></EventHeader>
         <BackButton></BackButton>
         </div>
         <div className="p-2 w-full rounded-2xl flex flex-col lg:flex-row space-x-0 space-y-1 lg:space-x-16 lg:space-y-0  justify-start shadow-md bg-background dark:bg-secondary/30">
            <div className="flex space-x-2 items-center ">
               <div className="p-1">
                  <CalendarCheck className="size-4 md:size-5 lg:size-6 text-primary" />
               </div>
               <h1 className="text-[min(15px,3.1vw)] font-bold text-black/80  dark:text-white/80">{event.title}</h1>
            </div>
            <div className="flex space-x-2 items-center ">
               <div className=" p-1">
                  <MapPin className="text-yellow-500 size-4 md:size-5 lg:size-6 dark:text-yellow-400 " />
               </div>
               <h1 className="text-[min(15px,3.1vw)] font-normal text-black/80 dark:text-white/80">
                  {event.location}
               </h1>
            </div>
            <div className="flex space-x-2 items-center">
               <div className="p-1">
               <CalendarDays className="size-4 md:size-5 lg:size-6 text-blue-800 dark:text-blue-500" />
               </div>
               <h1 className="text-[min(15px,3.1vw)] font-normal text-black/80 dark:text-white/80">
                  {moment(event.date).format("LL")}
               </h1>
            </div>
         </div>
         <div className="flex flex-col bg-background rounded-xl min-h-screen shadow-xl dark:bg-secondary/30 py-2  overflow-x-hidden w-full ">
            <div className="px-2 w-full">
               <EventNav event={event} />
               <Separator className="hidden md:block"></Separator>
            </div>
            <div>{children}</div>
         </div>
      </div>
   );
};

export default EventLayout;

import db from "@/lib/database"
import React, { ReactNode } from "react";
import EventNav from "./_components/event-nav";
import { eventIdSchema } from "@/validation-schema/commons";
import NotFound from "./_components/not-found";

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
      <div className="font-poppins pt-5 lg:p-7 h-fit overflow-hidden">
         <div className="p-5 w-full">
           <EventNav event={event} />
         </div>
         <div className="flex bg-background  border border-[#00000012] min-h-screen shadow-xl dark:bg-secondary/30 py-4 rounded-3xl overflow-x-hidden lg:p-2  w-full ">
               {children}
         </div>
      </div>
   );
};

export default EventLayout;

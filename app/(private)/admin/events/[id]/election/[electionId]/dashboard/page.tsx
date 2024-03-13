import { Accessibility } from "lucide-react";
import Header from "../_components/header";
import { BarGraphSection } from "./_components/bar-graph-section";
import QuorumSection from "./_components/quorum-section";
import db from "@/lib/database"
import { z } from "zod";
import { PieGraphSection } from "./_components/pie-graph-section";
type TParams = {
   params: { id: number; electionId: number };
};

const page = async({ params }: TParams) => {
   
   const eventId = Number(params.id)
   
   z.coerce.number().parse(eventId)

   const Election = await db.election.findUnique({where:{eventId:eventId}})
   

   return (
      <div className="w-full lg:w-[1000px] lg:min-w-full ">
         {Election && 
            <Header text={Election?.electionName}></Header>
         }
         <QuorumSection params={params}></QuorumSection>
         <div className="w-full flex space-x-3 justify-start px-2">
            <div className="flex space-x-2 items-center py-5">
               <div className="p-1 bg-[#22C55E]/80 rounded-lg">
                  <Accessibility className="size-5 text-slate-200" />
               </div>
               <h1 className="font-medium">Positions</h1>
            </div>
         </div>
         <div className="flex flex-col w-full items-center px-5 rounded-3xl lg:p-5 justify-center  bg-secondary/20">
            <BarGraphSection params={params}/>
            <PieGraphSection params={params} />
         </div>
      </div>
   );
};

export default page;

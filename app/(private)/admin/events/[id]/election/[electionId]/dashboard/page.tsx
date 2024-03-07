import { Accessibility, Sigma } from "lucide-react";
import Header from "../_components/header";
import { BarGraphSection } from "./_components/bar-graph-section";
import QuorumSection from "./_components/quorum-section";
import db from "@/lib/database"
import { z } from "zod";
import NotFound from "../_components/not-found";
type TParams = {
   params: { id: number; electionId: number };
};

const page = async({ params }: TParams) => {
   
   const eventId = Number(params.id)
   
   z.coerce.number().parse(eventId)

   const Election = await db.election.findUnique({where:{eventId:eventId}})
   if(!Election) return <NotFound></NotFound>

   return (
      <div>
         <Header text={Election?.electionName}></Header>
         <QuorumSection params={params}></QuorumSection>
         <div className="w-full flex space-x-3 justify-start px-2">
            <div className="flex space-x-2 items-center py-5">
               <div className="p-1 bg-[#22C55E]/80 rounded-lg">
                  <Accessibility className="size-5 text-slate-200" />
               </div>
               <h1 className="font-medium">Positions</h1>
            </div>
         </div>
         <div className="flex w-full  px-5 overflow-y-auto rounded-3xl lg:p-5 lg:justify-center  bg-secondary/20">
            <BarGraphSection params={params}/>
         </div>
      </div>
   );
};

export default page;

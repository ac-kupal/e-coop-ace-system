"use client";
import { getElectionWithPosition} from "@/hooks/api-hooks/election-api-hooks";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import PositionTable from "./_components/position-table";
import { TPosition, TPositionWithEventID } from "@/types";

type Props = {
   params: { id: number; electionId: number };
};

const page = ({ params }: Props) => {
   const { elections, isLoading, error } = getElectionWithPosition({
      params,
   });
   const [data, setData] = useState<TPositionWithEventID[]>([]);

   useEffect(() => {
       if (elections && elections.positions) {
           setData(elections.positions.map(position => ({
               ...position,
               eventId: params.id
           })));
           console.log(elections.positions);
       }
   }, [elections, params.id]);

   if (isLoading)
      return (
         <div className="w-full h-[400px] flex justify-center items-center space-x-2 text-primary">
            <Loader2 className=" size-5 animate-spin"></Loader2>
            <h1 className=" animate-pulse">Loading...</h1>
         </div>
      );

   if (error) return;
   return <div>
        <PositionTable params={params} electionId={params.electionId} data={data}></PositionTable>    
   </div>;
};

export default page;

"use client";
import { Loader2 } from "lucide-react";
import NotFound from "../_components/not-found";
import {
   getPositionsWithElectionId,
} from "@/hooks/api-hooks/election-api-hooks";
import PositionTable from "./_components/position-table";

const PositionPage = ({ params }: { params: { id: number } }) => {
   const { positions, isLoading, error } = getPositionsWithElectionId(params.id);
   console.log(positions)
   if (isLoading)
      return (
         <div className="w-full h-[400px] flex justify-center items-center space-x-2 text-primary">
            <Loader2 className=" size-5 animate-spin"></Loader2>
            <h1 className=" animate-pulse">Loading...</h1>
         </div>
      );

   if (error) return <NotFound></NotFound>;

   return (
      <div className="p-5">
         <p>WIP in progress</p>
         {/* <PositionTable data={positions}></PositionTable> */}
      </div>
   );
};

export default PositionPage;

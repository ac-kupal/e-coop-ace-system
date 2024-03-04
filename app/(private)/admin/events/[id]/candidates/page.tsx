"use client";
import { Loader2 } from "lucide-react";
import NotFound from "../_components/not-found";
import {
   getPositionsWithElectionId,
  getCandidatesWithElectionId,
  getElection,
} from "@/hooks/api-hooks/election-api-hooks";
import CandidateTable from "./_components/candidate-table";

const PositionPage = ({ params }: { params: { id: number } }) => {

   const { candidates, isLoading, error } = getCandidatesWithElectionId(params.id);
   const { positions } = getPositionsWithElectionId(params.id);
   console.log("candidates",candidates)
   console.log("position",positions)


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
        {/* <CandidateTable positions={positions} data={candidates}  /> */}
      </div>
   );
};

export default PositionPage;

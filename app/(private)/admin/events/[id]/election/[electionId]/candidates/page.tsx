"use client";
import { getElectionWithPositionAndCandidates } from "@/hooks/api-hooks/election-api-hooks";
import { TCandidateWithEventID } from "@/types";
import React, { useEffect, useState } from "react";
import CandidateTable from "./_components/candidate-table";
import { Loader2 } from "lucide-react";
import Loading from "../_components/loading";
import Header from "../_components/header";
type Props = {
   params: { id: number; electionId: number };
};
const page = ({ params }: Props) => {
   const { elections, isLoading, error } = getElectionWithPositionAndCandidates({params});
   const [data, setData] = useState<TCandidateWithEventID[]>([]);

   useEffect(() => {
      if (elections && elections?.candidates) {
         setData(
            elections.candidates.map((candidate) => ({
               ...candidate,
               eventId: params.id,
            }))
         );
      }
   }, [elections, params.id]);

   if (isLoading)return (  <Loading/>);

   return (
      <div>
           <Header text="Manage Candidates"></Header>
         <CandidateTable params={params} positions={elections?.positions} data={data}></CandidateTable>
      </div>
   );
};

export default page;

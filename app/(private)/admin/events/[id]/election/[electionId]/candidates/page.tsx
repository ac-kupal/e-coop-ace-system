"use client";
import { getElectionWithPositionAndCandidates } from "@/hooks/api-hooks/election-api-hooks";
import React, { useEffect, useState } from "react";
import Loading from "../_components/loading";
import Header from "../_components/header";
import { TCandidatewithPosition } from "@/types";
import NotFound from "../_components/not-found";
import CandidateTable from "./_components/candidate-table";
type Props = {
   params: { id: number; electionId: number };
};
const page = ({ params }: Props) => {

   const { elections, isLoading, error } = getElectionWithPositionAndCandidates({params});
   
   if (isLoading) return (  <Loading/>);

   if(elections === undefined) return <NotFound></NotFound>
   
   const candidates = elections.candidates.map((candidate:TCandidatewithPosition)=>({...candidate,eventId:params.id}))

   return (
      <div>
           <Header text="Manage Candidates"></Header>
         <CandidateTable eventId={params.id} params={params} positions={elections?.positions} data={candidates}></CandidateTable>
      </div>
   );
};

export default page;

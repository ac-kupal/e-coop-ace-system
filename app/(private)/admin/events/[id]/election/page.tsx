import React from "react";
import ManageElection from "./manage-election/_components/election";
import { getElectionId } from "@/app/api/v1/event/_services/events";
import NotFound from "../_components/not-found";

type Props ={
    params: { id: number } 
}

const ElectionPage = async ({ params }: Props) => {
   const electionId =await getElectionId(params.id)

   if(!electionId) return <NotFound/>

   return (
      <>
         <ManageElection id={electionId}></ManageElection>
      </>
   );
};

export default ElectionPage;

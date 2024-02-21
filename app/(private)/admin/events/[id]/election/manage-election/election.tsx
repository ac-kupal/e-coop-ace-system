"use client";
import ElectionDetails from "./election-details";
import { getEvent } from "@/hooks/api-hooks/event-api-hooks";

type Props = {
   id: number;
};

const ManageElection = ({ id }: Props) => {

   const Election = getEvent(id)
   if(Election.isLoading){
    return<h1 className=" animate-pulse">Loading...</h1>
   }

   return (
      <div>
       <ElectionDetails election={Election.data?.election}></ElectionDetails>
      </div>
   );
};

export default ManageElection;

"use client"
import { Accessibility, Users } from "lucide-react";
import { Candidates } from "./candidates";
import ElectionDetails from "./election-details";
import { Positions } from "./positions";
import { getElection } from "@/hooks/api-hooks/election-api-hooks";
import NotFound from "../../../_components/not-found";

type Props = {
   id: number;
};

const ManageElection = ({ id }: Props) => {

   const Election = getElection(id)
   
   if (Election.isLoading) {
      return <h1 className=" animate-pulse">Loading...</h1>;
   }
   if(!Election.data) return <NotFound></NotFound>
   
   return (
      <div className=" space-y-4">
         <h1 className="text-2xl font-medium">Manage Election</h1>
         <ElectionDetails election={Election.data}/>
         <div className="w-full flex space-x-3 justify-start px-2">
            <Users className="size-5 text-green-700" />
            <h1 className="font-medium">Candidates</h1>
         </div>
         <Candidates id={id}/>
         <div className="w-full flex space-x-3 justify-start px-2">
          <Accessibility className="size-7 text-green-700" />
            <h1 className="font-medium">Positions</h1>
         </div>
         <Positions id={id}/>
         
      </div>
   );
};

export default ManageElection;

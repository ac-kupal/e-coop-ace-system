"use client";
import { Accessibility, Users } from "lucide-react";
import { Candidates } from "./candidates";
import { getEvent } from "@/hooks/api-hooks/event-api-hooks";
import ElectionDetails from "./election-details";
import { Positions } from "./positions";

type Props = {
   id: number;
};

const ManageElection = ({ id }: Props) => {
   const Election = getEvent(id);

   if (Election.isLoading) {
      return <h1 className=" animate-pulse">Loading...</h1>;
   }
   
   return (
      <div className=" space-y-4">
         <h1 className="text-2xl font-medium">Manage Election</h1>
         <ElectionDetails
            date={Election.data?.date}
            election={Election.data?.election}
         />
         <div className="w-full flex space-x-3 justify-start px-2">
            <Users className="size-5 text-green-700" />
            <h1 className="font-medium">Candidates</h1>
         </div>
         <Candidates />
         <div className="w-full flex space-x-3 justify-start px-2">
          <Accessibility  className="size-7 text-green-700" />
            <h1 className="font-medium">Positions</h1>
         </div>
         <Positions/>
      </div>
   );
};

export default ManageElection;

"use client"
import { Accessibility, Loader2, Users } from "lucide-react";
import { Candidates } from "./candidates";
import ElectionDetails from "./election-details";
import { Positions } from "./positions";
import { getElection, promptElectionStatus } from "@/hooks/api-hooks/election-api-hooks";
import NotFound from "../../../_components/not-found";
import ElectionSwitch from "./election-switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props = {
   id: number;
};

const ManageElection = ({ id }: Props) => {

   const Election = getElection(id)
   
   if (Election.isLoading) {
      return <div className="w-full h-[400px] flex justify-center items-center space-x-2 text-primary">
          <Loader2 className=" size-5 animate-spin"></Loader2>
          <h1 className=" animate-pulse">Loading...</h1>
      </div>
   }
   if(!Election.data) return <NotFound></NotFound>
   
   const isLive = Election.data.status === "live"
   const isPending = Election.data.status === "pending"

   return (
      <div className="relative space-y-4">
          {isLive && <Badge className={cn("dark:text-foreground text-red-300 animate-pulse bg-red-700 border-red-800 dark:border-red-500 tracking-wide")}>live</Badge>}
          {isPending && <Badge className={cn("text-foreground bg-yellow-400 dark:bg-yellow-500 text-yellow-900 border-yellow-600 tracking-wide")}>pending</Badge>}
         <ElectionSwitch status={Election.data.status} id={id}></ElectionSwitch>
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

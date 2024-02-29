"use client";
import { Accessibility, CheckCircle2, Loader2, Users } from "lucide-react";
import { Candidates } from "./candidates";
import ElectionDetails from "./election-details";
import { Positions } from "./positions";
import { getElection } from "@/hooks/api-hooks/election-api-hooks";
import NotFound from "../../../_components/not-found";
import ElectionSwitch from "./election-switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props = {
   id: number;
};

const ManageElection = ({ id }: Props) => {
   const Election = getElection(id);

   if (Election.isLoading) {
      return (
         <div className="w-full h-[400px] flex justify-center items-center space-x-2 text-primary">
            <Loader2 className=" size-5 animate-spin"></Loader2>
            <h1 className=" animate-pulse">Loading...</h1>
         </div>
      );
   }
   if (!Election.data) return null

   const isLive = Election.data.status === "live";
   const isPending = Election.data.status === "pending";
   const isEnded = Election.data.status === "done";


   return (
      <div className="relative space-y-4">
         {isLive && (
            <Badge
               className={cn(
                  "dark:text-foreground text-red-300 animate-pulse bg-red-600 border-red-800 dark:border-red-500 tracking-wide"
               )}
            >
               live
            </Badge>
         )}
         {isPending && (
            <Badge
               className={cn(
                  "text-foreground bg-yellow-400 dark:bg-yellow-500 text-yellow-900 border-yellow-600 tracking-wide"
               )}
            >
               pending
            </Badge>
         )}
           {isEnded && (
            <Badge
               className={cn(
                  "text-foreground bg-green-400 dark:bg-green-500 text-green-900 border-green-600 tracking-wide"
               )}
            >
              <div className="flex space-x-2">
                <p>ended</p>
               <CheckCircle2 className="size-4 text-gray-900"></CheckCircle2>
              </div>
            </Badge>
         )}
         <ElectionSwitch
            election={Election.data}
            status={Election.data.status}
            id={id}
         ></ElectionSwitch>
         <h1 className="text-[min(25px,3.5vw)] font-bold">Manage Election</h1>
         <p className=" text-sm italic text-muted-foreground">Note: You will not be able to start the election if there are no candidates and the position is empty.</p>
         <ElectionDetails election={Election.data} />
         <div className="w-full flex space-x-3 justify-start px-2">
            <Users className="size-5 text-green-700" />
            <h1 className="font-medium">Candidates</h1>
         </div>
         <Candidates id={id} />
         <div className="w-full flex space-x-3 justify-start px-2">
            <Accessibility className="size-7 text-green-700" />
            <h1 className="font-medium">Positions</h1>
         </div>
         <Positions id={id} />
      </div>
   );
};

export default ManageElection;

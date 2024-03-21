"use client";
import React from "react";
import { getElectionWithPositionAndCandidates } from "@/hooks/api-hooks/election-api-hooks";
import { Accessibility, CheckCircle2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Header from "../../_components/header";
import Loading from "../../_components/loading";
import NotFound from "../../_components/not-found";
import ElectionSwitch from "./election-switch";
import ElectionDetails from "./election-details";
import { Candidates } from "./candidates";
import { Positions } from "./positions";
import { Role } from "@prisma/client";
import { user } from "next-auth";

type Props = {
   params: { id: number; electionId: number };
   user: user;
};

const Election = ({ params, user }: Props) => {
   const { elections, isLoading, error } = getElectionWithPositionAndCandidates(
      { params }
   );

   if (isLoading) return <Loading />;

   if (!elections) return <NotFound></NotFound>;
   if (!elections.candidates) return <NotFound></NotFound>;

   const isLive = elections.status === "live";
   const isPending = elections.status === "pending";
   const isEnded = elections.status === "done";

   const isStaff = user.role === Role.staff;

   return (
      <div className="space-y-2 relative ">
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
         <Header text="Overview"></Header>
         {!isStaff && (
            <ElectionSwitch
               election={elections}
               status={elections.status}
               params={params}
            ></ElectionSwitch>
         )}
         <ElectionDetails election={elections}></ElectionDetails>
         <div className="w-full flex space-x-3 justify-start px-2">
            <Users className="size-5 text-primary" />
            <h1 className="font-medium">Candidates</h1>
         </div>
         <Candidates data={elections?.candidates}></Candidates>
         <div className="w-full flex space-x-3 justify-start px-2">
            <Accessibility className="size-7 text-green-700" />
            <h1 className="font-medium">Positions</h1>
         </div>
         <Positions data={elections.positions}></Positions>
      </div>
   );
};

export default Election;

"use client";
import { TElection } from "@/types/election/TCreateElection";
import {
   LayoutDashboard,
   Loader2,
   Medal,
   Settings2,
   Users,
} from "lucide-react";
import React from "react";
import NotFound from "./not-found";

type Props = {
   election: TElection;
   isLoading: boolean;
};

const Election = ({ election, isLoading }: Props) => {

   if (!election) return <NotFound></NotFound>;
     
   return (
      <div className="w-full h-screen overflow-hidden bg-background rounded-2xl">
         {election.electionName}
      </div>
   );
};

export default Election;

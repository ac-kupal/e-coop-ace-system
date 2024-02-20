"use client";
import React from "react";
import NotFound from "./not-found";
import { TElection } from "@/types";

type Props = {
   election: TElection;
};

const Election = ({ election}: Props) => {

   if (!election) return <NotFound></NotFound>;
     
   return (
      <div className="w-full h-screen overflow-hidden bg-background rounded-2xl">
         {election.electionName}
      </div>
   );
};

export default Election;

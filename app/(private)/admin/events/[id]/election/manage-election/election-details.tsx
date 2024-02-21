"use client";
import { TElection } from "@/types";
import React from "react";

type Props = {
   election: TElection | undefined;
};

const ElectionDetails = ({ election }: Props) => {
   return (
      <div>
         <h1>ElectionDetails</h1>
         {election?.electionName}
      </div>
   );
};

export default ElectionDetails;

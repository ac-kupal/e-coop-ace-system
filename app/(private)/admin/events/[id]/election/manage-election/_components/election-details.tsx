"use client";
import { TElection } from "@/types";
import moment from "moment";
import React from "react";

type Props = {
   election: TElection;
};

const ElectionDetails = ({ election }: Props) => {
   return (
      <div className="flex flex-col lg:flex-row space-y-1 lg:space-x-5 w-full bg-background/50 dark:text-muted-foreground rounded-2xl p-5">
         <p>id: {election.id}</p>
         <h1 className="">title: <span className="text-[#1e8a56] font-bold">{election.electionName}</span></h1>
         <h1>date: {moment(election?.createdAt).format("LL")}</h1>
      </div>
   );
};

export default ElectionDetails;

"use client";
import { TElection } from "@/types";
import { constants } from "buffer";
import moment from "moment";
import React from "react";

type Props = {
   election: TElection | undefined;
   date:Date | undefined
};

const ElectionDetails = ({ election, date }: Props) => {
   return (
      <div className=" flex space-x-5 w-full bg-[#d8d8d852] rounded-2xl p-5">
         <p>id: {election?.id}</p>
         <h1 className="">title: <span className="text-[#1e8a56] font-bold">{election?.electionName}</span></h1>
         <h1>date: {moment(date).format("LL")}</h1>
      </div>
   );
};

export default ElectionDetails;

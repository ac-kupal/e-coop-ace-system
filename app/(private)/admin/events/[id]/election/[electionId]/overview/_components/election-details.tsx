"use client";
import { Card, CardContent } from "@/components/ui/card";
import { TElection } from "@/types";
import moment from "moment";
import React from "react";

type Props = {
   election: TElection;
};

const ElectionDetails = ({ election }: Props) => {
   return (
      <Card className="">
        <CardContent className="flex flex-col lg:flex-row text-[min(17px,3.5vw)] lg:space-x-5 w-full bg-background/50 dark:text-muted-foreground rounded-2xl p-5">
        <p>id: {election.id}</p>
         <h1 className="">title: <span className="text-primary font-bold">{election.electionName}</span></h1>
         <h1>date: {moment(election?.createdAt).format("LL")}</h1>
        </CardContent>
      </Card>
   );
};

export default ElectionDetails;

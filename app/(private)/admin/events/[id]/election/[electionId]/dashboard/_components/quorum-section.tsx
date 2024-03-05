"use client";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { getMembersQuorum } from "@/hooks/api-hooks/member-api-hook";
import { getPositionVotesTotal } from "@/hooks/api-hooks/vote-api-hooks";
import { Sigma, UsersRound, Vote } from "lucide-react";
import React from "react";
type TParams = {
   params: { id: number; electionId: number };
};
const QuorumSection = ({ params }: TParams) => {
   const { members, isLoading, isError } = getMembersQuorum(params.id);

   if (!members) return null;

   const percentageAttendanceTotal =(Number(members?.totalIsRegistered) / Number(members?.totalAttendees)) *100;
   const percentageVotersTotal =(Number(members?.totalMembersVoted) / Number(members?.totalAttendees)) *100;

   console.log()

   return (
      <div className="w-full flex justify-start space-x-10 p-5">
         <div className="">
            <div className="flex space-x-2 items-center py-5">
               <div className="p-1 dark:bg-[#c5a522] bg-[#e7c127] rounded-lg">
                  <Sigma className="size-5 text-slate-200" />
               </div>
               <h1 className="font-medium">Quorum</h1>
            </div>
            <Card className="w-fit rounded-2xl">
               <CardHeader>
                  <CardTitle>Total Attendance</CardTitle>
               </CardHeader>
               <CardContent>
                  <h1 className="font-bold text-[3rem] text-[#22C55E]">
                     {Math.trunc(isNaN(percentageAttendanceTotal) ? 0 : percentageAttendanceTotal)}%
                  </h1>
                  <CardDescription className="text-md">
                     {members?.totalIsRegistered + " (Total registered)"}{" / "}{members?.totalAttendees + " members"}
                  </CardDescription>
               </CardContent>
            </Card>
         </div>
         <div>
            <div className="flex space-x-2 items-center py-5">
               <div className="p-1 dark:bg-[#226ec5] bg-[#2d84e8] rounded-lg">
                <UsersRound className="size-5 text-slate-200"/>
               </div>
               <h1 className="font-medium">Participants</h1>
            </div>
            <Card className="w-fit rounded-2xl">
               <CardHeader>
                  <CardTitle>Total Votes</CardTitle>
               </CardHeader>
               <CardContent>
                  <h1 className="font-bold text-[3rem] text-[#22C55E]">
                  {Math.trunc(isNaN(percentageVotersTotal) ? 0 : percentageVotersTotal)}%
                  </h1>
                  <CardDescription className="text-md">
                     {members?.totalMembersVoted + "(Total voters)"}{" / "}{members?.totalAttendees + " members"}
                  </CardDescription>
               </CardContent>
            </Card>
         </div>
         <div>
            <div className="flex space-x-2 items-center py-5">
               <div className="p-1 bg-[#22C55E]/80 rounded-lg">
                <Vote className="size-5 text-slate-200"/>
               </div>
               <h1 className="font-medium">Voters</h1>
            </div>
            <Card className="w-fit lg:w-[270px] rounded-2xl">
               <CardHeader>
                  <CardTitle>Vote Summary</CardTitle>
               </CardHeader>
               <CardContent>
                  <h1 className="font-bold text-[3rem] text-[#22C55E]">
                    {members.totalMembersVoted}
                  </h1>
                  <CardDescription className="text-md">
                      voters
                  </CardDescription>
               </CardContent>
            </Card>
         </div>
      </div>
   );
};

export default QuorumSection;

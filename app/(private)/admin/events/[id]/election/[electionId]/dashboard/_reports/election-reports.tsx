"use client";
import { getReportsResults } from "@/hooks/api-hooks/vote-api-hooks";
import React, { useRef } from "react";
import Loading from "../../_components/loading";
import NotFound from "../../_components/not-found";

import { utils, writeFile } from "xlsx";
import NoVoters from "../_components/no-voters";
import {
   Table,
   TableBody,
   TableCell,
   TableFooter,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { SiMicrosoftexcel } from "react-icons/si";
import { GrRotateRight } from "react-icons/gr";
import { cn, tableToExcel } from "@/lib/utils";
import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";

type TParams = {
   params: { id: number; electionId: number };
   electionName: string;
};
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ElectionReports = ({ params, electionName }: TParams) => {
   const tableRef = useRef(null);

   const { votes, isLoading, refetch, isRefetching } =getReportsResults(params);


   if (!votes) return <NotFound></NotFound>;
   if (votes.sum === 0) return <NoVoters></NoVoters>;
   if (isLoading) return <Loading></Loading>;
   const exportToExcel = () => {
      if (tableRef.current) {
         tableToExcel(tableRef.current, `${electionName}_reports`);
      }
   };

   return (
      <>
         <div className="flex justify-end gap-x-2">
            <Button
               disabled={isRefetching}
               variant={"secondary"}
               onClick={() => refetch()}
               className="gap-x-2"
               size="icon"
            >
               <GrRotateRight
                  className={`size-4 ${isRefetching ? "animate-spin" : "animate-none"}`}
               />
            </Button>
            <Button
               disabled={isRefetching}
               className="gap-x-2"
               onClick={() => {
                  exportToExcel();
                  // const wb = utils.table_to_book(tableRef.current);
                  // writeFile(wb, `${electionName}_reports.xlsx`);
               }}
            >
               <SiMicrosoftexcel className="size-4" /> Export
            </Button>
         </div>
         <div className="  h-fit lg:w-full">
            <Table
               className=" bg-transparent hover:bg-transparent border-0  "
               ref={tableRef}
            >
               <TableHeader className="">
                  <TableRow className="border-0">
                     <TableCell
                        colSpan={votes.candidates.length + 1}
                        className="text-center font-bold"
                     >
                        <div className="w-full flex-row flex justify-between">
                           <p>{electionName}</p>
                           <p className="text-muted-foreground font-normal">
                              Total Votes:{" "}
                              <span className=" text-primary font-bold">
                                 {" "}
                                 {votes.total.reduce(
                                    (acc, curr) => acc + curr,
                                    0
                                 )}
                              </span>
                           </p>
                        </div>
                     </TableCell>
                  </TableRow>

                  <TableRow className=" border bg-secondary">
                     <TableCell className=" font-bold text-muted-foreground">
                        Candidate
                     </TableCell>
                     {votes?.candidates?.map((candidate) => {
                        return (
                           <TableCell
                              key={candidate.candidateId}
                              className="text-[13px] w-24 text-muted-foreground font-medium cursor-pointer"
                           >
                              <Popover>
                                 <PopoverTrigger>
                                    <TooltipProvider>
                                       <Tooltip>
                                          <TooltipTrigger asChild>
                                             <p>
                                                {" "}
                                                {candidate.firstName.charAt(1)}
                                                {candidate.lastName.charAt(1)}
                                             </p>
                                          </TooltipTrigger>

                                          <TooltipContent>
                                             <div className="flex items-center gap-2">
                                                <Avatar>
                                                   <AvatarImage
                                                      src={candidate.picture}
                                                      alt={candidate.firstName}
                                                   />
                                                   <AvatarFallback>
                                                      CN
                                                   </AvatarFallback>
                                                </Avatar>
                                                <div className=" text-start">
                                                <p>
                                                   {" "}
                                                   {candidate.firstName}{" "}
                                                   {candidate.lastName}
                                                </p>
                                                <p> {candidate.position}</p>
                                                </div>
                                             </div>
                                          </TooltipContent>
                                       </Tooltip>
                                    </TooltipProvider>
                                 </PopoverTrigger>
                                 <PopoverContent className="w-fit">
                                    <div className="flex items-center space-x-2">
                                       <Avatar>
                                          <AvatarImage
                                             src={candidate.picture}
                                             alt={candidate.firstName}
                                          />
                                          <AvatarFallback>CN</AvatarFallback>
                                       </Avatar>
                                       <p>
                                          {" "}
                                          {candidate.firstName}{" "}
                                          {candidate.lastName}
                                          <br></br>
                                          <span className=" text-muted-foreground">
                                             {" "}
                                             {candidate.position}
                                          </span>
                                       </p>
                                    </div>
                                 </PopoverContent>
                              </Popover>
                           </TableCell>
                        );
                     })}
                  </TableRow>
               </TableHeader>
            </Table>
            <div className="max-h-[50vh] overflow-auto">
               <Table
                  className=" bg-transparent hover:bg-transparent max-h-[50vh] overflow-auto "
                  ref={tableRef}
               >
                  <TableHeader className=""></TableHeader>
                  <TableBody className="border">
                     <TableRow className="border-0">
                        <TableCell
                           colSpan={votes.candidates.length + 1}
                           className="text-center font-bold"
                        >
                           <div className="w-full flex-row flex justify-between">
                              <p>voters</p>
                           </div>
                        </TableCell>
                     </TableRow>
                     {votes?.voters.map((voter) => {
                        return (
                           <TableRow className="w-[300px] " key={voter.id}>
                              <TableCell>{voter.voterName}</TableCell>
                              {voter.votes.map((vote, idx) => {
                                 return (
                                    <TableCell
                                       className="text-muted-foreground font-bold w-[5.8rem]"
                                       key={idx}
                                    >
                                       {vote === 0 ? "" : vote}
                                    </TableCell>
                                 );
                              })}
                           </TableRow>
                        );
                     })}
                  </TableBody>
               </Table>
              
            </div>
            <Table>
               <TableFooter>
                     <TableRow className=" bg-secondary">
                        <TableCell className="font-bold">Total</TableCell>
                        {votes?.total.map((total, idx) => {
                           return (
                              <TableCell className="font-bold w-[5.98rem]" key={idx}>
                                 {" "}
                                 {total}
                              </TableCell>
                           );
                        })}
                     </TableRow>
                  </TableFooter>
               </Table>
         </div>
      </>
   );
};

export default ElectionReports;

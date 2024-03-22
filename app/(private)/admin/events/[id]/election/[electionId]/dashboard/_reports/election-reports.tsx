"use client";
import { getReportsResults } from "@/hooks/api-hooks/vote-api-hooks";
import React, { useRef } from "react";
import Loading from "../../_components/loading";
import NotFound from "../../_components/not-found";
import { Button } from "@/components/ui/button";
import { utils, writeFile } from "xlsx";
import NoVoters from "../_components/no-voters";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { SiMicrosoftexcel } from "react-icons/si";
import { GrRotateRight } from "react-icons/gr";
import { tableToExcel } from "@/lib/utils";
type TParams = {
   params: { id: number; electionId: number };
   electionName: string;
};

const ElectionReports = ({ params, electionName }: TParams) => {
   const tableRef = useRef(null);

   const { votes, isLoading, isError, refetch, isRefetching  } = getReportsResults(params);

   console.log(votes);

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
               <GrRotateRight className={`size-4 ${isRefetching ? "animate-spin":"animate-none"}`} />
            </Button>
            <Button
               disabled={isRefetching}
               className="gap-x-2"
               onClick={() => {
                  exportToExcel()
                  // const wb = utils.table_to_book(tableRef.current);
                  // writeFile(wb, `${electionName}_reports.xlsx`);
               }}
            >
               <SiMicrosoftexcel className="size-4" /> Export
            </Button>
         </div>
         <div className="overflow-auto h-fit lg:w-full">
            <Table
               className=" table-fixed bg-transparent hover:bg-transparent border-0  "
               ref={tableRef}
            >
               <TableBody>
                  <TableRow className="border-0">
                     <TableCell
                        colSpan={votes.candidates.length + 1}
                        className="text-center font-bold"
                     >
                        <div className="w-full flex-row flex justify-between">
                         <p>{electionName}</p>
                         <p className="text-muted-foreground font-normal">Total Votes: <span className=" text-primary font-bold"> {votes.total.reduce((acc, curr) => acc + curr, 0)}</span></p>

                        </div>
                     </TableCell>
                  </TableRow>
                  <TableRow className="  ">
                     <TableCell className=" font-bold text-muted-foreground">
                        Voters/Candidate
                     </TableCell>
                     {votes?.candidates?.map((candidate) => {
                        return (
                           <TableCell
                              key={candidate.candidateId}
                              className="text-[13px] text-muted-foreground font-medium"
                           >
                              {candidate.candidateName}
                           </TableCell>
                        );
                     })}
                  </TableRow>
                  {votes?.voters.map((voter) => {
                     return (
                        <TableRow className="w-[300px] " key={voter.id}>
                           <TableCell>{voter.voterName}</TableCell>
                           {voter.votes.map((vote, idx) => {
                              return (
                                 <TableCell
                                    className="text-muted-foreground font-bold"
                                    key={idx}
                                 >
                                    {vote === 0 ? "" : vote}
                                 </TableCell>
                              );
                           })}
                        </TableRow>
                     );
                  })}
                  <TableRow className=" bg-secondary">
                     <TableCell className="font-bold">Total</TableCell>
                     {votes?.total.map((total, idx) => {
                        return (
                           <TableCell className="font-bold" key={idx}>
                              {" "}
                              {total}
                           </TableCell>
                        );
                     })}
                  </TableRow>
               </TableBody>
            </Table>
         </div>
      </>
   );
};

export default ElectionReports;

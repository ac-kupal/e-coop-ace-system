"use client";
import { getReportsResults } from "@/hooks/api-hooks/vote-api-hooks";
import React, { useRef } from "react";
import Loading from "../../_components/loading";
import NotFound from "../../_components/not-found";
import { Button } from "@/components/ui/button";
import { utils, writeFile } from "xlsx";
import NoVoters from "../_components/no-voters";

type TParams = {
   params: { id: number; electionId: number };
   electionName:string,
};

const ElectionReports = ({ params,electionName }: TParams) => {
   const tableRef = useRef(null);

   const { votes, isLoading, isError } = getReportsResults(params);
   
   console.log(votes)

   if (!votes) return <NotFound></NotFound>;
   if(votes.sum === 0) return <NoVoters></NoVoters>
   if (isLoading) return <Loading></Loading>;

   return (
      <>
         <div className="flex justify-end">
         <Button
            onClick={() => {
               const wb = utils.table_to_book(tableRef.current);
               writeFile(wb, `${electionName}_reports.xlsx`);
            }}
         >
            download as xlsx
         </Button>
         </div>
         <div className="overflow-auto py-10 h-fit lg:w-full">
            <table
               className=" table-fixed uppercase text-[13px] overflow-auto w-fit h-fit "
               ref={tableRef}
            >
               <thead>
                  <tr className="[&>td]:border-b-2 [&>td]:p-2 [&>td]:px-2 [&>td]:text-center [&>td]:text-[13px] [&>td]:w-[250px] [&>td]:uppercase   ">
                     <td className="w-[200px] font-bold text-green-500">Candidate Name</td>
                     {votes?.candidates?.map((candidate) => {
                        return (
                           <td
                              key={candidate.candidateId}
                              className="text-[13px] text-muted-foreground font-medium"
                           >
                              {candidate.candidateName}
                           </td>
                        );
                     })}
                  </tr>
               </thead>
               <tbody className="">
                  <tr className=" border-b-2  ">
                     <td className="text-center font-bold">voters Name</td>
                  </tr>
                  {votes?.voters.map((voter) => {
                     return (
                        <tr className="[&>td]:text-center" key={voter.id}>
                           <td>{voter.voterName}</td>
                           {voter.votes.map((vote, idx) => {
                              return (
                                 <td
                                    className="text-muted-foreground font-bold"
                                    key={idx}
                                 >
                                    {vote === 0 ? "" : vote}
                                 </td>
                              );
                           })}
                        </tr>
                     );
                  })}
                  
                  <tr className="[&>td]:text-center [&>td]:p-2 [&>td]:text-green-600 border-t-2">
                     <td className="font-bold">total</td>
                     {votes?.total.map((total, idx) => {
                        return <td className="font-bold" key={idx}> {total}</td>;
                     })}
                  </tr>
               </tbody>
            </table>
         </div>
      </>
   );
};

export default ElectionReports;

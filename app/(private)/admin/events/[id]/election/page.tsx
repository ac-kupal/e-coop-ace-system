import React from "react";
import ManageElection from "./manage-election/_components/election";
import { getElectionId } from "@/app/api/v1/event/_services/events";
import NotFound from "../_components/not-found";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
   params: { id: number };
};

const ElectionPage = async ({ params }: Props) => {
   const electionId = await getElectionId(params.id);

   if (!electionId)
      return (
         <>
            <div className="flex flex-col space-y-2 w-full h-[50vh] items-center justify-center">
               <div>
                  <p className="text-[30px] text-center">🍃</p>
                  <p>{`there's no Election available here..`}</p>
               </div>
               <Link href={"/admin/events"}>
                  <Button variant={"outline"}> Go to Event</Button>
               </Link>
            </div>
         </>
      );

   return (
      <>
         <ManageElection id={electionId}></ManageElection>
      </>
   );
};

export default ElectionPage;

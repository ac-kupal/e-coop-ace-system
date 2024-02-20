"use client";
import React, { useEffect } from "react";
import {TEventWithElection } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { mutationErrorHandler } from "@/errors/mutation-error-handler";
import axios from "axios";

type Props = {
   id:number
};

const Election = ({id}: Props) => {

   const { data, isLoading } = useQuery<TEventWithElection>({
      queryKey: ["get-event-key"],
      queryFn: async () => {
         try {
            const response = await axios.get(`/api/v1/event/${id}`);
            return response.data;
         } catch (error) {
            mutationErrorHandler(error);
         }
      },
   });

   if (isLoading) {
      return <div>Loading...</div>;
   }
     
   return (
      <div className="w-full h-screen overflow-hidden bg-background rounded-2xl">
         {data?.election.electionName}
      </div>
   );
};

export default Election;

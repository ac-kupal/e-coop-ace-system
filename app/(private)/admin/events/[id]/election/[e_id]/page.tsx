"use client";
import { mutationErrorHandler } from "@/errors/mutation-error-handler";
import { TEvent } from "@/types/event/TCreateEvent";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect } from "react";
import Election from "./_components/election";
import NotFound from "./_components/not-found";

const page = ({ params }: { params: { id: number } }) => {
   const { data, isLoading } = useQuery<TEvent>({
      queryKey: ["get-event-key"],
      queryFn: async (id) => {
         try {
            const response = await axios.get(`/api/v1/event/${params.id}`);
            return response.data;
         } catch (error) {
            mutationErrorHandler(error);
         }
      },
   });
   
   return (
      <div className="w-full space-y-2 h-screen p-5 overflow-hidden">
         <h1 className="text-2xl font-semibold">Manage Election</h1>
         {data?.election ? (
            <>
               <Election
                  isLoading={isLoading}
                  election={data.election}
               ></Election>
            </>
         ) : (
            <NotFound></NotFound>
         )}
      </div>
   );
};

export default page;

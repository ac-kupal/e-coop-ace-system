"use client"
import { mutationErrorHandler } from '@/errors/mutation-error-handler';
import { TEventWithElection } from '@/types/event/TCreateEvent';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'
import Election from '../_components/election';
import NotFound from '../_components/not-found';

const page = ({ params }: { params: { id: number } }) => {

  const { data, isLoading } = useQuery<TEventWithElection>({
    queryKey: ["get-event-key"],
    queryFn: async () => {
       try {
          const response = await axios.get(`/api/v1/event/${params.id}`);
          return response.data;
       } catch (error) {
          mutationErrorHandler(error);
       }
    },
 });

  return (
    <div>
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
  )
}

export default page
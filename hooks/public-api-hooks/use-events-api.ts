import axios from "axios"
import { toast } from "sonner"
import { useQuery } from "@tanstack/react-query"

import { TEvent, TEventWithElection } from "@/types"
import { handleAxiosErrorMessage } from "@/utils"

export const useEventList = () => {
    const { data : eventList, refetch, isFetching, isLoading } = useQuery<TEvent[], string>({
        queryKey : ['public-event-list'],
        queryFn : async () => {
            try{    
                const request = await axios.get(`/api/v1/public/event`)
                return request.data
            }catch(e){
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage, { action : { label : "try again", onClick : () => refetch() }});
                throw errorMessage;
            }
        },
        initialData : [],
        refetchInterval : 2 * 60 * 1000
    })

    return { eventList, isFetching, isLoading }
}

export const useEvent = ( eventId : number ) => {
    const { data : event, refetch, isFetching, isLoading } = useQuery<TEventWithElection, string>({
        queryKey : [`public-event-${eventId}`],
        queryFn : async () => {
            try{    
                const request = await axios.get(`/api/v1/public/event/${eventId}`)
                return request.data
            }catch(e){
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage, { action : { label : "try again", onClick : () => refetch() }});
                throw errorMessage;
            }
        },
        refetchInterval : 2 * 60 * 1000
    })

    return { event, isFetching, isLoading }
}
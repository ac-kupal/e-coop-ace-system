import axios from "axios"
import { toast } from "sonner"
import { useQuery } from "@tanstack/react-query"

import { TEvent } from "@/types"
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
                toast.error("Failed to get events", { action : { label : "try again", onClick : () => refetch() }});
                throw errorMessage;
            }
        },
        initialData : []
    })

    return { eventList, isFetching, isLoading }
}
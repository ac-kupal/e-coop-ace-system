import axios from "axios"
import qs from "query-string"
import { toast } from "sonner"
import { useQuery } from "@tanstack/react-query"

import { handleAxiosErrorMessage } from "@/utils"
import { TIncentiveClaimReportsPerUser } from "@/types"

export const useClaimReports = (eventId : number, ids : number[]) => {
    const { data : reports, isLoading, refetch } = useQuery<TIncentiveClaimReportsPerUser[], string>({ 
        queryKey : ["claim-report-query"],
        queryFn : async () => {
            try{
                const url = qs.stringifyUrl({
                    url : `/api/v1/admin/event/${eventId}/incentives/claim/reports`,
                    query : {
                        ids : ids.map(id => id.toString()).join(",")
                    }
                }) 
                const request = await axios.get(url);
                return request.data;
            }catch(e){
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage, { action : { label : "try again", onClick : () => refetch() } });
                throw e;
            }
        },
        initialData : []
    })
    
    return { reports , isLoading }

}

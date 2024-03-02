import { handleAxiosErrorMessage } from "@/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"


export const useAttendance = (eventId : number | string, passbookNumber : string) => {
    const queryClient = useQueryClient();

    const { isPending, isError, error, mutate : registerAttendance } = useMutation<any, string, string>({
        mutationKey : [`attendance-registration-${passbookNumber}`],
        mutationFn : async () => {
            try{
                const request = await axios.post(`/api/v1/admin/event/${eventId}/attendance-registration`, { passbookNumber });
                toast.success("Member registered")
                queryClient.invalidateQueries();
                return request.data
            }catch(e){
                const errorMessage = handleAxiosErrorMessage(e)
                toast.error(errorMessage);
                throw errorMessage;
            }
        }
    })

}   
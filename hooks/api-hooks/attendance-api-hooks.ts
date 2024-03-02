import axios from "axios"
import { toast } from "sonner"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { handleAxiosErrorMessage } from "@/utils"
import { TMemberAttendeesWithRegistrationAssistance } from "@/types"


export const useAttendanceRegistration = (eventId : number | string, passbookNumber : string) => {
    const queryClient = useQueryClient();

    const { isPending : registerPending, isError : isRegisterError, error : registerError, mutate : registerAttendance } = useMutation<any, string>({
        mutationKey : [`attendance-registration-${passbookNumber}`],
        mutationFn : async () => {
            try{
                const request = await axios.post(`/api/v1/admin/event/${eventId}/attendance-registration`, { passbookNumber });
                toast.success("Member registered")
                queryClient.invalidateQueries({ queryKey : ["all-attendance-list-query"]});
                queryClient.invalidateQueries({ queryKey : ["all-event-members-list-query"]})
                return request.data
            }catch(e){
                const errorMessage = handleAxiosErrorMessage(e)
                toast.error(errorMessage);
                throw errorMessage;
            }
        }
    })

    return { registerPending, isRegisterError, registerError, registerAttendance }
}   


export const useAttendanceList = (eventId : number) => {
    const { data : attendanceList, isLoading, isError, isFetching } = useQuery<TMemberAttendeesWithRegistrationAssistance[], string>({
        queryKey : ["all-attendance-list-query"],
        queryFn : async () => {
            try{
                const response = await axios.get(`/api/v1/admin/event/${eventId}/member/attendance`)
                return response.data;
            }catch(e){
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
        initialData : []
    })

    return { attendanceList, isLoading, isError, isFetching }
}
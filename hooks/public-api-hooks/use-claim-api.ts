import z from "zod"
import axios from "axios";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { handleAxiosErrorMessage } from "@/utils"
import { TMemberAttendeesMinimalInfo } from "@/types";
import { createPublicClaimAuthorizationSchema } from "@/validation-schema/incentive";


export const useClaimAuth = (eventId : number) => {
    const { data : myInfo, isLoading, isPending, isError, error }  = useQuery<TMemberAttendeesMinimalInfo, string>({
        queryKey : ["my-claim-minimal-info"],
        queryFn : async () => {
            try{
                const request = await axios.get(`/api/v1/public/event/${eventId}/claim/verify-claim-auth`)
                return request.data
            }catch(e){
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
        retry : 0
    })

    return { myInfo, isLoading, isPending, isError, error }
}

export const useCreateClaimAuth = (eventId : number) => {
    const queryClient = useQueryClient();
    const { data : myInfo, mutate : authorize , isPending, isError, error }  = useMutation<TMemberAttendeesMinimalInfo, string, z.infer<typeof createPublicClaimAuthorizationSchema>>({
        mutationKey : ["create-claim-auth"],
        mutationFn : async (credentials) => {
            try{
                const request = await axios.post(`/api/v1/public/event/${eventId}/claim/authorize-claim`, credentials)
                queryClient.invalidateQueries({ queryKey : ['my-claim-minimal-info']})
                return request.data
            }catch(e){
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
    })

    return { myInfo, authorize, isPending, isError, error }
}
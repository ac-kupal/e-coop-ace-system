import z from "zod"
import axios from "axios";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    TIncentiveAssigned,
    TIncentiveWithClaimAndAssignedCount,
    TListOfAssigneesWithAssistCount,
    TUserWithAssignedIncentives,
} from "@/types";
import { handleAxiosErrorMessage } from "@/utils";
import { createIncentiveAssigneeSchema } from "@/validation-schema/incentive";

export const incentiveListWithClaimCount = (eventId: number) => {
    const { data, isFetching, isLoading, isError, error } = useQuery<
        TIncentiveWithClaimAndAssignedCount[]
    >({
        queryKey: ["incentive-withclaimcount-list"],
        queryFn: async () => {
            try {
                const request = await axios.get(
                    `/api/v1/admin/event/${eventId}/incentives`
                );
                return request.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw e;
            }
        },
        initialData: [],
    });

    return { data, isFetching, isLoading, isError, error };
};

export const useDeleteIncentive = (eventId: number, incentiveId: number) => {
    const queryClient = useQueryClient();

    const { mutate: deleteIncentive, isPending } = useMutation<any, string>({
        mutationKey: ["delete-incentive"],
        mutationFn: async (data) => {
            try {
                const response = await axios.delete(
                    `/api/v1/admin/event/${eventId}/incentives/${incentiveId}`,
                    { data }
                );

                queryClient.invalidateQueries({
                    queryKey: ["incentive-withclaimcount-list"],
                });

                toast.success("Incentive has been deleted.");
                return response.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);

                toast.error(errorMessage);
                throw errorMessage;
            }
        },
    });

    return { deleteIncentive, isPending };
};

export const useIncentiveListAssignee = (eventId: number) => {
    const { data, isLoading, isFetching, isError, error } = useQuery<
        TListOfAssigneesWithAssistCount[],
        string
    >({
        queryKey: ["incentive-assignee-list"],
        queryFn: async () => {
            try {
                const request = await axios.get(
                    `/api/v1/admin/event/${eventId}/incentives/assignees`
                );
                return request.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
        initialData: [],
    });

    return { data, isFetching, isLoading, isError, error };
};

export const userWithAssignedIncentives = (eventId: number) => {
    const { data : usersWithAssigned, isFetching : isFetchingUser, isLoading : isLoadingUser, isError, error } = useQuery<
        TUserWithAssignedIncentives[]
    >({
        queryKey: ["incentive-user-list"],
        queryFn: async () => {
            try {
                const request = await axios.get(`/api/v1/admin/event/${eventId}/incentives/user-with-assigned`);
                return request.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw e;
            }
        },
        initialData: [],
    });

    return { usersWithAssigned, isFetchingUser, isLoadingUser, isError, error };
};

export const useCreateAssignIncentive = (eventId : number, incentiveId : number, onCreate? : (created : TIncentiveAssigned)=>void) => {
    const queryClient = useQueryClient();

    const { data : created, mutate : createAssignee, isPending : isCreatingAssignee, isError, error } = useMutation<TIncentiveAssigned, string, z.infer<typeof createIncentiveAssigneeSchema>>({
        mutationKey : ["create-assign-incentive"],
        mutationFn : async (data) => {
            try{
                const request = await axios.post(`/api/v1/admin/event/${eventId}/incentives/${incentiveId}/assign`, data)
                if(onCreate) onCreate(request.data)

                queryClient.invalidateQueries({ queryKey: ["incentive-withclaimcount-list"] });
                queryClient.invalidateQueries({ queryKey: ["incentive-assignee-list"] });
                queryClient.invalidateQueries({ queryKey: ["incentive-user-list"] });

                toast.success("User Assigned!")

                return request.data;
            }catch(e){
                const errorMessage = handleAxiosErrorMessage(e)
                toast.error(errorMessage)
                throw errorMessage
            }
        }
    })

    return { created, createAssignee, isCreatingAssignee, isError, error }
}

export const useRevokeAssignIncentive = (eventId : number, incentiveId : number, assignId : number) => {
    const queryClient = useQueryClient();

    const { mutate: deleteAssignee, isPending : isDeleting } = useMutation<string, string>({
        mutationKey: ["delete-incentive"],
        mutationFn: async (data) => {
            try {
                const response = await axios.delete(`/api/v1/admin/event/${eventId}/incentives/${incentiveId}/assign/${assignId}`);

                queryClient.invalidateQueries({ queryKey: ["incentive-withclaimcount-list"] });
                queryClient.invalidateQueries({ queryKey: ["incentive-assignee-list"] });
                queryClient.invalidateQueries({ queryKey: ["incentive-user-list"] });
                
                toast.success("User revoked")

                return response.data
            }catch(e){
                const errorMessage = handleAxiosErrorMessage(e)
                toast.error(errorMessage);
                throw errorMessage
            }
        }
    })

    return { deleteAssignee, isDeleting }
}
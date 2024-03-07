import z from "zod"
import axios from "axios";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    TIncentiveAssigned,
    TIncentiveClaimsWithIncentiveAttendeeAssistedBy,
    TIncentiveClaimsWithIncentiveAndClaimAssistance,
    TIncentiveWithClaimAndAssignedCount,
    TListOfAssigneesWithAssistCount,
    TUserWithAssignedIncentives,
} from "@/types";
import { handleAxiosErrorMessage } from "@/utils";
import { claimIdSchema, createAssistedClaimSchema, createIncentiveAssigneeSchema } from "@/validation-schema/incentive";
import { TIncentiveAssignedToMe } from "@/types/incentive-assigned.types";

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

export const useAssignedIncentiveToMe = (eventId : number, enabled : boolean) => {
    const {data : assignedToMe, isFetching : isLoadingAssignedToMe} = useQuery<TIncentiveAssignedToMe[], string>({
        queryKey : ["incentive-assigned-to-me-list"],
        queryFn : async () => {
            try{
                const request = await axios.get(`/api/v1/admin/event/${eventId}/incentives/assigned-to-me`)
                return request.data;
            }catch(e){
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
        initialData : [],
        enabled
    })

    return { assignedToMe, isLoadingAssignedToMe }
}

export const useMemberClaimsWithAssistanceList = (eventId : number, memberId : string, enabled : boolean) => {
    const {data : memberClaims, isPending : isLoadingMemberClaims} = useQuery<TIncentiveClaimsWithIncentiveAndClaimAssistance[], string>({
        queryKey : [`incentive-claims-member-${memberId}`],
        queryFn : async () => {
            try{
                const request = await axios.get(`/api/v1/admin/event/${eventId}/member/${memberId}/claims`)
                return request.data;
            }catch(e){
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
        initialData : [],
        enabled
    })

    return { memberClaims, isLoadingMemberClaims }
}

export const useCreateClaimAssistance = (eventId : number, onCreate : () => void ) => {
    const { data : savedEntry, mutate : saveClaimEntries, isPending : isSavingClaim} = useMutation<any, string, z.infer<typeof createAssistedClaimSchema>>({
        mutationKey : ["create-assist-claim"],
        mutationFn : async (data) => {
            try{
                const request = await axios.post(`/api/v1/admin/event/${eventId}/incentives/claim`, data)
                toast.success("Claim saved!")
                onCreate();
                return request.data
            }catch(e){
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        }
    })

    return { savedEntry, saveClaimEntries, isSavingClaim }
}

export const useClaimsMasterList = (eventId : number ) => {
    const { data : claimList, refetch, isFetching, isError, isLoading } = useQuery<TIncentiveClaimsWithIncentiveAttendeeAssistedBy[], string>({
        queryKey : ["claims-master-list"],
        queryFn : async () => {
            try{
                const request = await axios.get(`/api/v1/admin/event/${eventId}/incentives/claim`)
                return request.data;
            }catch(e){
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error("Failed to load claims master list", { action : { label : "try again", onClick : () => refetch() }});
                throw errorMessage;
            }
        },
        initialData : []
    })

    return { claimList, refetch, isFetching, isError, isLoading }
}

export const useClaimDelete = (eventId : number, onDelete? : () => void ) => {
    const queryClient = useQueryClient()
    const { data : deletedClaim, mutate : deleteClaim, isPending : isDeletingClaim } = useMutation<any, string, number>({
        mutationKey : ["delete-claim"],
        mutationFn : async (claimId) => {
            try{
                const request = await axios.delete(`/api/v1/admin/event/${eventId}/incentives/claim/${claimId}`)
                toast.success("Claim Deleted")

                if(onDelete) onDelete()

                queryClient.invalidateQueries({ queryKey : ["claims-master-list"]})

                return request.data
            }catch(e){
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        }
    })

    return { deletedClaim, deleteClaim, isDeletingClaim }
}
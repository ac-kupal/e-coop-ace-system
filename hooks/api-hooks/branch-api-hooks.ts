import { toast } from "sonner";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { TBranch } from "@/types";
import { handleAxiosErrorMessage } from "@/utils";
import axios from "axios";

export const deleteBranch = ( ) => {
    const queryClient = useQueryClient();
    const deleteOperation = useMutation<any, string, number>({
        mutationKey : ["delete-branch"],
        mutationFn : async (branchId) => {
            try{
                const deleted = await axios.delete(`/api/v1/branch/${branchId}`);
                toast.success("Branch deleted successfully");
                queryClient.invalidateQueries({ queryKey: ["branch-list-query"] })
                return deleted.data;
            }catch(e){
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage, {
                    action : {
                        label : "try agian",
                        onClick : () => deleteOperation.mutate(branchId)
                    }
                });
                throw errorMessage
            }
        }
    })

    return deleteOperation;
}

export const branchList = () => {
    const branchListQuery = useQuery<TBranch[], string>({
        queryKey: ["branch-list-query"],
        queryFn: async () => {
            try {
                const response = await axios.get("/api/v1/branch");
                return response.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage, {
                    action : {
                        label : "try agian",
                        onClick : () => branchListQuery.refetch()
                    }
                });
                throw handleAxiosErrorMessage(e);
            }
        },
        initialData: [],
    });

    return branchListQuery;
}
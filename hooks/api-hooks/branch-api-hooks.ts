import z from "zod"
import { toast } from "sonner";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { TBranch } from "@/types";
import { handleAxiosErrorMessage } from "@/utils";
import axios from "axios";
import { createBranchSchema } from "@/validation-schema/branch";

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

type TUpdateBranch = z.infer<typeof createBranchSchema>;

export const updateBranch = ({ branchId, onUpdate } : { branchId : number, onUpdate : (newBranch : TBranch) => void }) => {
    const queryClient = useQueryClient();
    const update = useMutation<TBranch, string, TUpdateBranch>({
        mutationKey: ["update-branch"],
        mutationFn: async (data) => {
            try {
                const response = await axios.patch(`/api/v1/branch/${branchId}`, { data });

                queryClient.invalidateQueries({ queryKey: ["branch-list-query"] });
                
                return response.data;
            } catch (e) {
                let errorMessage = "";
                
                if (e instanceof Error) errorMessage = e.message;
                else errorMessage =  handleAxiosErrorMessage(e);

                toast.error(errorMessage);
                throw errorMessage
            }
        },
    });

    return update
}
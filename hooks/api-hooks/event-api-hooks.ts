import { toast } from "sonner";
import {  useMutation, useQueryClient } from "@tanstack/react-query";
import { handleAxiosErrorMessage } from "@/utils";
import axios from "axios";

export const deleteEvent = ( ) => {
    const queryClient = useQueryClient();
    const deleteOperation = useMutation<any, string, number>({
        mutationKey : ["delete-branch"],
        mutationFn : async (eventId) => {
            try{
                const deleted = await axios.delete(`/api/v1/event/${eventId}`);
                toast.success("Branch deleted successfully");
                queryClient.invalidateQueries({ queryKey: ["event-list-query"] })
                return deleted.data;
            }catch(e){
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage, {
                    action : {
                        label : "try agian",
                        onClick : () => deleteOperation.mutate(eventId)
                    }
                });
                throw errorMessage
            }
        }
    })

    return deleteOperation;
}
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleAxiosErrorMessage } from "@/utils";
import axios from "axios";

export const deleteEvent = () => {
   const queryClient = useQueryClient();
   const deleteEventMutation = useMutation<any, string, number>({
      mutationKey: ["delete-event"],
      mutationFn: async (eventId) => {
         try {
            const deleted = await axios.delete(`/api/v1/event/${eventId}`);
            toast.success("Event deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["event-list-query"] });
            return deleted.data;
         } catch (e) {
            const errorMessage = handleAxiosErrorMessage(e);
            toast.error(errorMessage, {
               action: {
                  label: "try agian",
                  onClick: () => deleteEventMutation.mutate(eventId),
               },
            });
            throw errorMessage;
         }
      },
   });
   return deleteEventMutation;
};

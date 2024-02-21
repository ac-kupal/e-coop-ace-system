import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleAxiosErrorMessage } from "@/utils";
import axios from "axios";


export const deletePosition = () => {
   const queryClient = useQueryClient();
   const deletePositionMutation = useMutation<any, string, number>({
      mutationKey: ["delete-position"],
      mutationFn: async (positionId) => {
         try {
            const deleted = await axios.delete(`/api/v1/position/${positionId}`);
            toast.success("Position deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["position-list-query"] });
            return deleted.data;
         } catch (e) {
            const errorMessage = handleAxiosErrorMessage(e);
            toast.error(errorMessage, {
               action: {
                  label: "try agian",
                  onClick: () => deletePositionMutation.mutate(positionId),
               },
            });
            throw errorMessage;
         }
      },
   });
   return deletePositionMutation;
};


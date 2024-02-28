import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleAxiosErrorMessage } from "@/utils";
import axios from "axios";
import { TMember, TPosition } from "@/types";

export const deletePosition = () => {
   const queryClient = useQueryClient();
   const deletePositionMutation = useMutation<any, string, number>({
      mutationKey: ["delete-position"],
      mutationFn: async (positionId) => {
         try {
            const deleted = await axios.delete(
               `/api/v1/position/${positionId}`
            );
            toast.success("Position deleted successfully");
            queryClient.invalidateQueries({
               queryKey: ["filtered-position-list-query"],
            });
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
//get all filtered Position
export const getPosition = (id:number| undefined) => {
   const positions = useQuery<TPosition[], string>({
      queryKey: ["filtered-position-list-query"],
      queryFn: async () => {
         try {
            const response = await axios.get(`/api/v1/position/${id}`);
            return response.data;
         } catch (e) {
            throw handleAxiosErrorMessage(e);
         }
      },
      initialData: [],
   });
   return positions
};

//get all Position
export const getAllPosition = () => {
   const positions = useQuery<TPosition[], string>({
      queryKey: ["all-position-list-query"],
      queryFn: async () => {
         try {
            const response = await axios.get(`/api/v1/position/`);
            return response.data;
         } catch (e) {
            throw handleAxiosErrorMessage(e);
         }
      },
      initialData: [],
   });
   return positions
};


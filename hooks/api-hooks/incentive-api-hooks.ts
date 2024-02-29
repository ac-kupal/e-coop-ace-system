import { TIncentive, TIncentiveWithClaimCount } from "@/types";
import { handleAxiosErrorMessage } from "@/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import z from "zod";

export const incentiveListWithClaimCount = (eventId: number) => {
  const { data, isFetching, isLoading, isError, error } = useQuery<
    TIncentiveWithClaimCount[]
  >({
    queryKey: ["incentive-withclaimcount-list"],
    queryFn: async () => {
      try {
        const request = await axios.get(`/api/v1/event/${eventId}/incentives`);
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
          `/api/v1/event/${eventId}/incentives/${incentiveId}`,
          { data },
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

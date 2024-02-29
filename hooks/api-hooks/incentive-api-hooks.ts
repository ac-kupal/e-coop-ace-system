import { TIncentiveWithClaimCount } from "@/types";
import { handleAxiosErrorMessage } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import z from "zod";

export const incentiveListWithClaimCount = (eventId: number) => {
  const { data, isFetching, isLoading, isError, error} = useQuery<TIncentiveWithClaimCount[]>({
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
    initialData : []
  });

    return { data, isFetching, isLoading, isError, error }
};

import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { TCoopWBranch } from "@/types";
import { handleAxiosErrorMessage } from "@/utils";

export const useCoopList = () => {
    const { data : coopList, isLoading, refetch, isFetching, isError} = useQuery<TCoopWBranch[], string>({
        queryKey: ["coop-list-query"],
        queryFn: async () => {
            try {
                const response = await axios.get("/api/v1/admin/coop");
                return response.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage, {
                    action: {
                        label: "try agian",
                        onClick: () => refetch(),
                    },
                });
                throw handleAxiosErrorMessage(e);
            }
        },
        initialData: [],
    });

    return { coopList, isLoading, refetch, isFetching, isError };
};


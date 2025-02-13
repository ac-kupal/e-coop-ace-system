import z from "zod";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


import { TEventWithElection } from "@/types";
import { handleAxiosErrorMessage } from "@/utils";
import { IMutationHook, IQueryHook } from "./types";
import { updateEventSchema } from "@/validation-schema/event";

// Updated Feb 13 : 2024
// My code before sucks! lmao no time to refactor the rest

export const useGetEventById = ({
    eventId,
    onError,
    onSuccess,
    ...other
}: { eventId: number } & IQueryHook<TEventWithElection, string>) => {
    return useQuery<TEventWithElection, string>({
        queryKey: ["position-list-query"],
        queryFn: async () => {
            try {
                const response = await axios.get(`/api/v1/admin/event/${eventId}`);
                onSuccess?.(response.data);
                return response.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                onError?.(errorMessage);
                throw errorMessage;
            }
        },
        ...other,
    });
};

export const useUpdateEventSettings = ({
    eventId,
    onSuccess,
    onError,
    ...other
}: IMutationHook<TEventWithElection, string> & { eventId: number }) => {
    const queryClient = useQueryClient();

    return useMutation<
        TEventWithElection,
        string,
        z.infer<typeof updateEventSchema>
    >({
        mutationKey: [`event-${eventId}-update-settings`],
        mutationFn: async (settings) => {
            try {
                const request = await axios.patch(
                    `/api/v1/admin/event/${eventId}/settings`,
                    settings
                );
                queryClient.invalidateQueries({
                    queryKey: [`event-${eventId}-settings`],
                });

                queryClient.invalidateQueries({
                    queryKey: ["event-list-query"],
                });

                onSuccess?.(request.data);

                return request.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                onError?.(errorMessage);
                throw errorMessage;
            }
        },
        ...other,
    });
};

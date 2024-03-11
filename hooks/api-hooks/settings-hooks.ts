import z from "zod"
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { SettingsType, TEventSettings } from "@/types";
import { handleAxiosErrorMessage } from "@/utils";
import { eventSettingsSchema } from "@/validation-schema/event-settings";

type TParams = {
    params: { id: number, electionId: number }
}

export const updateElectionSettings = ({ params }: TParams) => {
    const queryClient = useQueryClient();
    const router = useRouter()
    const udateSettingsMutation = useMutation<SettingsType, number, { data: SettingsType }>({
        mutationKey: ["update-settings"],
        mutationFn: async ({ data }) => {
            try {
                const eventId = Number(params.id)
                const electionId = Number(params.electionId)
                const response = await axios.patch(`/api/v1/admin/event/${eventId}/election/${electionId}`, data);
                toast.success("Election updated successfully");
                queryClient.invalidateQueries({ queryKey: ["get-election-query"], });
                router.refresh();
                return response.data;
            } catch (e) {
                console.log(e)
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage, {
                    action: {
                        label: "try agian",
                        onClick: () => udateSettingsMutation.mutate({ data }),
                    },
                });
                throw errorMessage;
            }
        },
    });
    return udateSettingsMutation;
};

export const useEventSettings = (eventId: number) => {
    const { data: existingSettings, isLoading, isRefetching } = useQuery<TEventSettings, string>({
        queryKey: [`event-${eventId}-settings`],
        queryFn: async () => {
            try {
                const request = await axios.get(`/api/v1/admin/event/${eventId}/settings`)
                return request.data
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
        initialData: { registrationOnEvent: true, defaultMemberSearchMode: "ByPassbook" }
    })

    return { existingSettings, isLoading, isRefetching }
}

export const useUpdateEventSettings = (eventId: number) => {
    const queryClient = useQueryClient();

    const { data: updatedData, mutate: updateSettings, isPending } = useMutation<TEventSettings, string, z.infer<typeof eventSettingsSchema>>({
        mutationKey: [`event-${eventId}-update-settings`],
        mutationFn: async (settings) => {
            try {
                const request = await axios.patch(`/api/v1/admin/event/${eventId}/settings`, settings)
                queryClient.invalidateQueries({ queryKey: [`event-${eventId}-settings`] })

                toast.success("Event settings updated successfully")
                return request.data
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
    })

    return { updatedData, updateSettings, isPending }
}


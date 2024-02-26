import { SettingsType } from "@/app/(private)/admin/events/[id]/settings/_components/settings-form";
import { handleAxiosErrorMessage } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const updateElectionSettings = () => {
     const queryClient = useQueryClient();
     const router = useRouter()
     const udateSettingsMutation = useMutation<SettingsType, number, { electionId: number, data: SettingsType }>({
        mutationKey: ["update-settings"],
        mutationFn: async ({electionId,data}) => {
           try {
              const response = await axios.patch(`/api/v1/settings/vote-eligibility/${electionId}`,data);
              queryClient.invalidateQueries({  queryKey: ["election-list-query"] });
              toast.success("Election updated successfully");
              router.refresh()
              return response.data;
           } catch (e) {
              const errorMessage = handleAxiosErrorMessage(e);
              toast.error(errorMessage, {
                 action: {
                    label: "try agian",
                    onClick: () => udateSettingsMutation.mutate({electionId,data}),
                 },
              });
              throw errorMessage;
           }
        },
     });
     return udateSettingsMutation;
  };
  
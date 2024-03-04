import { SettingsType } from "@/app/(private)/admin/events/[id]/settings/_components/settings-form";
import { handleAxiosErrorMessage } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type TParams = {
   params:{id:number,electionId:number}
}

export const updateElectionSettings = ({params}:TParams) => {
     const queryClient = useQueryClient();
     const router = useRouter()
     const udateSettingsMutation = useMutation<SettingsType, number, { data: SettingsType }>({
        mutationKey: ["update-settings"],
        mutationFn: async ({data}) => {
           try {
            console.log(params)
              const response = await axios.patch(`/api/v1/admin/event/${params.id}/election/${params.electionId}`,data);
              toast.success("Election updated successfully");
              queryClient.invalidateQueries({queryKey: ["get-election-query"],});
              router.refresh();
              return response.data;
           } catch (e) {
            console.log(e)
              const errorMessage = handleAxiosErrorMessage(e);
              toast.error(errorMessage, {
                 action: {
                    label: "try agian",
                    onClick: () => udateSettingsMutation.mutate({data}),
                 },
              });
              throw errorMessage;
           }
        },
     });
     return udateSettingsMutation;
  };
  
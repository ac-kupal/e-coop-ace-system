import { handleAxiosErrorMessage } from "@/utils"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner";


export const useClaimAuth = (eventId : number) => {
    const {}  = useMutation<any, string>({
        mutationKey : ["claim-auth"],
        mutationFn : async () => {
            try{

            }catch(e){
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        }
    })

    return {  }
}
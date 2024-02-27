import { TMember } from "@/types";
import { handleAxiosErrorMessage } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";


export const getAllMembers = (id:number) => {
   const positions = useQuery<TMember[], string>({
      queryKey: ["all-members-list-query"],
      queryFn: async () => {
         try {
            const eventId = Number(id)
            const response = await axios.get(`/api/v1/member/get-all-member/${eventId}`);
            return response.data;
         } catch (e) {
            throw handleAxiosErrorMessage(e);
         }
      },
      initialData: [],
   });
   return positions
};

export const getMembers = () => {
     const getAllMember = useQuery<TMember[]>({
        queryKey: ["get-all-member-list-query"],
        queryFn: async () => {
           try {
               const response = await axios.get(`/api/v1/member/`);
               console.log("this is response",response)
              return response.data;
           } catch (e) {
               throw handleAxiosErrorMessage(e);
           }
        },
     });
     console.log(getAllMember)
     return getAllMember;
  };
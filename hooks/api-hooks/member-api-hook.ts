import { TCreateMember, TMember } from "@/types";
import { handleAxiosErrorMessage } from "@/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";


export const getAllEventMembers = (id:number) => {
   const positions = useQuery<TMember[], string>({
      queryKey: ["all-event-members-list-query"],
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
              return response.data;
           } catch (e) {
               throw handleAxiosErrorMessage(e);
           }
        },
     });
     console.log(getAllMember)
     return getAllMember;
  };

  export const deleteMember = () => {
   const queryClient = useQueryClient();
   const deleteMemberMutation = useMutation<any, Error, { eventId: string }>({ 
      mutationKey: ["delete-member-query"],
      mutationFn: async ({ eventId }) => { 
         try {
             const response = await axios.delete(`/api/v1/member/${eventId}`);
             queryClient.invalidateQueries({ queryKey: ["all-event-members-list-query"] });
             toast.success("Member deleted successfully");
            return response.data;
         } catch (e) {
             throw handleAxiosErrorMessage(e);
         }
      },
   });

   return deleteMemberMutation;
};

type Props = {
   onCancelandReset: () => void;
};

export const createMember = ({onCancelandReset}:Props) => {
   const queryClient = useQueryClient();
   const addMember = useMutation<any, Error, { member: TCreateMember }>({ 
      mutationKey: ["delete-member-query"],
      mutationFn: async ({member}) => { 
         try {
            console.log(member)
             const response = await axios.post(`/api/v1/member/`,member);
             queryClient.invalidateQueries({ queryKey: ["all-event-members-list-query"] });
             toast.success("Member added successfully");
             onCancelandReset()
            return response.data;
         } catch (e) {
            console.log(e)
             throw handleAxiosErrorMessage(e);
         }
      },
   });

   return addMember;
};

export const updateMember = ({onCancelandReset}:Props) => {
   const queryClient = useQueryClient();
   const addMember = useMutation<any, Error, { member: TCreateMember, memberId:string }>({ 
      mutationKey: ["delete-member-query"],
      mutationFn: async ({member,memberId}) => { 
         try {
             const response = await axios.patch(`/api/v1/member/${memberId}`,member);
             queryClient.invalidateQueries({ queryKey: ["all-event-members-list-query"] });
             toast.success("Member updated successfully");
             onCancelandReset()
            return response.data;
         } catch (e) {
            console.log(e)
             throw handleAxiosErrorMessage(e);
         }
      },
   });

   return addMember;
};
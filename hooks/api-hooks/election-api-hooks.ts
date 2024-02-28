import { TElection } from "@/types";
import { handleAxiosErrorMessage } from "@/utils";
import { ElectionStatus } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export const getElection = (id:number) => {
     const electionId = Number(id)
     const getElection = useQuery<TElection>({
         queryKey: ["election-list-query"],
         queryFn: async () => {
            try {
               const response = await axios.get(`/api/v1/election/${electionId}`);
               return response.data;
            } catch (e) {
               const errorMessage = handleAxiosErrorMessage(e);
               throw errorMessage;
            }
         },
      });
      return getElection
};

export const hasElection = (id:number) => {
   const electionId = Number(id)
   const getElection = useQuery<TElection>({
       queryKey: ["election-list-query"],
       queryFn: async () => {
          try {
             const response = await axios.get(`/api/v1/election/${electionId}`);
             return response.data;
          } catch (e) {
             const errorMessage = handleAxiosErrorMessage(e);
             throw errorMessage;
          }
       },
    });
    return getElection
};

export const  promptElectionStatus = () =>{
   const promptElection = useMutation<ElectionStatus,any,{status:ElectionStatus, id:number}>({
      mutationKey:["election-prompt-key"],
      mutationFn:async({status,id})=>{
         try { 
           const electionId = Number(id)
           console.log(status,id)
           const response = await axios.patch(`/api/v1/election/${electionId}/start`,{
            status:status
           })
           return response.data 
         } catch (e) {
            throw handleAxiosErrorMessage(e);
         }
      }
   })
   return promptElection
}
   
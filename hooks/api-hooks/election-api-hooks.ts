import { TCandidate, TCandidatewithPosition, TElection, TElectionWithPositions, TElectionWithPositionsAndCandidates, TPosition } from "@/types";
import { handleAxiosErrorMessage } from "@/utils";
import { ElectionStatus } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const getElection = (id:number) => {
     const electionId = Number(id)
     const {data, isLoading,error } = useQuery<TElectionWithPositionsAndCandidates>({
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
      return { elections: data ?? [], isLoading, error };
};

export const hasElection = (id:number) => {
   const electionId = Number(id)
   const {data, isLoading,error }= useQuery<TElection>({
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
    return { elections: data ?? [], isLoading, error };
};

export const  promptElectionStatus = () =>{
   const router = useRouter()
   const queryClient = useQueryClient()
   const promptElection = useMutation<ElectionStatus,any,{status:ElectionStatus, id:number}>({
      mutationKey:["election-prompt-key"],
      mutationFn:async({status,id})=>{
         try { 
            const electionId = Number(id)
             const response = await axios.patch(`/api/v1/election/${electionId}/switch`,{
            status:status
            })
           toast.success(`The Election is already  ${status === "live" ? "Live! 🎉":"End"}`);
           queryClient.invalidateQueries({queryKey: ["election-list-query"],});
           router.refresh();
           return response.data 
         } catch (e) {
            throw handleAxiosErrorMessage(e);
         }
      }
   })
   return promptElection
}
type TParams ={
   params:{id:number,electionId:number}
}

export const getElectionWithPosition = ({params}:TParams) => {
    const { data, isLoading, error } = useQuery<TElectionWithPositions, any>({
       queryKey: ["get-filtered-position-query"],
       queryFn: async () => {
          try {
             const response = await axios.get(`/api/v1/admin/event/${params.id}/election/${params.electionId}`);
             return response.data;
          } catch (e) {
             const errorMessage = handleAxiosErrorMessage(e);
             throw errorMessage;
          }
       },
    });
    return { elections: data , isLoading, error };
};

export const getCandidatesWithElectionId = (id:number) => {
   const eventId = Number(id)
    const { data, isLoading, error } = useQuery<TCandidatewithPosition[]>({
       queryKey: ["get-filtered-candidates-query"],
       queryFn: async () => {
          try {
             const response = await axios.get(`/api/v1/election/candidates/${eventId}`);
             return response.data;
          } catch (e) {
             const errorMessage = handleAxiosErrorMessage(e);
             throw errorMessage;
          }
       },
    });
    return { candidates: data ?? [], isLoading, error };
};






import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleAxiosErrorMessage } from "@/utils";
import axios from "axios";
import { mutationErrorHandler } from "@/errors/mutation-error-handler";
import { TCandidatewithPosition, TCreateCandidate, TUpdatePosition } from "@/types";

export const deleteCandidate = () => {
   const queryClient = useQueryClient();
   const deleteCandidateMutation = useMutation<any, string, number>({
      mutationKey: ["delete-candidate"],
      mutationFn: async (candidateId) => {
         try {
            const deleted = await axios.delete(
               `/api/v1/candidate/${candidateId}`
            );
            toast.success("candidate deleted successfully");
            queryClient.invalidateQueries({
               queryKey: ["candidate-list-query"],
            });
            return deleted.data;
         } catch (e) {
            const errorMessage = handleAxiosErrorMessage(e);
            toast.error(errorMessage, {
               action: {
                  label: "try agian",
                  onClick: () => deleteCandidateMutation.mutate(candidateId),
               },
            });
            throw errorMessage;
         }
      },
   });
   return deleteCandidateMutation;
};

type Props = {
   onCancelandReset: () => void;
};

export const useCreateCandidate = ({ onCancelandReset }: Props) => {
   const queryClient = useQueryClient();
   const createCandidate = useMutation<TCreateCandidate, string, unknown>({
      mutationKey: ["create-candidate-key"],
      mutationFn: async (data) => {
         try {
            console.log(data);
            const response = await axios.post("/api/v1/candidate", data);
            return response.data;
         } catch (e) {
            mutationErrorHandler(e);
         }
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["candidate-list-query"] });
         onCancelandReset();
         toast.success("candidate created successfully");
      },
   });
   return createCandidate;
};

export const getCandidates = (electionId: number | undefined) => {
   const getCandidates = useQuery<TCandidatewithPosition[], string>({
      queryKey: ["candidate-list-query"],
      queryFn: async () => {
         try {
            const response = await axios.get(`/api/v1/candidate/${electionId}`);
            return response.data;
         } catch (e) {
            handleAxiosErrorMessage(e);
         }
      },
      initialData: [],
   });

   return getCandidates;
};

type UpdateCandidateProps = {
   candidateId:number,
   onCancelandReset: () => void;
}

export const useUpdateCandidate =({candidateId, onCancelandReset}:UpdateCandidateProps)=>{
   const queryClient = useQueryClient();
   const updateCandidate = useMutation<TUpdatePosition, string, unknown>({
      mutationKey: ["update-candidate-key"],
      mutationFn: async (positionData) => {
         try {
            const response = await axios.patch(`/api/v1/candidate/${candidateId}`, positionData);
            return response.data;
         } catch (e) {
            mutationErrorHandler(e);
         }
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["candidate-list-query"] });
         onCancelandReset();
         toast.success("candidate updated successfully");
      },
   });

   return updateCandidate
}


export const getAllCandidates = () => {
   const getCandidates = useQuery<TCandidatewithPosition[], string>({
      queryKey: ["candidate-list-query"],
      queryFn: async () => {
         try {
            const response = await axios.get(`/api/v1/candidate`);
            return response.data;
         } catch (e) {
            handleAxiosErrorMessage(e);
         }
      },
      initialData: [],
   });

   return getCandidates;
};
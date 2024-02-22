import { TElection } from "@/types";
import { handleAxiosErrorMessage } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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
   
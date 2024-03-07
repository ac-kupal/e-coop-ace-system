import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleAxiosErrorMessage } from "@/utils";
import axios from "axios";
import { TEventWithElection } from "@/types";
import { mutationErrorHandler } from "@/errors/mutation-error-handler";
import { useRouter } from "next/navigation";

export const deleteEvent = () => {
   const queryClient = useQueryClient();
   const deleteEventMutation = useMutation<any, string, number>({
      mutationKey: ["delete-event"],
      mutationFn: async (eventId) => {
         try {
            const deleted = await axios.delete(`/api/v1/admin/event/${eventId}`);
            toast.success("Event deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["event-list-query"] });
            return deleted.data;
         } catch (e) {
            const errorMessage = handleAxiosErrorMessage(e);
            toast.error(errorMessage, {
               action: {
                  label: "try agian",
                  onClick: () => deleteEventMutation.mutate(eventId),
               },
            });
            throw errorMessage;
         }
      },
   });
   return deleteEventMutation;
};

export const getAllEvent = () => {
   const getAllEvent = useQuery<TEventWithElection[], string>({
      queryKey: ["event-list-query"],
      queryFn: async () => {
         try {
            const response = await axios.get("/api/v1/admin/event");
            return response.data;
         } catch (e) {
            const errorMessage = handleAxiosErrorMessage(e);
            toast.error(errorMessage, {
               action: {
                  label: "try agian",
                  onClick: () => getAllEvent.refetch(),
               },
            });
            throw handleAxiosErrorMessage(e);
         }
      },
      initialData: [],
   });

   return getAllEvent
};

export const getEvent = (id: number) => {
   const eventId = Number(id);
   const getEvent = useQuery<TEventWithElection, string>({
      queryKey: ["position-list-query"],
      queryFn: async () => {
         try {
            const response = await axios.get(`/api/v1/event/${eventId}`);
            return response.data;
         } catch (e) {
            const errorMessage = handleAxiosErrorMessage(e);
            throw errorMessage;
         }
      },
   });
   return getEvent;
};
type Props = {
   onCancelandReset: () => void;
   id?: number;
};

export const useCreateEvent = ({ onCancelandReset }: Props) => {
   const router = useRouter();
   const queryClient = useQueryClient();
   const createEvent = useMutation<TEventWithElection, string, any>({
      mutationKey: ["create-event"],
      mutationFn: async (data) => {
         try {
            const response = await axios.post("/api/v1/admin/event", { data });
            return response.data;
         } catch (e) {
            mutationErrorHandler(e);
         }
      },
      onSuccess: (data: TEventWithElection) => {
         queryClient.invalidateQueries({ queryKey: ["event-list-query"] });
         onCancelandReset();
         toast.success("Event created successfully");
         if (!data.election) return;
         router.push(`/admin/events/${data.id}/election/${data.election.id}/overview`);
      },
   });

   return createEvent;
};

export const updateEvent = ({ onCancelandReset, id }: Props) => {
   const router = useRouter()
   const queryClient = useQueryClient();
   const createEvent = useMutation<TEventWithElection, string, any>({
      mutationKey: ["update-event"],
      mutationFn: async (data) => {
         try {
            const response = await axios.patch(`/api/v1/admin/event/${id}`, data);
            return response.data;
         } catch (e) {
            mutationErrorHandler(e);
         }
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["event-list-query"] });
         onCancelandReset();
         toast.success("Event updated successfully");
         router.refresh()
         console.log(router.refresh())
      },
   });

   return createEvent;
};

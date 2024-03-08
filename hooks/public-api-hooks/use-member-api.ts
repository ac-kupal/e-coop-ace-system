import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { handleAxiosErrorMessage } from "@/utils";
import { attendeeRegisterFormSchema, memberAttendeeSearchSchema } from "@/validation-schema/event-registration-voting";
import { TMemberAttendeesMinimalInfo } from "@/types";

export const useSearchMemberAttendee = (eventId : number, onSingleFound? : (member : TMemberAttendeesMinimalInfo) => void ) => {
    const { data : searchResults, isPending, mutate: searchMember, isError, error, reset } = useMutation<TMemberAttendeesMinimalInfo[], string, z.infer<typeof memberAttendeeSearchSchema>>({
        mutationKey: ["member-search"],
        mutationFn: async (searchData) => {
            try {
                const request = await axios.post(`/api/v1/public/event/${eventId}/event-attendee/search`, searchData);
                if(onSingleFound && request.data.length === 1) onSingleFound(request.data[0]);
                return request.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
    });

    return { searchResults, searchMember, isPending, isError, error, reset }
};

export const useRegisterMember = (eventId: number, onRegister: () => void) => {
    const {
        data: registeredMember,
        isPending,
        mutate: register,
        isError,
        error,
    } = useMutation<any, string, z.infer<typeof attendeeRegisterFormSchema>>({
        mutationKey: ["member-search"],
        mutationFn: async (data) => {
            try {
                const request = await axios.post(
                    `/api/v1/public/event/${eventId}/register`,
                    data,
                );
                toast.success("You have been registered to this event.");
                onRegister();
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
    });

    return { registeredMember, isPending, register, isError, error };
};

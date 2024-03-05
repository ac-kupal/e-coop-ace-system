import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { handleAxiosErrorMessage } from "@/utils";
import { attendeeRegisterFormSchema, voterPbSearchSchema } from "@/validation-schema/event-registration-voting";
import { TMemberAttendeesMinimalInfo } from "@/types";

export const useSearchMemberAttendee = (eventId : number, onFound? : (member : TMemberAttendeesMinimalInfo) => void ) => {
    const {
        data : member,
        isPending,
        mutate: searchMember,
        isError,
        error,
    } = useMutation<TMemberAttendeesMinimalInfo, string, z.infer<typeof voterPbSearchSchema>>({
        mutationKey: ["member-search"],
        mutationFn: async ({ passbookNumber }) => {
            try {
                const request = await axios.get(
                    `/api/v1/public/event/${eventId}/event-attendee/${passbookNumber}`,
                );
                if(onFound) onFound(request.data);
                return request.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
    });

    return { member, searchMember, isPending, isError, error }
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

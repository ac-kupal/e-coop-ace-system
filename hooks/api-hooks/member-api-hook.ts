import z from "zod";
import axios from "axios";
import moment from "moment";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { TCreateMember, TMemberAttendeesMinimalInfo, TMemberWithEventElectionId } from "@/types";
import { handleAxiosErrorMessage } from "@/utils";
import useSkippedStore from "@/stores/skipped-members-store";
import { useRouter } from "next/navigation";
import { voterVerificationFormSchema } from "@/validation-schema/event-registration-voting";

export const getAllEventMembers = (eventId: number) => {
    const members = useQuery<TMemberWithEventElectionId[], string>({
        queryKey: ["all-event-members-list-query"],
        queryFn: async () => {
            try {
                const response = await axios.get(
                    `/api/v1/admin/event/${eventId}/member`
                );
                return response.data;
            } catch (e) {
                throw handleAxiosErrorMessage(e);
            }
        },
        initialData: [],
    });
    return members;
};

export const FilteredEventMembersForCandidateSelection = (eventId: number,electionId:number) => {
    const members = useQuery<TMemberWithEventElectionId[], string>({
        queryKey: ["membersOnCandidate-list-query"],
        queryFn: async () => {
            try {
                console.log(eventId,electionId)
                const response = await axios.get(`/api/v1/admin/event/${eventId}/election/${electionId}/select-candidate`
                );
                return response.data;
            } catch (e) {
                throw handleAxiosErrorMessage(e);
            }
        },
        initialData: [],
    });
    return members;
};


export const deleteMember = () => {
    const queryClient = useQueryClient();
    const deleteMemberMutation = useMutation<any, Error, { eventId: number,memberId:string }>({
        mutationKey: ["delete-member-query"],
        mutationFn: async ({ eventId,memberId }) => {
            try {
                const response = await axios.delete(
                    `/api/v1/admin/event/${eventId}/member/${memberId}`
                );
                queryClient.invalidateQueries({
                    queryKey: ["all-event-members-list-query"],
                });
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

export const createMember = ({ onCancelandReset }: Props) => {
    const queryClient = useQueryClient();
    const addMember = useMutation<any, Error, { member: TCreateMember,eventId:number }>({
        mutationKey: ["create-member-query"],
        mutationFn: async ({ member,eventId }) => {
            try {
                const newBirthday = moment(member.birthday).format(
                    "YYYY-MM-DD HH:mm:ss"
                );
                const newMember = { ...member, birthday: !member.birthday ? undefined : newBirthday };
                const response = await axios.post(`/api/v1/admin/event/${eventId}/member/`, newMember);
                return response.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage, {
                    action: {
                        label: "try agian",
                        onClick: () => addMember.mutate({ member,eventId }),
                    },
                });
                throw errorMessage;
            }
        },
        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey: ["all-event-members-list-query"],
            });
            toast.success("Member added successfully");
            onCancelandReset();
        }
    });

    return addMember;
};

export const updateMember = ({ onCancelandReset }: Props) => {
    const queryClient = useQueryClient();
    const router = useRouter()
    const updateMember = useMutation<any,Error,  { member: TCreateMember, memberId: string, eventId:number }
    >({
        mutationKey: ["update-member-query"],
        mutationFn: async ({ member, memberId, eventId }) => {
            try {
                const response = await axios.patch(`/api/v1/admin/event/${eventId}/member/${memberId}`,member);
                return response.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage, {
                    action: {
                        label: "try agian",
                        onClick: () =>
                            updateMember.mutate({ member, memberId,eventId }),
                    },
                });
                throw errorMessage;
            }
        },
        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey: ["all-event-members-list-query"],
            });
            toast.success("Member updated successfully");
            onCancelandReset();
            router.refresh()
        }
    });

    return updateMember;
};

type createManyMemberProps = {
    onCancelandReset: () => void;
    onOpenSkippedMember: () => void;
};

export const createManyMember = ({ onCancelandReset,onOpenSkippedMember }:  createManyMemberProps) => {
    const {setSkippedMembers} = useSkippedStore()

    const queryClient = useQueryClient();
    const addMember = useMutation<
        any,
        Error,
        { member: TCreateMember[] | unknown; eventId: number }
    >({
        mutationKey: ["create-member-query"],
        mutationFn: async ({ member, eventId }) => {
            try {
                const response = await axios.post( `/api/v1/admin/event/${eventId}/member/import-member`,member);
               
                return response.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage, {
                    action: {
                        label: "try agian",
                        onClick: () => addMember.mutate({ member, eventId }),
                    },
                });
                throw errorMessage;
            }
        },
        onSuccess:(data)=>{
            const skippedMembers = data.skippedMembers
            const newMembers = data.newMembers
            const modifiedMember = skippedMembers.map((member:any) => {
                return {
                        passbookNumber:member.passbookNumber,
                        firstName:member.firstName,
                        middleName:member.middleName,
                        lastName:member.lastName,
                        gender:member.gender,
                        birthday:new Date(member.birthday),
                        contact:member.contact,
                        emailAddress:member.emailAddress,
                        }
            });
            if(skippedMembers.length > 0){
                onOpenSkippedMember();
                setSkippedMembers(modifiedMember)
                queryClient.invalidateQueries({
                    queryKey: ["all-event-members-list-query"],
                });
                toast.warning(`${skippedMembers.length} Duplicate Found! `);
                onCancelandReset();
            }  
            if(newMembers.length > 0){
                queryClient.invalidateQueries({
                    queryKey: ["all-event-members-list-query"],
                });  
                setTimeout(() => {
                    toast.success(`New ${newMembers.length} Members Added successfully`);
                }, 1000);
                onCancelandReset();
            }else{
                setTimeout(() => {
                    toast.info(`No new members added!`);
                }, 3000);
            }    
        }
    });

    return addMember;
};

export const useBroadcastOTP = (eventId: number) => {
    const {
        data: broadcastData,
        isPending: isBroadcasting,
        mutate: broadcastOTP,
    } = useMutation<
        { sentCount: 0; invalidEmailAddress: 0; failedSend: 0 },
        string
    >({
        mutationKey: [`broadcast-otp-${eventId}`],
        mutationFn: async () => {
            try {
                const request = await axios.post(
                    `/api/v1/admin/event/${eventId}/otp/broadcast-otp`
                );
                return request.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
    });

    return { broadcastData, broadcastOTP, isBroadcasting };
};

export const useOtpSend = (eventId: number, passbookNumber: string) => {
    const { isPending: isSendingOtp, mutate: sendOtp } = useMutation<
        any,
        string
    >({
        mutationKey: [`send-otp-${eventId}`],
        mutationFn: async () => {
            try {
                const request = await axios.post(
                    `/api/v1/admin/event/${eventId}/otp/specific-send`,
                    { passbookNumber }
                );
                toast.success("OTP has been sent");
                return request.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
    });

    return { isSendingOtp, sendOtp };
};

type quorumtype = {
    totalAttendees: number,
    totalIsRegistered: number
    totalMembersVoted:number
}

export const getMembersQuorum = (id:number) => {
    const {data,isLoading,isError} = useQuery<quorumtype>({
        queryKey: ["get-quorum-list-query"],
        queryFn: async () => {
            try {
                const response = await axios.get(`/api/v1/admin/event/${id}/member/quorum`);
                return response.data;
            } catch (e) {
                throw handleAxiosErrorMessage(e);
            }
        },
        refetchInterval: 1 * 30 * 1000
    });
    return {members:data,isLoading,isError}
};

export const useVoterAuthorizationAssist = ( eventId: number, voterId: string, onAuthorize: (voter: TMemberAttendeesMinimalInfo) => void) => {
    const { data: authenticatedVoter, isPending, mutate: getAuthorization, isError, error, } = useMutation< TMemberAttendeesMinimalInfo, string, z.infer<typeof voterVerificationFormSchema>>({
        mutationKey: ["authorize-voter", voterId],
        mutationFn: async (data) => {
            try {
                const request = await axios.post(
                    `/api/v1/admin/event/${eventId}/election/${eventId}/assist-authorize-voter`,
                    data,
                    { withCredentials: true }
                );
                onAuthorize(request.data);
                return request.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
    });

    return { authenticatedVoter, isPending, getAuthorization, isError, error };
};

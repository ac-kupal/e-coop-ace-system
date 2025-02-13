"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import MemberSearch from "@/components/member-search";
import MemberInfoDisplay from "../../../_components/member-info-display";

import RegisterAttendance from "./register-attendance";
import { useRegisterMember } from "@/hooks/public-api-hooks/use-member-api";
import { TEventWithElection, TMemberAttendeesMinimalInfo } from "@/types";
import LoadingSpinner from "@/components/loading-spinner";
import ErrorAlert from "@/components/error-alert/error-alert";

type Props = {
    eventId: number;
    event: TEventWithElection;
};

const Attendance = ({ eventId, event }: Props) => {
    const router = useRouter();
    const [member, setMember] = useState<TMemberAttendeesMinimalInfo | null>(
        null
    );

    const { registeredMember, register, isPending, error } = useRegisterMember(
        eventId,
        (member) => {
            router.push(
                `/events/${eventId}/register/registered?pb=${member.passbookNumber}&fullname=${`${member.firstName} ${member.lastName}`}&picture=${member.picture}`
            );
        }
    );

    if (!member)
        return (
            <MemberSearch
                eventId={eventId}
                onFound={(member) => {
                    setMember(member);
                    if (
                        !event.requireBirthdayVerification &&
                        !member.registered
                    ) {
                        register({ passbookNumber: member.passbookNumber });
                        return;
                    }
                }}
            />
        );

    return (
        <div className="flex flex-col px-8 gap-y-8 lg:gap-y-16 relative">
            <MemberInfoDisplay member={member} />
            <div className="flex px-2 flex-col items-center">
                {member.registered ? (
                    <Link className="mx-auto" href={`/events/${eventId}`}>
                        <Button>Go Back to Event</Button>
                    </Link>
                ) : (
                    event.requireBirthdayVerification && (
                        <RegisterAttendance eventId={eventId} member={member} />
                    )
                )}
                {!event.requireBirthdayVerification &&
                    !member.registered &&
                    isPending && (
                        <span>
                            <LoadingSpinner className="inline mr-2" />{" "}
                            Registering...
                        </span>
                    )}
                {registeredMember && (
                    <span>
                        <LoadingSpinner className="inline mr-2" />{" "}
                        Redirecting...
                    </span>
                )}
                {error && <ErrorAlert title="Register Error" message={error} />}
            </div>
        </div>
    );
};

export default Attendance;

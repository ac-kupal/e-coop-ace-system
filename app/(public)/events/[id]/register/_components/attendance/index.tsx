"use client";
import Link from "next/link";
import { useState } from "react";

import AttendeeSearch from "./attendee-search";
import { Button } from "@/components/ui/button";

import { TMemberAttendeesMinimalInfo } from "@/types";
import RegisterAttendance from "./register-attendance";
import MemberInfoDisplay from "../../../_components/member-info-display";

type Props = {
    eventId : number
};

const Attendance = ({ eventId }: Props) => {
    const [member, setMember] = useState<TMemberAttendeesMinimalInfo | null>(null);

    if (!member)
        return (
            <AttendeeSearch eventId={eventId} onFound={(member) => setMember(member)} />
        );

    return (
        <div className="flex flex-col px-8 gap-y-8 lg:gap-y-16">
            <MemberInfoDisplay member={member} />
            <div className="flex px-2 flex-col items-center">
                {member.registered ? (
                    <Link className="mx-auto" href={`/events/${eventId}`}>
                        <Button>Go Back to Event</Button>
                    </Link>
                ) : (
                    <RegisterAttendance eventId={eventId} member={member} />
                )}
            </div>
        </div>
    );
};

export default Attendance;

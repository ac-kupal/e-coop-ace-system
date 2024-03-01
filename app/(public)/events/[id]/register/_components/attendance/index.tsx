"use client";
import Link from "next/link";
import { useState } from "react";

import AttendeeSearch from "./attendee-search";
import { Button } from "@/components/ui/button";

import { TMemberAttendeesMinimalInfo } from "@/types";
import RegisterAttendance from "./register-attendance";
import MemberInfoDisplay from "../../../_components/member-info-display";

type Props = {
    params: { id: string };
};

const Attendance = ({ params }: Props) => {
    const [member, setMember] = useState<TMemberAttendeesMinimalInfo | null>(null);

    if (!member)
        return (
            <AttendeeSearch params={params} onFound={(member) => setMember(member)} />
        );

    return (
        <div className="flex flex-col gap-y-16">
            <MemberInfoDisplay member={member} />
            <div className="flex flex-col items-center">
                {member.registered ? (
                    <Link className="mx-auto" href={`/events/${params.id}`}>
                        <Button>Go Back to Event</Button>
                    </Link>
                ) : (
                    <RegisterAttendance eventId={params.id} member={member} />
                )}
            </div>
        </div>
    );
};

export default Attendance;

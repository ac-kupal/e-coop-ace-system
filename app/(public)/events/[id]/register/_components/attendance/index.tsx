"use client";
import Link from "next/link";
import { useState } from "react";

import AttendeeSearch from "./attendee-search";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";

import { TMemberAttendees } from "@/types";
import RegisterAttendance from "./register-attendance";

type Props = {
    params: { id: string };
};

const Attendance = ({ params }: Props) => {
    const [member, setMember] = useState<TMemberAttendees | null>(null);

    if (!member)
        return (
            <AttendeeSearch
                params={params}
                onFound={(member) => setMember(member)}
            />
        );

    return <div className="flex flex-col gap-y-16">
        <div className="flex flex-col lg:flex-row lg:items-center gap-y-8 lg:gap-x-4">
            <UserAvatar className="rounded-xl size-full lg:size-72" src={member.picture ?? "/images/default-avatar.png"} fallback={member.firstName} />
            <div className="space-y-4 text-xl p-4 lg:text-5xl">
                <p><span className="text-foreground/60 mr-6">Name :</span>{`${member.firstName} ${member.middleName} ${member.lastName}`}</p>
                <p><span className="text-foreground/60 mr-6">PB No &nbsp;:</span>{`${member.passbookNumber}`}</p>
                { member.registered && <p className="text-green-400">REGISTERED</p> }
            </div>
        </div>
        <div className="flex flex-col items-center">
            {
                member.registered ? 
                <Link className="mx-auto" href={`/events/${params.id}`}>
                    <Button>Go Back to Event</Button>
                </Link> 
                :
                <RegisterAttendance eventId={params.id} member={member} />
            }
        </div>
    </div>;
};

export default Attendance;

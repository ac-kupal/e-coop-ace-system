import axios from "axios";
import { toast } from "sonner";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { TMemberAttendees } from "@/types";
import { handleAxiosErrorMessage } from "@/utils";
import { validateBirthDay } from "@/validation-schema/attendee-search";
import { useRouter } from "next/navigation";

type Props = {
    eventId : string,
    member : TMemberAttendees
};

const RegisterAttendance = ({ eventId, member}: Props) => {
    const router = useRouter();
    const [bdate, setBdate] = useState("");

    const {
        isPending,
        mutate: register,
    } = useMutation<any, string>({
        mutationKey: ["member-search"],
        mutationFn: async () => {
            try {
                const validatedBirthdate = validateBirthDay.safeParse(bdate)

                if(!validatedBirthdate.success) {
                    toast.error(validatedBirthdate.error.issues[0].message)
                    return;
                }

                const request = await axios.post(
                    `/api/v1/event/${eventId}/register`,
                    { passbookNumber : member.passbookNumber, birthday : bdate }
                );

                toast.success("You have been registered to this event.")
                router.push(`/events/${eventId}/registered`)
            } catch (e) {
                toast.error(handleAxiosErrorMessage(e));
            }
        },
    });

    const disabled = isPending;

    return (
        <div className="flex flex-col items-center gap-y-4">
            <p>Please input your birth date so we can verify if it is you.</p>
            <div className="space-y-4 max-w-sm">
                <Input
                    disabled={disabled}
                    placeholder="MM/DD/YYYY"
                    value={bdate}
                    onChange={(e) => setBdate(e.target.value)}
                />
                <Button
                    disabled={disabled}
                    className="w-full"
                    onClick={() => register()}
                >
                    {false ? (
                        <Loader2
                            className="h-3 w-3 animate-spin"
                            strokeWidth={1}
                        />
                    ) : (
                        "Register"
                    )}
                </Button>
            </div>
        </div>
    );
};

export default RegisterAttendance;

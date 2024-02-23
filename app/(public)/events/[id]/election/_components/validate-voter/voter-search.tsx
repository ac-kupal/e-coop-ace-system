import axios from "axios";
import { toast } from "sonner";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import QrReader from "@/components/qr-reader/html5-qr-reader";

import { TMemberAttendees } from "@/types";
import { handleAxiosErrorMessage } from "@/utils";

type Props = {
    eventId: number;
    electionId: number;
    onFound: (voter: TMemberAttendees) => void;
};

const VoterSearch = ({ eventId, electionId, onFound }: Props) => {
    const [pb, setPb] = useState("");

    const {
        data,
        isPending,
        mutate: loadMember,
    } = useMutation<TMemberAttendees, string, string>({
        mutationKey: ["member-search"],
        mutationFn: async (passbookNumber) => {
            try {
                if (passbookNumber === null || passbookNumber.length === 0)
                    return;

                const request = await axios.get(
                '',
                // TODO : api here
                );
                onFound(request.data);
                return request.data;
            } catch (e) {
                toast.error(handleAxiosErrorMessage(e));
            }
        },
    });


    const disabled = isPending;

    return (
        <div className="flex flex-col items-center gap-y-4">
            <QrReader
                className="size-[400px] bg-background overflow-clip rounded-xl"
                disableFlip={false}
                fps={5}
                qrbox={800}
                onRead={(val: string) => {
                    setPb(val);
                    // todo onFound
                }}
            />
            <div className="flex items-center justify-center w-full overflow-clip gap-x-4">
                <Separator className="w-1/2" /> or{" "}
                <Separator className="w-1/2" />
            </div>
            <Input
                disabled={disabled}
                placeholder="Enter Passbook Number"
                value={pb}
                onChange={(e) => setPb(e.target.value)}
            />
            <Button
                disabled={disabled}
                className="w-full"
                onClick={() => {
                    /*TODO*/
                }}
            >
                {isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" strokeWidth={1} />
                ) : (
                    "Find"
                )}
            </Button>
        </div>
    );
};

export default VoterSearch;

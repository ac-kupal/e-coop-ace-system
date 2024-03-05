import { Separator } from "@/components/ui/separator";
import { Eye, RefreshCcw, RefreshCwOff, UnlockKeyhole } from "lucide-react";
import { Unlock } from "next/font/google";
import React from "react";

type Props = {};

const VoteReminder = (props: Props) => {
    return (
        <div className="flex flex-1 overflow-scroll max-h-[60vh] flex-col gap-y-4 items-center">
            <img
                alt="art"
                src="/images/reminder.png"
                className="object-cover size-60 rounded-xl"
            />
            <div className="flex flex-col gap-y-2">
                <div className="flex items-center gap-x-4">
                    <div className="p-2 bg-yellow-500 text-white rounded-lg">
                        <RefreshCwOff className="size-4" />
                    </div>
                    <p className="text-sm">
                        Avoid reloading the page while you vote. If you do, you
                        will lose your voting progress and have to start over
                        again.
                    </p>
                </div>
                <Separator />
                <div className="flex items-center gap-x-4">
                    <div className="p-2 bg-yellow-500 text-white rounded-lg">
                        <Eye className="size-4" />
                    </div>
                    <p className="text-sm">
                        Once you have submitted your votes, you cannot change
                        them, so review your choices carefully.
                    </p>
                </div>
                <Separator />

                <div className="flex items-center gap-x-4">
                    <div className="p-2 bg-yellow-500 text-white rounded-lg">
                        <UnlockKeyhole className="size-4" />
                    </div>
                    <p className="text-sm">
                        The end of the voting event will be under the control of
                        the admins, who will announce before closing the voting.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VoteReminder;

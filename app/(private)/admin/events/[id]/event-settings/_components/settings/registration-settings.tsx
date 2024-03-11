"use client";
import React from "react";

import SettingsCard from "./settings-card";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import { TEventSettings, TEventSettingsUpdate } from "@/types";
import { Check } from "lucide-react";
import LoadingSpinner from "@/components/loading-spinner";

type Props = {
    loading: boolean;
    eventSettings: TEventSettings;
    onUpdate: (update: TEventSettingsUpdate) => void;
};

const RegistrationSettings = ({loading, eventSettings, onUpdate }: Props) => {
    const handleToggle = (val: boolean) => onUpdate({ registrationOnEvent: val });

    return (
        <SettingsCard className="flex gap-y-4">
            <div className="flex flex-col gap-y-6 pb-4">
                <div className="flex justify-between items-center">
                    <p className="text-lg">Registration Configuration</p>
                    { loading && <LoadingSpinner strokeWidth={1} className="size-4" /> }
                </div>
                <p className="text-sm text-foreground/60">
                    Configure when the event will accept registration for event attendees
                </p>
                <Separator />
            </div>
            <div
                onClick={() => {
                    if (!loading && !eventSettings.registrationOnEvent) handleToggle(true);
                }}
                className={cn(
                    "flex cursor-pointer group bg-background/60 p-6 justify-between items-start lg:items-center duration-150 rounded-xl hover:bg-background border border-transparent",
                    eventSettings.registrationOnEvent &&
                    "pointer-events-none border border-teal-400/30",
                )}
            >
                <div className="flex flex-col gap-y-4">
                    <p>On event only</p>
                    <p className="text-sm text-foreground/60">
                        Allow registration only on the event day.
                    </p>
                </div>
                <div
                    className={cn(
                        "rounded-full p-2 bg-secondary/70 text-foreground/50 group-hover:bg-secondary duration-100",
                        eventSettings.registrationOnEvent &&
                        "pointer-events-none bg-green-400 text-white",
                    )}
                >
                    <Check className="size-4 lg:size-6" />
                </div>
            </div>
            <div
                onClick={() => {
                    if (!loading && eventSettings.registrationOnEvent) handleToggle(false);
                }}
                className={cn(
                    "flex cursor-pointer group bg-background/60 p-6 justify-between items-start lg:items-center duration-150 rounded-xl hover:bg-background border border-transparent",
                    !eventSettings.registrationOnEvent &&
                    "pointer-events-none border border-teal-400/30",
                )}
            >
                <div className="flex flex-col gap-y-4">
                    <p>Before event</p>
                    <p className="text-sm text-foreground/60">
                        Allow registration before and during the day of event.
                    </p>
                </div>
                <div
                    className={cn(
                        "rounded-full p-2 bg-secondary/70 text-foreground/50 group-hover:bg-secondary duration-100",
                        !eventSettings.registrationOnEvent &&
                        "pointer-events-none bg-green-400 text-white",
                    )}
                >
                    <Check className="size-4 lg:size-6" />
                </div>
            </div>
        </SettingsCard>
    );
};

export default RegistrationSettings;

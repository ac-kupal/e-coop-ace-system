"use client"
import React from "react";
import SettingsCard from "../settings-card";

import { Switch } from "@/components/ui/switch";
import LoadingSpinner from "@/components/loading-spinner";

import {
    useRegistrationSettings,
    useUpdateRegistrationSettings,
} from "@/hooks/api-hooks/settings-hooks";

type Props = { eventId: number };

const RegistrationSettings = ({ eventId }: Props) => {
    const { existingSettings, isLoading, isRefetching } = useRegistrationSettings(eventId);
    const { updateSettings, isPending } = useUpdateRegistrationSettings(eventId);

    const loading = isLoading || isRefetching || isPending;

    const handleToggle = (val : boolean) => { updateSettings({ registrationOnEvent: val }) }

    return (
        <SettingsCard className=" max-w-lg flex items-center gap-x-2 justify-between">
            <div className="flex flex-col gap-y-4 flex-1">
                <p className="font-medium">Registration Settings</p>
                <p className="text-sm">
                    { existingSettings.registrationOnEvent ? "Registration is on exact day of the event." : "Registration is allowed before and during event day." }
                </p>
            </div>
            {loading && <LoadingSpinner />}
            <Switch
                disabled={loading}
                checked={existingSettings.registrationOnEvent}
                onCheckedChange={handleToggle}
            />
        </SettingsCard>
    );
};

export default RegistrationSettings;

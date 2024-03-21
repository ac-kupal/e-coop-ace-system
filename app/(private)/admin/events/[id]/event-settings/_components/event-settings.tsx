
"use client"
import React from 'react'

import RegistrationSettings from './settings/registration-settings'

import { TEventSettingsUpdate } from "@/types"
import { useEventSettings, useUpdateEventSettings } from '@/hooks/api-hooks/settings-hooks'
import MemberSearchModeSettings from './settings/member-search-settings'

type Props = {
    eventId : number
}

const EventSettings = ({ eventId }: Props) => {
  const { isLoading, existingSettings } = useEventSettings( eventId );

  const { isPending, updateSettings } = useUpdateEventSettings( eventId );

  const onUpdate = (updates : TEventSettingsUpdate) => updateSettings(updates);

  const loading = isLoading || isPending ;

  return (
    <div className="p-4 space-y-8 ">
        <p className="text-xl font-medium ">Event Settings</p>
        <RegistrationSettings loading={loading} eventSettings={existingSettings} onUpdate={onUpdate} />
        <MemberSearchModeSettings loading={loading} eventSettings={existingSettings} onUpdate={onUpdate} />
    </div>
  )
}

export default EventSettings

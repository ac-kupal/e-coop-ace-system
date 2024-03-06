import React from 'react'
import RegistrationSettings from './settings/registration-settings'

type Props = {
    eventId : number
}

const EventSettings = ({ eventId }: Props) => {
  return (
    <div className="p-4 space-y-4">
        <p className="text-xl font-medium ">Event Settings</p>
        <RegistrationSettings eventId={eventId} />
    </div>
  )
}

export default EventSettings
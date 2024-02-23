import UserAvatar from '@/components/user-avatar'
import { TMemberAttendees } from '@/types'
import React from 'react'

type Props = {
    member : TMemberAttendees
}

const MemberInfoDisplay = ({ member }: Props) => {
  return (
        <div className="flex flex-col lg:flex-row lg:items-center gap-y-8 lg:gap-x-4">
            <UserAvatar className="rounded-xl size-full lg:size-72" src={member.picture ?? "/images/default-avatar.png"} fallback={member.firstName} />
            <div className="space-y-4 text-xl p-4 lg:text-5xl">
                <p><span className="text-foreground/60 mr-6">Name :</span>{`${member.firstName} ${member.middleName} ${member.lastName}`}</p>
                <p><span className="text-foreground/60 mr-6">PB No &nbsp;:</span>{`${member.passbookNumber}`}</p>
                { member.registered && <p className="text-green-400">REGISTERED</p> }
            </div>
        </div>
  )
}

export default MemberInfoDisplay

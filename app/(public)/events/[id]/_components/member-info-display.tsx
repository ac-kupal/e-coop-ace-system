import UserAvatar from '@/components/user-avatar'
import { TMemberAttendeesMinimalInfo } from '@/types'
import React from 'react'

type Props = {
    member : TMemberAttendeesMinimalInfo
}

const MemberInfoDisplay = ({ member }: Props) => {
  return (
        <div className="flex flex-col items-center lg:flex-row lg:items-center gap-y-1 lg:gap-y-8 lg:gap-x-4">
            <UserAvatar className="rounded-xl size-32 lg:size-72" src={member.picture ?? "/images/default-avatar.png"} fallback={member.firstName} />
            <div className="sapce-y-2 md:space-y-4 text-lg md:text-xl p-4 lg:text-5xl">
                <p><span className="text-foreground/60 mr-6">Name :</span>{`${member.firstName} ${member.middleName} ${member.lastName}`}</p>
                <p><span className="text-foreground/60 mr-6">PB No &nbsp;:</span>{`${member.passbookNumber}`}</p>
                <div className="flex items-center gap-x-2">
                    { member.registered && <p className="text-green-400">REGISTERED</p> }
                    { member.voted && <p className="text-green-400">{ member.voted && <span className="text-foreground">&</span>} VOTED</p> }
                </div>
            </div>
        </div>
  )
}

export default MemberInfoDisplay

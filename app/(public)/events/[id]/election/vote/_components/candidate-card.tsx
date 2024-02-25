import UserAvatar from '@/components/user-avatar'
import { cn } from '@/lib/utils'
import { TCandidatewithPosition } from '@/types'
import React from 'react'

type Props = { candidate : TCandidatewithPosition }

const CandidateCard = ({ candidate }: Props) => {
 
  const { firstName, lastName, picture } = candidate;

  return (
    <div className={cn("p-4 w-1/4 space-y-4")}>
            <div className={cn("border-secondary rounded-2xl ease-in duration-300 overflow-clip border-4 hover:border-green-400")}>
                <img className="h-[200px] w-[300px] rounded-none object-cover" src={picture ?? "/images/default-avatar.png"}  />
            </div>
            <p className="text-xl font-medium">{`${firstName} ${lastName}`}</p>
        </div>
  )
}

export default CandidateCard

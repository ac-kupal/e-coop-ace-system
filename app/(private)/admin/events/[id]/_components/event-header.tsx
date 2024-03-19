"use client"
import { TEventWithElection } from '@/types'
import { usePathname } from 'next/navigation';
import React from 'react'



const EventHeader = () => {
  const pathname = usePathname();
  const isCurrentPathElection = pathname.includes("election");
  return (
    <div>
           <h1 className="font-bold text-[min(20px,3vw)]">Manage {isCurrentPathElection ? "Election":"Event"}</h1>   
    </div>
  )
}

export default EventHeader
import { cookies } from 'next/headers'
import React from 'react'

type Props = {}

const VotePage = async (props: Props) => {
  
  console.log(cookies().get("v-auth"))

  return (
        <div className="flex flex-col py-20 px-5 gap-y-6 min-h-screen w-full items-center">
            <p className="text-2xl lg:text-4xl uppercase text-center">{election.electionName}</p>
            <div className="w-5 h-2 bg-orange-400 rounded-full"/>
            <div className="py-16">
            </div>
        </div>
  )
}

export default VotePage

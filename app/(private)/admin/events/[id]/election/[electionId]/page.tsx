import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    params : { 
        id : number,
        electionId : number
    }
}

const ElectionPage = ({ params }: Props) => {
  
    redirect(`/admin/events/${params.id}/election/${params.electionId}/dashboard`)
}

export default ElectionPage
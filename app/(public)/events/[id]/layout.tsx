import React from 'react'
import EventsNav from './_components/events-nav'

type Props = { children : React.ReactNode,  params : { id : number }}

const layout = ( { params, children }: Props) => {

  return (
    <>
        <EventsNav eventId={params.id} />
        {children}
    </>
  )
}

export default layout
import React from 'react'
import Link from 'next/link'

type Props = {
    routeName : string,
    path : string
}

const RouteItem = ({ routeName, path } : Props) => {
  return (
    <Link href={ path } className="duration-200 text-foreground">{routeName}</Link>
  )
}

export default RouteItem
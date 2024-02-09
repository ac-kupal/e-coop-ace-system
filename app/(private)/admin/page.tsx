"use client"

import { useSession } from "next-auth/react"

type Props = {}

const AdminPage = (props: Props) => {
    const sess = useSession()

    console.log(sess.data?.user)

  return (
    <div>Dashboard</div>
  )
}

export default AdminPage
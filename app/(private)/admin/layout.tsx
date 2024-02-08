import { ReactNode } from 'react'

type Props = { children? : ReactNode}

const AdminLayout = ( { children } : Props ) => {
  return (
    <main>
        { children }
    </main>
  )
}

export default AdminLayout
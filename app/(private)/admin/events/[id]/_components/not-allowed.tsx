import { ShieldAlert } from 'lucide-react'
import React from 'react'

const NotAllowed = () => {
  return (
          <div className='w-full h-screen flex justify-center items-center'>
          <div className='flex flex-col items-center gap-2'>
          <ShieldAlert className=' text-muted-foreground w-12 h-auto' />
           You are not allowed here!
          </div>
     </div>
  )
}

export default NotAllowed
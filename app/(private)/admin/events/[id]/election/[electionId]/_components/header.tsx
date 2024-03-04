import React from 'react'


type Props = {
   text:string
}

const Header = ({text}:Props) => {
  return (
    <div className='w-full p-2'>
     <h1 className=' font-medium text-2xl'>{text}</h1>
    </div>
  )
}

export default Header
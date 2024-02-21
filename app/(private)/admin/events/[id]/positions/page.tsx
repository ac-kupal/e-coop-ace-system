import React from 'react'
import PositionTable from './_components/position-table'
import { TPosition } from '@/types';
import axios from 'axios';
import { mutationErrorHandler } from '@/errors/mutation-error-handler';
import { useQuery } from '@tanstack/react-query';

const PositionPage = ({params}:{params:{id:number}}) => {

  return (
    <div className='p-5'>
      <PositionTable id={params.id}></PositionTable>
    </div>
  )
}    

export default PositionPage
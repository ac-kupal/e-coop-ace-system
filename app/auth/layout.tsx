export const dynamic = 'force-dynamic'

import React, { ReactNode } from 'react'
import { INIT_ROOT_ACCOUNT } from '@/services/initialize-default'
import { hasRoot } from '@/services/user'

type Props = { children? : ReactNode}

const AuthLayout = async (props: Props) => {
  const doesRootExist = await hasRoot();
  
  if(!doesRootExist) await INIT_ROOT_ACCOUNT();

  return (
    <>{props.children}</>
  )
}

export default AuthLayout
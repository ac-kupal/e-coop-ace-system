import { redirect } from 'next/navigation'

type Props = { params : { id : number }};

const IncentivePage = ({ params } : Props) => {

    console.log('yes')
    
    redirect(`/admin/events/${params.id}/incentive/incentives`)
}

export default IncentivePage
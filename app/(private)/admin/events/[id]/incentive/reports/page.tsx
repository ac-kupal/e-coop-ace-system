import React from 'react'

import ReportHome from './_components/report-home';

import { eventIdSchema } from '@/validation-schema/commons';

type Props = { params : { id : number } }

const IncentiveReportPage = ({ params }: Props) => {

    const eventId = eventIdSchema.parse(params.id);

    return (
        <div className="flex px-4 min-h-screen flex-col w-full">
            <ReportHome eventId={eventId} />
        </div>
    );
}

export default IncentiveReportPage

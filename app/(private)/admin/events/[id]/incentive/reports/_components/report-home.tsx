"use client";
import React, { useRef, useState } from "react";

import { FaFilter } from "react-icons/fa";
import { GrRotateRight } from "react-icons/gr";

import { SiMicrosoftexcel } from "react-icons/si";

import { Button } from "@/components/ui/button";
import FilterModal from "./modals/filter-modal";
import { useClaimReports } from "@/hooks/api-hooks/claim-report-api-hook";
import { Table } from "@/components/ui/table";
import UserReportTable from "./user-report-table";
import LoadingSpinner from "@/components/loading-spinner";
import { cn } from "@/lib/utils";

type Props = { eventId: number };

const tableToExcel = (table: HTMLDivElement, name: string) => {
    const uri = "data:application/vnd.ms-excel;base64,";
    const template =
        '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
    const base64 = (s: string) => window.btoa(unescape(encodeURIComponent(s)));
    const format = (s: string, c: Record<string, string>) =>
        s.replace(/{(\w+)}/g, (m, p) => c[p]);

    const ctx = { worksheet: name || "Worksheet", table: table.innerHTML };
    const excelContent = uri + base64(format(template, ctx));

    const link = document.createElement("a");
    link.href = excelContent;

    link.setAttribute("download", name || "table.xls");

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
};

const ReportHome = ({ eventId }: Props) => {
    const [filter, setFilter] = useState(false);
    const [ids, setIds] = useState<number[]>([]);
    const reportRef = useRef<HTMLTableElement | null>(null);

    const { reports, isLoading, isRefetching, refetch } = useClaimReports(
        eventId,
        ids,
    );

    const exportToExcel = () => {
        if (reportRef.current) {
            tableToExcel(reportRef.current, `event-${eventId}-claim-report`);
        }
    };

    const loading = isLoading || isRefetching;

    return (
        <div className="flex flex-col gap-y-2 p-4">
            <FilterModal
                state={filter}
                onClose={(state) => setFilter(state)}
                selectedIds={ids}
                setIds={(ids) => setIds(ids)}
            />
            <div className="flex gap-x-2 justify-end">
                <Button
                    variant={"secondary"}
                    onClick={() => refetch()}
                    className="gap-x-2"
                    size="icon"
                >
                    <GrRotateRight className="size-4" />
                </Button>
                <Button
                    variant={"secondary"}
                    onClick={() => setFilter(!filter)}
                    className="gap-x-2"
                >
                    <FaFilter className="size-4" /> Filter
                </Button>
                <Button onClick={() => exportToExcel()} className="gap-x-2">
                    <SiMicrosoftexcel className="size-4" /> Export
                </Button>
            </div>
            {loading ? (
                <div className="min-h-[60dvh] flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            ) : (
                <Table ref={reportRef} className="">
                    {reports.map((userReport) => (
                        <UserReportTable
                            eventId={eventId}
                            key={userReport.user.id}
                            UserReport={userReport}
                        />
                    ))}
                </Table>
            )}
        </div>
    );
};

export default ReportHome;

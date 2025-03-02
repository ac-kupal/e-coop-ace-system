import { toast } from "sonner";
import { useState } from "react";
import { FaFileZipper as ZipFileIcon } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import ModalHead from "@/components/modals/modal-head";
import LoadingSpinner from "@/components/loading-spinner";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { useEventQrPbExport } from "@/hooks/api-hooks/use-qr-pb-export";

interface IMember {
    passbookNumber: string;
}

interface generateQrModalProps {
    eventId: number;
    members: IMember[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const chunkArray = <T,>(array: T[], size: number): T[][] => {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
        array.slice(i * size, i * size + size)
    );
};

const downloadExternalURL = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `QR_Passbooks.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Download started");
};

const DownloadChunk = ({
    index,
    chunk,
    eventId,
    blocked = true,
    onComplete,
    onGenerating,
}: {
    index: number;
    eventId: number;
    chunk: string[];
    blocked?: boolean;
    onGenerating?: () => void;
    onComplete?: () => void;
}) => {
    const {
        data,
        refetch: generateQr,
        isFetching,
    } = useEventQrPbExport({
        eventId,
        batchId: index,
        passbookNumbers: chunk,
        options: {
            showPbNumberText: true,
        },
        enable: false,
        onSuccess: (data) => {
            if (!data?.url) {
                toast.error("Failed to retrieve download URL");
                return;
            }
            downloadExternalURL(data.url);
        },
        onError: (error) => {
            toast.error(`Export failed: ${error}`);
        },
    });

    const handleExport = (index: number) => {
        onGenerating?.();
        toast.promise(generateQr(), {
            loading: `Generating Batch ${index + 1} QR codes, this may take a while please wait...`,
            success: () => {
                onComplete?.();
                return `Batch ${index + 1} has generated & now downloading`;
            },
            error: "Error",
        });
    };

    return (
        <div className="flex justify-between rounded-lg bg-popover px-4 py-2 items-center gap-x-4">
            <p className="">
                <ZipFileIcon className="inline mr-2 text-orange-400 dark:text-amber-200 " />
                QRCode Batch {index + 1} zip ({chunk.length})
            </p>
            <div className="flex items-center gap-x-2">
                {data?.url && !isFetching && (
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleExport(index)}
                        disabled={isFetching || blocked}
                    >
                        {isFetching ? <LoadingSpinner /> : "Regenerate"}
                    </Button>
                )}
                <Button
                    size="sm"
                    variant="ghost"
                    className="border"
                    onClick={() => {
                        if (data?.url) return downloadExternalURL(data.url);
                        handleExport(index);
                    }}
                    disabled={isFetching || blocked}
                >
                    {isFetching ? <LoadingSpinner /> : "Export"}
                </Button>
            </div>
        </div>
    );
};

export const BulkExportPbQrModal = ({
    eventId,
    members,
    open,
    onOpenChange,
}: generateQrModalProps) => {
    const [pendingExport, setPendingExport] = useState<number[]>([]);
    const chunks = chunkArray(
        members.map((m) => m.passbookNumber),
        500
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-none shadow-2 sm:rounded-2xl overflow-y-auto thin-scroll max-w-xl max-h-[80vh]  font-inter">
                <ModalHead
                    title="Export member PB QR Codes"
                    description="Export QR codes for the current event's members. To prevent server overload, members are processed in batches of 500 QR codes per generation."
                />
                <div className="grid grid-cols-1 gap-2">
                    {chunks.map((chunk, index) => (
                        <DownloadChunk
                            key={index}
                            index={index}
                            chunk={chunk}
                            eventId={eventId}
                            onGenerating={() => {
                                setPendingExport((prev) => [...prev, index]);
                                toast.info(
                                    "Maximum pending generation is 3, please wait for other to finish.."
                                );
                            }}
                            onComplete={() =>
                                setPendingExport((prev) =>
                                    prev.filter((val) => val !== index)
                                )
                            }
                            blocked={
                                pendingExport.length >= 2 &&
                                !pendingExport.includes(index)
                            }
                        />
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BulkExportPbQrModal;

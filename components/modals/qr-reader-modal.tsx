"use client"
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import QrReader from "../qr-reader";
import { useQrReaderModal } from "@/stores/use-qr-scanner";

const QrReaderModal = () => {
    const { isOpen, onClose, onRead } = useQrReaderModal();

    return (
        <Dialog open={ isOpen } onOpenChange={ onClose }>
            <DialogContent className="border-none shadow-2 sm:rounded-2xl font-inter">
                <div className="p-4">
                    <QrReader onRead={onRead} qrReaderOption="HTML5QrScanner" />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default QrReaderModal;

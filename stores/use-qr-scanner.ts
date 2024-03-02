import { create } from "zustand";

interface IQRScannerDatas{
    onRead : (value : string) => void
}

interface IQRModalStore {
    isOpen: boolean;
    scannerDatas?: IQRScannerDatas;

    onClose : () => void;
    onOpenQR: (infoData: IQRScannerDatas) => void;
    onRead: (data : string) => void;
}

export const useQrReaderModal = create<IQRModalStore>((set) => ({
    isOpen: false,
    onOpenQR: (scannerDatas) => set({
            isOpen: true,
            scannerDatas
        }),
    onClose : () => set({ isOpen : false }),
    onRead : (data : string) => {
        if(data.length === 0) return;
        set(({ scannerDatas }) => {
            if(scannerDatas?.onRead) scannerDatas.onRead(data)
            return { isOpen : false }
        })
    }
        
}));

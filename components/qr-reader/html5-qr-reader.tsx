"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const qrcodeRegionId = "html5qr-code-full-region";

type Props = {
    className?: string;
    onRead: (data: string) => void;
    onErr?: undefined | ((e: unknown) => void);

    fps: number;
    qrbox: number | 250;
    disableFlip: boolean;
};

const QrReader = ({
    className,
    fps,
    qrbox,
    disableFlip,
    onRead,
    onErr,
}: Props) => {
    const ref = useRef<Html5QrcodeScanner | null>(null);
    const qrSound = new Audio("/sounds/qrcode-beep.mp3")

    useEffect(() => {
        if (!ref.current) {
            ref.current = new Html5QrcodeScanner(
                qrcodeRegionId,
                { fps, qrbox, disableFlip },
                false
            );
        }

        const html5QrcodeScanner = ref.current;

        setTimeout(() => {
            const container = document.getElementById(qrcodeRegionId);
            if (html5QrcodeScanner && container?.innerHTML == "") {
                html5QrcodeScanner.render((data)=>{
                    qrSound.play();
                    onRead(data)
                }, onErr);
            }
        }, 0);

        // cleanup function when component will unmount
        return () => {
            html5QrcodeScanner.clear();
        };
    }, []);

    return (
        <div className={cn("flex flex-col", className)}>
            <div
                id={qrcodeRegionId}
                className="flex flex-col items-center"
            />
        </div>
    );
};

export default QrReader;

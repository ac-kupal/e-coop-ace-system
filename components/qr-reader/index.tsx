"use client";
import useLimiter from "@/hooks/use-limiter";
import React, { useEffect, useState } from "react";

import Html5QRScanner from "./Html5QRScanner";

import { cn } from "@/lib/utils";

type Props = {
    className?: string;
    onRead: (value: string) => void;
    qrReaderOption: "HTML5QrScanner";
};

const QrReader = ({ className, onRead, qrReaderOption }: Props) => {
    const [readValue, setReadValue] = useState<string>("");
    const finalValue = useLimiter(readValue, 500);

    useEffect(() => {
        onRead(finalValue);
        const qrSound = new Audio("/sounds/qrcode-beep.mp3");
        if (qrSound) qrSound.play();
    }, [finalValue]);

    if (qrReaderOption !== "HTML5QrScanner") throw new Error("You cant choose other qr code scanner yet. only HTML5QrScanner");

    return (
        <Html5QRScanner
            className={cn("", className)}
            onRead={(data) => {
                setReadValue(data);
            }}
        />
    );
};

export default QrReader;

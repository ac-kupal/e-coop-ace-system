"use client";
import useLimiter from "@/hooks/user-limiter";
import React, { useEffect, useState } from "react";

import Html5QRScanner from "./Html5QRScanner";
import ReactQrCodeReader from "./react-qrcode-reader";

import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  onRead: (value: string) => void;
  qrReaderOption: "HTML5QrScanner" | "ReactQrCodeReader";
};

const QrReader = ({ className, onRead, qrReaderOption }: Props) => {
  const [readValue, setReadValue] = useState<string>("");
  const finalValue = useLimiter(readValue, 500);

  useEffect(() => {
    onRead(finalValue);
    const qrSound = new Audio("/sounds/qrcode-beep.mp3");
    if (qrSound) qrSound.play();
  }, [finalValue]);

  return (
    <>
      {qrReaderOption === "HTML5QrScanner" && (
        <Html5QRScanner
          className={cn("", className)}
          onRead={(data) => { setReadValue(data) }}
        />
      )}
      {qrReaderOption === "ReactQrCodeReader" && (
        <ReactQrCodeReader
          className={cn("", className)}
          onRead={(data) => setReadValue(data)}
        />
      )}
    </>
  );
};

export default QrReader;

"use client";
import React, { useState } from "react";

import QrCode from "@/components/qr-code";
import { Input } from "@/components/ui/input";

import useLimiter from "@/hooks/use-limiter";

const QrGen = () => {
  const [data, setData] = useState("");

  const value = useLimiter(data, 200)

  return (
    <div className="flex bg-background/70 rounded-xl p-4 flex-col items-center gap-y-4  w-fit flex-1 py-16">
      <p className="text-2xl text-foreground/80 lg:text-4xl">Generate QR Code</p>
      <QrCode value={value} className="size-[200px] lg:size-[400px]" showDownload />
      <div className="flex flex-col items-center gap-y-2">
        <p className="text-foreground/70">You can generate your own QRCode here</p>
        <Input
          placeholder="input pbnumber, otp etc..."
          className="w-fit py-8 text-base lg:text-lg outline-none border-0 focus-visible:ring-transparent border-foreground focus:ring-offset-0 border-b-2"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
      </div>
    </div>
  );
};

export default QrGen;

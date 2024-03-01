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
      <div className="flex flex-col items-center gap-y-8 pb-4">
        <Input
          placeholder="Input value here"
          className="w-fit py-8 text-lg text-center bg-transparent lg:text-2xl outline-none border-0 focus-visible:ring-transparent border-foreground focus:ring-offset-0 border-b-2"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
        <p className="text-foreground/70 max-w-sm text-sm text-center">You can generate your own QRCode here such as your passbook number</p>
      </div>
    </div>
  );
};

export default QrGen;

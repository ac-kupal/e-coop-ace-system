import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import * as htmlToImage from "html-to-image";

import { cn } from "@/lib/utils";
import { Download, QrCodeIcon } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

type Props = {
    className?: string;
    value: string;
    themeResponsive?: boolean;

    showDownload?: boolean;
};

const QrCode = ({
    value,
    className,
    themeResponsive = false,
    showDownload = false,
}: Props) => {
    const qrRef = useRef<HTMLDivElement>(null);

    const downloadQRCode = () => {
        if (!qrRef.current) return;

        htmlToImage
            .toJpeg(qrRef.current, { quality: 0.95 })
            .then(function(dataUrl) {
                var link = document.createElement("a");
                link.download = `${value}.jpeg`;
                link.href = dataUrl;
                link.click();
                toast.success("QR Code downloaded");
            })
            .catch(function(error) {
                toast.error("Could not generated QR Code");
            });
    };

    return (
        <div className="flex flex-col gap-y-4">
            <div
                ref={qrRef}
                className={cn(
                    "size-[300px] flex flex-col justify-center items-center p-5 rounded-xl bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-background dark:from-stone-400 to-[#f5f1fd] drop-shadow-xl border-secondary",
                    !themeResponsive && "bg-white",
                    className,
                )}
            >
                {value.length === 0 ? (
                    <div className="flex flex-col items-center gap-y-4  text-gray-700/70">
                        <QrCodeIcon className="size-16" />
                        <p className="text-sm text-center lg:text-lg">
                            Enter value to generate
                        </p>
                    </div>
                ) : (
                    <QRCodeSVG
                        value={value}
                        className="h-full duration-300 w-full rounded-sm "
                        bgColor={themeResponsive ? "transparent" : "transparent"}
                        fgColor={themeResponsive ? "currentColor" : "black"}
                        level={"L"}
                        includeMargin={false}
                    />
                )}
            </div>
            {showDownload && (
                <Button
                    onClick={downloadQRCode}
                    disabled={!value || value.length === 0}
                    className="gap-x-2 rounded-full"
                >
                    <Download className="size-4" strokeWidth={1} /> Download QR
                </Button>
            )}
        </div>
    );
};

export default QrCode;

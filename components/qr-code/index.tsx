import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Props = {
    className?: string;
    value: string;
    themeResponsive?: boolean;
};

const QrCode = ({ value, className, themeResponsive = false }: Props) => {
    return (
        <div
            className={cn(
                "h-[300px] w-[300px] flex justify-center items-center p-5 rounded-xl bg-background drop-shadow-xl border-secondary",
                !themeResponsive && "bg-white",
                className
            )}
        >
            {!value || value.length === 0 ? (
                <Loader2 className="size-8 text-gray-800 animate-spin" strokeWidth={1} />
            ) : (
                <QRCodeSVG
                    value={value}
                    className={cn(
                        "h-full duration-300 w-full rounded-sm ",
                        className
                    )}
                    bgColor={themeResponsive ? "transparent" : "white"}
                    fgColor={themeResponsive ? "currentColor" : "black"}
                    level={"L"}
                    includeMargin={false}
                />
            )}
        </div>
    );
};

export default QrCode;

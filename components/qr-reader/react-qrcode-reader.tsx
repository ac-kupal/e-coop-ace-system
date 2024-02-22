import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { QrReader, QrReaderViewFinder } from "reactjs-qr-code-reader";

type Props = {
    onRead: (data: string) => void;
    onErr?: undefined | ((e: unknown) => void);
    className?: string;
};

const ReactQrCodeReader = ({ onRead, onErr, className }: Props) => {
    const [read, setRead] = useState(true);

    useEffect(() => {
        setRead(true)
        return () => {
            setRead(false);
        };
    }, []);
    return (
        <div>
            <QrReader
                read={read}
                onRead={(result) => onRead(result.getText())}
                onError={onErr}
                className={cn("rounded-xl", className)}
            >
                <QrReaderViewFinder color="currentColor" />
            </QrReader>
        </div>
    );
};

export default ReactQrCodeReader;

"use client"
import React from "react";
import CopyUrl from "./copy-url";

import QrCode from "@/components/qr-code";

import { TEvent } from "@/types";
import useOrigin from "@/hooks/use-origin";

type Props = {
    Event: TEvent;
};

const DisplayEventQRLink = ({ Event }: Props) => {
    const { origin } = useOrigin();

    const url = origin.length === 0 ? "" : `${origin}/events/${Event.id}/register`;

    return (
        <div className="flex gap-y-4 flex-col items-center pt-6">
            <p className="text-foreground/80 text-sm">Share registration for this event</p>
            <QrCode themeResponsive={false} value={url}/>
            { url.length > 0 && (
                <CopyUrl url={url} />
            )}
        </div>
    );
};

export default DisplayEventQRLink;

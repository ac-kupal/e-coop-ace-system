"use client";
import React from "react";

import { IScannerProps, Scanner } from "@yudiel/react-qr-scanner";

interface Props extends IScannerProps {}

const QrReader = (props: Props) => {
    return <Scanner {...props} />;
};

export default QrReader;

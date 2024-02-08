import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import QueryClientProviderWrapper from "@/providers/query-client-provider-wrapper";

const inter = Inter({ subsets: ["latin"] , variable : "--font-inter"});

export const metadata: Metadata = {
    title: "ACE System",
    description: "Attendance Capturing and Election System",
};

export default function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {
    return (
        <html lang="en">
            <body className={inter.variable}>
                <QueryClientProviderWrapper>
                    <div className="font-inter">{children}</div>
                </QueryClientProviderWrapper>
            </body>
        </html>
    );
}

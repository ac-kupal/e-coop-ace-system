import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider"
import QueryClientProviderWrapper from "@/providers/query-client-provider-wrapper";
import ConfirmModalProvider from "@/providers/confirm-modal-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] , variable : "--font-inter"});

export const metadata: Metadata = {
    title: "ACE System",
    description: "Attendance Capturing and Election System",
};

export default function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable}`}>
                <QueryClientProviderWrapper>
                    <ThemeProvider
                     attribute="class"
                     defaultTheme="system"
                     enableSystem
                    >   
                        <ConfirmModalProvider />
                        <Toaster richColors closeButton />
                        <div className="font-inter">{children}</div>
                    </ThemeProvider>
                </QueryClientProviderWrapper>
            </body>
        </html>
    );
}

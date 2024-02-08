import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "First Time Setup",
    description: "Setup A Root Account",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className={"flex flex-col items-center justify-center min-h-screen w-screen"}>
            {children}
        </main>
    );
}

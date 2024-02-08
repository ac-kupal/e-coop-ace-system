import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center">
            <div className="relative z-10 max-w-5xl gap-y-4 w-full items-center justify-center flex flex-col text-sm ">
                <h1 className="text-5xl text-center">ACE SYSTEM</h1>
                <p>Attendance Capturing & Election System</p>

                <Link href="/events">
                    <Button>Go to Events</Button>
                </Link>
                <Link href="/admin">
                    <Button>Go to Admin</Button>
                </Link>
            </div>
            <Image
                width={200}
                height={400}
                alt="ACE LOGO"
                className="blur-xl z-0 animate-spin absolute top-1/2"
                src="/images/default.png"
            />
        </main>
    );
}

import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center">
            <div className="relative z-10 max-w-5xl gap-y-4 w-full items-center justify-center flex flex-col text-sm ">
                <h1 className="text-5xl text-center">ACE SYSTEM</h1>
                <p>Attendance Capturing & Election System</p>

                <div className="flex justif-center gap-x-4 items-center">
                    <Link href="/events">
                        <Button>Go to Events</Button>
                    </Link>
                    <Separator className="h-7 bg-foreground/60" orientation="vertical"/>
                    <Link href="/admin">
                        <Button>Go to Admin</Button>
                    </Link>
                </div>
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

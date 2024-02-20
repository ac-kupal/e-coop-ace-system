import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

type Props = {
    params: { id: string };
};

const ElectionPage = ({ params }: Props) => {
    return (
        <div className="flex flex-col lg:flex-row min-h-screen w-full">
            <div className="w-full flex flex-col gap-y-16 bg-background px-8 py-16 lg:w-1/2">
                <img
                    src="https://marketplace.canva.com/EAFJMl8KcjI/1/0/1131w/canva-purple-black-tropical-party-club-poster-orVwDS2lrfY.jpg"
                    alt="event cover image"
                    className="rounded-xl h-[33rem] w-full object-cover"
                />
                <div className="px-0 lg:px-24 flex flex-col gap-y-8">
                    <div className="flex gap-x-4">
                        <Button className="bg-gradient-to-tr from-[#9175DF] rounded-lg w-full to-[#BA7D81] hover:from-[#7f68c0] hover:to-[#8d6265] text-xl">
                            <Link href={`/events/${params.id}/register`}>
                                Register
                            </Link>
                        </Button>
                        <Button className="bg-[#00C667] w-full text-xl">
                            <Link href={`/events/election/${params.id}`}>
                                Vote
                            </Link>
                        </Button>
                    </div>
                    <div className="flex gap-x-4 items-center">
                        <div className="w-8 h-2 rounded-full bg-orange-500" />  
                        <p className="text-2xl lg:text-4xl">
                            2021 GENERAL ASSEMBLY ELECTION
                        </p>
                    </div>
                </div>
            </div>
            <div className="w-full p-8 lg:w-1/2 flex flex-col items-center justify-center">
                <div className="flex flex-col gap-y-8 lg:gap-y-16 text-lg lg:text-2xl">
                    <div className="flex gap-x-4 items-center">
                        <div className="w-5 h-2 rounded-full bg-orange-500" />
                        <p>Register to capture attendance</p>
                    </div>
                    <div className="flex gap-x-4 items-center">
                        <div className="w-5 h-2 rounded-full bg-orange-500" />
                        <p>Once registered, you can attend the event</p>
                    </div>
                    <div className="flex gap-x-4 items-center">
                        <div className="w-5 h-2 rounded-full bg-orange-500" />
                        <p>Claim event incentives/give aways</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ElectionPage;

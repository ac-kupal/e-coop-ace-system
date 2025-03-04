import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, MapPin } from "lucide-react";
import { motion, Variants } from "framer-motion";

import { Button } from "@/components/ui/button";

import { TEvent } from "@/types";
import { cn } from "@/lib/utils";

type Props = {
    event: TEvent;
    className?: string;
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.2,
            bounce: 0.8,
        },
    },
};

const innerCardVariant: Variants = {
    initial: {},
    hover: {
        scale: 1.02,
        transition: {
            duration: 0.2,
            ease: "easeIn",
            y : 10
        },
    },
};

const EventCard = ({ className, event }: Props) => {
    return (
        <motion.div variants={cardVariants}>
            <motion.div
                variants={innerCardVariant}
                initial="initial"
                whileHover="hover"
                className={cn(
                    "relative overflow-clip min-h-[500px] rounded-xl flex flex-col gap-y-4",
                    className
                )}
            >
                <img
                    alt="Event Cover"
                    src={event.coverImage as ""}
                    className="absolute z-0 top-0 object-cover left-0 rounded-xl w-full h-full"
                />
                <div className="flex-auto" />
                <div className="p-5 bg-popover/80 flex z-40 backdrop-blur-lg relative max-w-full flex-col w-full gap-y-4">
                    <h1 className="text-xl md:text-2xl max-w-full whitespace-nowrap overflow-hidden text-ellipsis dark:text-[#e7e0fb]">
                        {event.title}
                    </h1>
                    <p className="text-foreground/80">{event.description}</p>

                    <motion.div className="flex flex-col gap-y-2">
                        <p className="px-4 py-1 inline-flex items-center gap-x-4 rounded-full bg-secondary text-sm w-fit">
                            <Calendar className="size-4" strokeWidth={1} />
                            {format(event.date, "EEE, MMM dd, yyyy")}
                        </p>

                        <p className="px-4 py-1 inline-flex items-center gap-x-4 rounded-full bg-secondary text-sm w-fit">
                            <MapPin className="size-4" strokeWidth={1} />
                            {event.location}
                        </p>
                    </motion.div>
                    <motion.a
                        href={`/events/${event.id}`}
                        className="w-full md:w-fit"
                    >
                        <Button className="bg-gradient-to-r from-[#dce2d9] w-full md:w-fit to-[#7fbeed] hover:to-[#d8bce8] text-black/80 hover:text-black rounded-xl px-8 py-4">
                            Go to Event
                        </Button>
                    </motion.a>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default EventCard;

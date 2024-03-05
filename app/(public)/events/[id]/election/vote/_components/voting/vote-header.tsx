import { cn } from "@/lib/utils";
import { TPosition } from "@/types";

type Props = {
    position: TPosition;
    selected: number;
};

const VoteHeader = ({ position, selected }: Props) => {
    const { positionName, numberOfSelection } = position;

    return (
        <div className="flex justify-between w-full px-8 lg:px-0 items-center">
            <div className="space-y-1 lg:space-y-2">
                <p className="text-lg font-medium lg:text-4xl">{positionName}</p>
                <p className="text-xs lg:text-lg text-foreground/70">{numberOfSelection} Seat(s) allowed for this position</p>
            </div>
            <p
                className={cn(
                    "text-orange-400 text-sm lg:text-xl",
                    selected === numberOfSelection && "text-green-500",
                )}
            >
                {numberOfSelection - selected} Selection left
            </p>
        </div>
    );
};

export default VoteHeader;

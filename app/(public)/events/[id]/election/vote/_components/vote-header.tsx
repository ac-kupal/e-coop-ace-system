import { cn } from "@/lib/utils";
import { TPosition } from "@/types";

type Props = {
    position: TPosition;
    selected: number;
};

const VoteHeader = ({ position, selected }: Props) => {
    console.log(position);
    const { positionName, numberOfSelection } = position;

    return (
        <div className="flex justify-between w-full items-center">
            <div className="space-y-2">
                <p className="text-2xl font-medium lg:text-4xl">{positionName}</p>
                <p className="text-lg text-foreground/70">{numberOfSelection} Seat(s) allowed for this position</p>
            </div>
            <p
                className={cn(
                    "text-orange-400 text-xl",
                    selected === numberOfSelection && "text-green-500",
                )}
            >
                {numberOfSelection - selected} Selection left
            </p>
        </div>
    );
};

export default VoteHeader;

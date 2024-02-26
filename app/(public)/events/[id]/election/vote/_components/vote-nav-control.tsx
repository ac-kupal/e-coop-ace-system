import { Button } from "@/components/ui/button";

type Props = {
    onBack: () => void;
    onNext: () => void;
    onFinalize: () => void;

    currentPage: number;
    lastPage: number;
    canNext: boolean;
};

const VoteNavControl = ({
    currentPage,
    lastPage,
    onBack,
    onNext,
    canNext,
    onFinalize,
}: Props) => {
    return (
        <div className="w-full flex items-center p-4 justify-between">
            <Button disabled={currentPage == 0} onClick={onBack}>
                Previous Position
            </Button>
            {currentPage > lastPage ? (
                <Button onClick={onFinalize}>Cast Vote</Button>
            ) : (
                <Button disabled={!canNext} onClick={onNext}>
                    {currentPage === lastPage - 1 ? "Next Position" : "View Summary"}
                </Button>
            )}
        </div>
    );
};

export default VoteNavControl;

import LoadingSpinner from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";

type Props = {
    onBack: () => void;
    onNext: () => void;
    onFinalize: () => void;
    isLoading : boolean;

    currentPage: number;
    lastPage: number;
    canNext: boolean;
};

const VoteNavControl = ({
    currentPage,
    lastPage,
    isLoading,
    onBack,
    onNext,
    canNext,
    onFinalize,
}: Props) => {
    return (
        <div className="w-full flex items-center p-4 justify-between">
            <Button disabled={currentPage == 0 || isLoading} onClick={onBack}>
                Previous Position
            </Button>
            {currentPage > lastPage ? (
                <Button onClick={onFinalize} disabled={isLoading}>
                    {
                        isLoading ? <LoadingSpinner /> : "Cast Vote" 
                    }
                </Button>
            ) : (
                <Button disabled={!canNext} onClick={onNext}>
                    {currentPage === lastPage - 1 ? "Next Position" : "View Summary"}
                </Button>
            )}
        </div>
    );
};

export default VoteNavControl;

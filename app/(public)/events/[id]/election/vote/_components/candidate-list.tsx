import { TCandidatewithPosition } from "@/types";
import React from "react";
import CandidateCard from "./candidate-card";

type Props = {
    candidates: TCandidatewithPosition[];
    chosenCandidates: TCandidatewithPosition[];
    onAdd: (candidate: TCandidatewithPosition) => void;
    onRemove: (candidate: TCandidatewithPosition) => void;
};

const CandidateList = ({
    candidates,
    chosenCandidates,
    onAdd,
    onRemove,
}: Props) => {
    return (
        <div className="py-8 gap-y-4 flex flex-wrap w-full">
            {candidates.map((candidate) => (
                <CandidateCard
                    isChosen={
                        chosenCandidates.find((chosen) => chosen.id === candidate.id) !==
                        undefined
                    }
                    onSelect={onAdd}
                    onRemove={onRemove}

                    candidate={candidate}
                    key={candidate.id}
                />
            ))}
        </div>
    );
};

export default CandidateList;

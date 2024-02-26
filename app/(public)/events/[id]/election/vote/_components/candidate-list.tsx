import React from "react";

import CandidateCard from "./candidate-card";
import { TCandidatewithPosition } from "@/types";

type Props = {
    maxSelect : number,
    candidates: TCandidatewithPosition[];
    chosenCandidates: TCandidatewithPosition[];
    onAdd: (candidate: TCandidatewithPosition) => void;
    onRemove: (candidate: TCandidatewithPosition) => void;
};

const CandidateList = ({
    candidates,
    chosenCandidates,
    maxSelect,
    onAdd,
    onRemove,
}: Props) => {

    return (
        <div className="py-8 gap-y-4 flex justify-center flex-wrap w-full">
            {candidates.map((candidate) => (
                <CandidateCard
                    canSelect={chosenCandidates.length < maxSelect}
                    isChosen={
                        chosenCandidates.find((chosen) => chosen.id === candidate.id) !==
                        undefined
                    }

                    onSelect={onAdd}
                    onRemove={onRemove}

                    key={candidate.id}
                    candidate={candidate}
                />
            ))}
        </div>
    );
};

export default CandidateList;

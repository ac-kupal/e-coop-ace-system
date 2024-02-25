import {
    TCandidatewithPosition,
} from "@/types";
import React from "react";
import CandidateCard from "./candidate-card";

type Props = { candidates: TCandidatewithPosition[] };

const CandidateList = ({ candidates }: Props) => {
    return (
        <div className="py-8 gap-y-4 flex flex-wrap w-full">
            {candidates.map((candidate) => (
                <CandidateCard candidate={candidate} key={candidate.id} />
            ))}
        </div>
    );
};

export default CandidateList;

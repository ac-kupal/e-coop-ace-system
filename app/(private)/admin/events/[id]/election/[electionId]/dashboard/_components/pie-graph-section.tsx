"use client";
import React from "react";
import { getPositionVotesTotal } from "@/hooks/api-hooks/vote-api-hooks";
import Loading from "../../_components/loading";
import NotFound from "../../_components/not-found";

import {
   Carousel,
   CarouselContent,
   CarouselItem,
   CarouselNext,
   CarouselPrevious,
} from "@/components/ui/carousel";
import { PieGraphContainer } from "./pie-graph-container";
import NoVoters from "./no-voters";

type TParams = {
   params: { id: number; electionId: number };
};
export const PieGraphSection = ({ params }: TParams) => {
   const { votes, isLoading, isError } = getPositionVotesTotal(params);

   console.log("pie graph", votes)

   if (isLoading) return <Loading></Loading>;
   if (isError) return <NotFound></NotFound>;

   if(votes?.length === 0) return <NoVoters></NoVoters>

   return (
         <Carousel className="w-full lg:w-3/4 h-fit p-3 ">
            <CarouselContent className=""> 
               {votes?.map((position, index) => (
                  <CarouselItem key={index}>
                     <div className="p-5 h-[600px] w-full rounded-3xl bg-secondary/20 flex xl:justify-center">
                              <PieGraphContainer
                                 key={index}
                                 positionName={position.positionName}
                                 dataSet={position.dataSets}
                                 labels={position.candidateNameWithNumeric}
                              />
                     </div>
                  </CarouselItem>
               ))}
            </CarouselContent>
            <CarouselPrevious/>
            <CarouselNext />
         </Carousel>
   );
};

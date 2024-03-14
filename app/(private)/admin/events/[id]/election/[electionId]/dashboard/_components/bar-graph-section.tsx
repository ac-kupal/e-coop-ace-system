"use client";
import { BarGraphDataTypes } from "@/types";
import React from "react";
import BarGraphContainer from "./container-bar-graph";
import { getPositionVotesTotal } from "@/hooks/api-hooks/vote-api-hooks";
import Loading from "../../_components/loading";
import NotFound from "../../_components/not-found";

import { Card, CardContent } from "@/components/ui/card";
import {
   Carousel,
   CarouselContent,
   CarouselItem,
   CarouselNext,
   CarouselPrevious,
} from "@/components/ui/carousel";

type TParams = {
   params: { id: number; electionId: number };
};
export const BarGraphSection = ({ params }: TParams) => {
   
   const { votes, isLoading, isError } = getPositionVotesTotal(params);

   console.log(votes)

   if (isLoading) return <Loading></Loading>;
   if (isError) return <NotFound></NotFound>;

   if(votes?.length === 0) return <div className="w-full h-[50vh] flex justify-center items-center">
         <div className="flex flex-col items-center space-y-2">
            <p className="font-bold text-[5rem]">🍃</p>
            <p className="font-semibold">{`There's still no vote captured!`}</p>
         </div>
   </div>

   return (
         <Carousel className="min-w-[100px] w-full lg:w-3/4  p-3 ">
            <CarouselContent> 
               {votes?.map((position, index) => (
                  <CarouselItem key={index}>
                     <div className="p-5 w-full rounded-3xl bg-secondary/20 flex xl:justify-center">
                              <BarGraphContainer
                                 key={index}
                                 positionName={position.positionName}
                                 dataSet={position.dataSets}
                                 labels={position.candidateNameWithNumeric}
                              ></BarGraphContainer>
                     </div>
                  </CarouselItem>
               ))}
            </CarouselContent>
            <CarouselPrevious/>
            <CarouselNext />
         </Carousel>
   );
};

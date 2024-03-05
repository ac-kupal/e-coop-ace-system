import { Accessibility } from "lucide-react";
import Header from "../_components/header";
import { BarGraphSection } from "./_components/bar-graph-section";
import { Separator } from "@/components/ui/separator";


type TParams = {
   params:{id:number,electionId:number}
}

const page = ({params}:TParams) => {
   return (
      <div>
         <Header text="Dashboard"></Header>
         <div className="w-full flex space-x-3 justify-start px-2">
           <div className="flex space-x-2 items-center py-5">
            <div className="p-1 bg-[#22C55E]/80 rounded-lg">
            <Accessibility className="size-5 text-slate-200" />
            </div>
            <h1 className="font-medium">Positions</h1>
           </div>
         </div>
         <div className="flex w-full rounded-3xl lg:p-5 justify-center  bg-background">
           <BarGraphSection params={params} ></BarGraphSection>
         </div>
      </div>
   );
};

export default page;

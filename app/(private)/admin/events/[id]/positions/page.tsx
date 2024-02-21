import PositionTable from "./_components/position-table";
import NotFound from "../_components/not-found";
import { getElectionId } from "@/app/api/v1/event/_services/events";
import { getEvent } from "@/hooks/api-hooks/event-api-hooks";

const PositionPage = async ({ params }: { params: { id: number } }) => {

  const electionId = await getElectionId(Number(params.id));

  
  if (!electionId) return <NotFound></NotFound>;

   return (
      <div className="p-5">
         <PositionTable electionId={electionId}></PositionTable>
      </div>
   );
};

export default PositionPage;

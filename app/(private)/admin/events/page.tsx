import EventTable from "./_components/event-table";

type Props = {};

const EventsPage = (props: Props) => {
   return (
      <div className="flex p-4 min-h-screen flex-col w-full">
         <EventTable />
      </div>
   );
};

export default EventsPage;

import EventTable from "./_components/event-table";

type Props = {};

const EventsPage = (props: Props) => {
   return (
      <div className="flex p-5 min-h-screen flex-col w-full bg-[#e1e1e1] dark:bg-background/80">
         <EventTable />
      </div>
   );
};

export default EventsPage;

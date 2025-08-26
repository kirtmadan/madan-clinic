// "use client";
//
// import CreateAppointmentFormWithDrawer from "@/components/appointments/CreateAppointmentForm";
//
// // import ShadcnBigCalendar from "@/components/shadcn-big-calendar/Calendar";
// // import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
//
// import { dayjsLocalizer, SlotInfo, Views } from "react-big-calendar";
// import dayjs from "dayjs";
// import { SetStateAction, useState } from "react";
// // const localizer = dayjsLocalizer(dayjs);
//
// // const DnDCalendar = withDragAndDrop(ShadcnBigCalendar);
//
// export default function CalenderView() {
//   // const [view, setView] = useState(Views.WEEK);
//   // const [date, setDate] = useState(new Date());
//   // const [events, setEvents] = useState<Event[]>([]);
//   // const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
//   //
//   // const handleNavigate = (newDate: Date) => {
//   //   setDate(newDate);
//   // };
//   //
//   // const handleViewChange = (newView: SetStateAction<any>) => {
//   //   setView(newView);
//   // };
//   //
//   // const handleSelectSlot = (slotInfo: SlotInfo) => {
//   //   setSelectedSlot(slotInfo);
//   // };
//
//   // const handleCreateEvent = (data: {
//   //   doctorId: string;
//   //   patientId: string;
//   //   treatmentId: string;
//   //   start: string;
//   // }) => {
//   //   const st = dayjs(data.start);
//   //   const et = st.add(30, "minutes");
//   //
//   //   const newEvent = {
//   //     title: data.treatmentId,
//   //     patientId: data.patientId,
//   //     doctorId: data.doctorId,
//   //     treatmentId: data.treatmentId,
//   //     start: st.toDate(),
//   //     end: et.toDate(),
//   //   };
//
//   // setEvents((prev: any) => [...prev, newEvent]);
//   // setSelectedSlot(null);
//   // };
//
//   // const handleEventDrop = ({ event, start, end }: any) => {
//   //   const updatedEvents = events.map((existingEvent) =>
//   //     existingEvent === event
//   //       ? { ...existingEvent, start, end }
//   //       : existingEvent,
//   //   );
//   //   setEvents(updatedEvents);
//   // };
//   //
//   // const handleEventResize = ({ event, start, end }: any) => {
//   //   const updatedEvents = events.map((existingEvent) =>
//   //     existingEvent === event
//   //       ? { ...existingEvent, start, end }
//   //       : existingEvent,
//   //   );
//   //   setEvents(updatedEvents);
//   // };
//
//   return (
//     <>
//       <CreateAppointmentFormWithDrawer
//         trigger={}
//         onSubmit={handleCreateEvent}
//       />
//
//       {/*<DnDCalendar*/}
//       {/*  localizer={localizer}*/}
//       {/*  style={{ height: "calc(95vh - 80px)", width: "100%" }}*/}
//       {/*  className="border rounded-sm" // Optional border*/}
//       {/*  selectable*/}
//       {/*  date={date}*/}
//       {/*  onNavigate={handleNavigate}*/}
//       {/*  view={view}*/}
//       {/*  onView={handleViewChange}*/}
//       {/*  resizable*/}
//       {/*  draggableAccessor={() => true}*/}
//       {/*  resizableAccessor={() => true}*/}
//       {/*  events={events}*/}
//       {/*  onSelectSlot={handleSelectSlot}*/}
//       {/*  onEventDrop={handleEventDrop}*/}
//       {/*  onEventResize={handleEventResize}*/}
//       {/*/>*/}
//     </>
//   );
// }

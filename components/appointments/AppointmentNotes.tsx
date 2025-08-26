export default function AppointmentNotes({ notes }: { notes: string }) {
  return (
    <div className="w-full h-full border p-4 border-dashed flex flex-col gap-4 rounded-lg">
      <h3 className="font-medium">Appointment Notes</h3>

      <p className="text-sm text-muted-foreground">{notes}</p>
    </div>
  );
}

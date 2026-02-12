import { Calendar } from "lucide-react";

const timetable = [
  { day: "Monday", slots: ["Data Structures", "Free", "Java Programming", "Lab"] },
  { day: "Tuesday", slots: ["Web Technologies", "DBMS", "Free", "Seminar"] },
  { day: "Wednesday", slots: ["Data Structures", "Java Programming", "Web Technologies", "Free"] },
  { day: "Thursday", slots: ["DBMS", "Free", "Lab", "Lab"] },
  { day: "Friday", slots: ["Java Programming", "Web Technologies", "Data Structures", "Sports"] },
  { day: "Saturday", slots: ["DBMS Lab", "Free", "Free", "Free"] },
];

const timeSlots = ["9:00-10:00", "10:00-11:00", "11:30-12:30", "1:30-2:30"];

export default function StudentTimetable() {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-foreground">Timetable</h2>
      <div className="bg-card border border-border rounded-xl p-6 overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left font-body text-xs text-muted-foreground pb-3 pr-4">Day</th>
              {timeSlots.map((t) => (
                <th key={t} className="text-center font-body text-xs text-muted-foreground pb-3 px-2">{t}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timetable.map((row) => (
              <tr key={row.day} className="border-b border-border/50">
                <td className="font-body text-sm font-semibold py-3 pr-4 text-foreground">{row.day}</td>
                {row.slots.map((slot, i) => (
                  <td key={i} className="text-center py-3 px-2">
                    <span className={`font-body text-xs px-2 py-1 rounded ${slot === "Free" ? "text-muted-foreground" : "bg-primary/10 text-primary font-medium"}`}>
                      {slot}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

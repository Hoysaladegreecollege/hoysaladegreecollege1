import SectionHeading from "@/components/SectionHeading";
import { Phone, StickyNote, AlertTriangle, User } from "lucide-react";
import { useState } from "react";

interface AbsentStudent {
  id: string;
  name: string;
  rollNo: string;
  course: string;
  semester: string;
  phone: string;
  date: string;
  notes: string[];
  remarks: string;
}

const sampleAbsentees: AbsentStudent[] = [
  { id: "1", name: "Arun Kumar", rollNo: "BCA2024001", course: "BCA", semester: "4th", phone: "+919876543210", date: "Feb 12, 2026", notes: ["Called parent – no response", "Student has medical issue"], remarks: "Needs follow-up" },
  { id: "2", name: "Divya R.", rollNo: "BCOM2024015", course: "BCom", semester: "2nd", phone: "+919876543211", date: "Feb 12, 2026", notes: [], remarks: "" },
  { id: "3", name: "Kiran S.", rollNo: "BBA2024008", course: "BBA", semester: "6th", phone: "+919876543212", date: "Feb 12, 2026", notes: ["Frequently absent"], remarks: "Warning issued" },
  { id: "4", name: "Meera P.", rollNo: "BCA2024022", course: "BCA", semester: "2nd", phone: "+919876543213", date: "Feb 12, 2026", notes: [], remarks: "" },
  { id: "5", name: "Naveen G.", rollNo: "BCOM2024030", course: "BCom", semester: "4th", phone: "+919876543214", date: "Feb 12, 2026", notes: ["Parent informed"], remarks: "Personal reasons" },
];

export default function StudentAbsent() {
  const [students, setStudents] = useState(sampleAbsentees);
  const [noteInput, setNoteInput] = useState<Record<string, string>>({});
  const [remarksInput, setRemarksInput] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState("All");

  const courses = ["All", "BCA", "BCom", "BBA"];
  const filtered = filter === "All" ? students : students.filter((s) => s.course === filter);

  const addNote = (id: string) => {
    const text = noteInput[id]?.trim();
    if (!text) return;
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, notes: [...s.notes, text] } : s))
    );
    setNoteInput((prev) => ({ ...prev, [id]: "" }));
  };

  const updateRemarks = (id: string) => {
    const text = remarksInput[id]?.trim();
    if (!text) return;
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, remarks: text } : s))
    );
    setRemarksInput((prev) => ({ ...prev, [id]: "" }));
  };

  return (
    <div>
      <section className="bg-primary py-16 text-center text-primary-foreground">
        <div className="container">
          <h1 className="font-display text-4xl md:text-5xl font-bold">Student Absent List</h1>
          <p className="font-body text-sm mt-2 opacity-70">Today's absent students — Teacher Access Only</p>
        </div>
      </section>

      <section className="py-10 bg-background">
        <div className="container">
          {/* Info Banner */}
          <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-4 mb-8 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
            <div>
              <p className="font-body text-sm font-semibold text-foreground">Teacher Access Only</p>
              <p className="font-body text-xs text-muted-foreground">Only assigned teachers can call students and add notes/remarks. Contact admin if you need access.</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {courses.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`font-body text-sm px-4 py-2 rounded-full transition-colors ${
                  filter === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {c}
              </button>
            ))}
            <span className="ml-auto font-body text-sm text-muted-foreground self-center">
              {filtered.length} student(s) absent
            </span>
          </div>

          {/* Student Cards */}
          <div className="space-y-4">
            {filtered.map((s) => (
              <div key={s.id} className="bg-card border border-border rounded-xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-semibold text-foreground">{s.name}</h3>
                      <p className="font-body text-xs text-muted-foreground">
                        {s.rollNo} • {s.course} – {s.semester} Sem • Absent: {s.date}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`tel:${s.phone}`}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-body text-sm font-medium hover:bg-navy-light transition-colors shrink-0"
                  >
                    <Phone className="w-4 h-4" /> Call Student
                  </a>
                </div>

                {/* Remarks */}
                {s.remarks && (
                  <div className="mb-3 px-3 py-2 rounded-lg bg-destructive/5 border border-destructive/10">
                    <p className="font-body text-xs font-semibold text-destructive">Remarks:</p>
                    <p className="font-body text-sm text-foreground">{s.remarks}</p>
                  </div>
                )}

                {/* Notes */}
                {s.notes.length > 0 && (
                  <div className="mb-3 space-y-1">
                    <p className="font-body text-xs font-semibold text-muted-foreground flex items-center gap-1">
                      <StickyNote className="w-3 h-3" /> Notes:
                    </p>
                    {s.notes.map((n, i) => (
                      <p key={i} className="font-body text-xs text-muted-foreground pl-4 border-l-2 border-secondary/40">
                        {n}
                      </p>
                    ))}
                  </div>
                )}

                {/* Add Note & Remarks */}
                <div className="grid sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-border">
                  <div className="flex gap-2">
                    <input
                      value={noteInput[s.id] || ""}
                      onChange={(e) => setNoteInput((prev) => ({ ...prev, [s.id]: e.target.value }))}
                      placeholder="Add a note..."
                      className="flex-1 border border-border rounded-lg px-3 py-2 font-body text-xs bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <button onClick={() => addNote(s.id)} className="px-3 py-2 bg-primary text-primary-foreground rounded-lg font-body text-xs font-medium hover:bg-navy-light transition-colors">
                      + Note
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={remarksInput[s.id] || ""}
                      onChange={(e) => setRemarksInput((prev) => ({ ...prev, [s.id]: e.target.value }))}
                      placeholder="Update remarks..."
                      className="flex-1 border border-border rounded-lg px-3 py-2 font-body text-xs bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <button onClick={() => updateRemarks(s.id)} className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg font-body text-xs font-medium hover:opacity-90 transition-colors">
                      Remark
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import SectionHeading from "@/components/SectionHeading";
import { Trophy, Star, Medal } from "lucide-react";

const achievements = [
  { name: "Ananya R.", course: "BCA", achievement: "University Gold Medalist – 2025", type: "Academic" },
  { name: "Rahul M.", course: "BBA", achievement: "State-level Business Plan Competition Winner", type: "Competition" },
  { name: "Priya S.", course: "BCom", achievement: "CA Foundation – All India Rank 45", type: "Academic" },
  { name: "Vikram K.", course: "BCA", achievement: "National Level Hackathon – 1st Place", type: "Technical" },
  { name: "Sneha D.", course: "BBA", achievement: "Best Speaker – Inter-College Debate", type: "Cultural" },
  { name: "Arun P.", course: "BCom", achievement: "District Cricket Championship MVP", type: "Sports" },
];

export default function Achievements() {
  return (
    <div>
      <section className="bg-primary py-16 text-center text-primary-foreground">
        <div className="container">
          <h1 className="font-display text-4xl md:text-5xl font-bold">Student Achievements</h1>
          <p className="font-body text-sm mt-2 opacity-70">Home / Achievements</p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container">
          <SectionHeading title="Our Stars" subtitle="Celebrating the accomplishments of our talented students" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {achievements.map((a, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 mx-auto rounded-full bg-secondary/15 flex items-center justify-center mb-4">
                  <Trophy className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">{a.name}</h3>
                <p className="font-body text-xs text-secondary font-semibold mt-1">{a.course}</p>
                <p className="font-body text-sm text-muted-foreground mt-3">{a.achievement}</p>
                <span className="inline-block mt-3 text-[10px] font-body px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">{a.type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

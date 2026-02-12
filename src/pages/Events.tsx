import SectionHeading from "@/components/SectionHeading";
import { Calendar, Image } from "lucide-react";
import { useState } from "react";

const events = [
  { title: "Annual Sports Day 2026", date: "March 15, 2026", category: "Sports", desc: "Inter-college sports competition featuring athletics, cricket, basketball and more." },
  { title: "Tech Fest – InnoVate 2026", date: "February 28, 2026", category: "Technical", desc: "Annual technical festival with coding competitions, hackathons, and tech talks." },
  { title: "Cultural Night – Utsav", date: "April 5, 2026", category: "Cultural", desc: "A night of dance, music, drama, and art celebrating the diverse culture of our students." },
  { title: "Workshop: AI & Machine Learning", date: "January 20, 2026", category: "Workshop", desc: "Hands-on workshop covering fundamentals and applications of AI and ML." },
  { title: "Independence Day Celebration", date: "August 15, 2025", category: "National", desc: "Patriotic celebration with flag hoisting, cultural programs, and speeches." },
  { title: "Farewell – Batch 2025", date: "May 20, 2025", category: "Cultural", desc: "Farewell ceremony for the graduating batch of 2025 with performances and awards." },
];

const categories = ["All", "Sports", "Technical", "Cultural", "Workshop", "National"];

export default function Events() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? events : events.filter((e) => e.category === filter);

  return (
    <div>
      <section className="bg-primary py-16 text-center text-primary-foreground">
        <div className="container">
          <h1 className="font-display text-4xl md:text-5xl font-bold">Events & Gallery</h1>
          <p className="font-body text-sm mt-2 opacity-70">Home / Events</p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container">
          <SectionHeading title="College Events" subtitle="Explore our vibrant campus life through events and activities" />

          {/* Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map((c) => (
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
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((e) => (
              <div key={e.title} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-40 bg-muted flex items-center justify-center">
                  <Image className="w-12 h-12 text-muted-foreground/30" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-body font-semibold px-2 py-0.5 rounded-full bg-secondary/20 text-secondary-foreground">{e.category}</span>
                    <span className="text-xs font-body text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {e.date}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{e.title}</h3>
                  <p className="font-body text-sm text-muted-foreground mt-2">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

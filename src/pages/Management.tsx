import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import { Users } from "lucide-react";

const committee = [
  { name: "Dr. Ramakrishnappa T", role: "President", emoji: "👔" },
  { name: "Sri Suresh B.V", role: "Treasurer", emoji: "💰" },
  { name: "Smt Jyothi N", role: "Secretary", emoji: "📋" },
  { name: "Prof. Gowrishankar K.V", role: "Trustee", emoji: "🏛️" },
  { name: "Sri Gopal H.R", role: "Principal", emoji: "🎓" },
  { name: "Smt Annapurna T", role: "Trustee", emoji: "🏛️" },
];

export default function Management() {
  return (
    <div>
      <section className="bg-primary py-16 text-center text-primary-foreground">
        <div className="container">
          <h1 className="font-display text-4xl md:text-5xl font-bold">Top Management Committee</h1>
          <p className="font-body text-sm mt-2 opacity-70">Home / Management</p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container max-w-4xl">
          <SectionHeading title="Our Leadership" subtitle="The dedicated leaders guiding Hoysala Degree College" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {committee.map((m, i) => (
              <ScrollReveal key={m.name} delay={i * 100}>
                <div className="bg-card border border-border rounded-xl p-6 text-center hover-lift">
                  <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-primary/10 flex items-center justify-center text-3xl">
                    {m.emoji}
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground">{m.name}</h3>
                  <p className="font-body text-sm text-secondary font-semibold mt-1">{m.role}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

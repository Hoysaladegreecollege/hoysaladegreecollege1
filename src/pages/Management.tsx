import SEOHead from "@/components/SEOHead";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";

const committee = [
  { name: "Dr. Ramakrishnappa T", qualification: "M.Sc, Ph.D, Post Doc.", role: "President", emoji: "👔" },
  { name: "Sri Suresh B.V", qualification: "", role: "Treasurer", emoji: "💰" },
  { name: "Smt Jyothi N", qualification: "", role: "Secretary", emoji: "📋" },
  { name: "Prof. Gowrishankar K.V", qualification: "M.Sc, Trustee – Principal of Hoysala PU College", role: "Trustee", emoji: "🏛️" },
  { name: "Sri Gopal H.R", qualification: "M.Sc, M.Ed, TET, KSET, Ph.D – Principal of Hoysala Degree College", role: "Principal", emoji: "🎓" },
  { name: "Smt Annapurna T", qualification: "MA, B.Ed", role: "Trustee", emoji: "🏛️" },
];

export default function Management() {
  return (
    <div>
      <SEOHead title="Top Management Committee" description="Meet the leadership committee of Hoysala Degree College under Shri Shirdi Sai Educational Trust. President, Secretary, Trustees, and Principal." canonical="/management" />
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
                <div className="bg-card border border-border rounded-xl p-6 text-center hover-lift group transition-all duration-300">
                  <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-primary/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                    {m.emoji}
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground">{m.name}</h3>
                  {m.qualification && (
                    <p className="font-body text-xs text-muted-foreground mt-1 italic">{m.qualification}</p>
                  )}
                  <p className="font-body text-sm text-secondary font-semibold mt-2">{m.role}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

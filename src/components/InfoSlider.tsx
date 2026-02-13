const items = [
  "🎓 Admissions Open for 2026–27",
  "📝 Weekly Tests for CA & CS Students",
  "💼 Placement Updates – 90% Placement Rate",
  "🏆 Scholarships Available for Meritorious Students",
  "📅 Annual Cultural Fest – Coming Soon",
  "🤖 AI & ML Workshops Every Month",
  "📚 Exclusive CA / CS / CMA Coaching",
];

export default function InfoSlider() {
  return (
    <div className="bg-secondary/10 border-y border-secondary/20 py-2.5 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap flex gap-12">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="font-body text-sm font-medium text-foreground inline-block">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

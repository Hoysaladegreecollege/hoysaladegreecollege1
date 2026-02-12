import SectionHeading from "@/components/SectionHeading";
import { Target, Eye, BookOpen, Users, Award, Heart } from "lucide-react";
import heroImage from "@/assets/hero-college.jpg";

const values = [
  { icon: BookOpen, title: "Academic Excellence", desc: "Rigorous curriculum designed to meet industry standards and foster innovation." },
  { icon: Users, title: "Holistic Development", desc: "Focus on sports, cultural activities, and life skills alongside academics." },
  { icon: Award, title: "Qualified Faculty", desc: "Experienced educators dedicated to student success and mentorship." },
  { icon: Heart, title: "Inclusive Environment", desc: "A welcoming campus that celebrates diversity and equal opportunity." },
];

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden">
        <img src={heroImage} alt="Campus" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative z-10 text-center text-primary-foreground">
          <h1 className="font-display text-4xl md:text-5xl font-bold">About Us</h1>
          <p className="font-body text-sm mt-2 opacity-70">Home / About</p>
        </div>
      </section>

      {/* About */}
      <section className="py-20 bg-background">
        <div className="container max-w-4xl">
          <SectionHeading title="About Hoysala Degree College" subtitle="Building a legacy of knowledge and character since our founding" />
          <div className="font-body text-muted-foreground leading-relaxed space-y-4 text-base">
            <p>
              Hoysala Degree College, located in the serene town of Nelamangala, Bangalore, is committed to providing quality higher education. Affiliated with Bangalore University, the college offers undergraduate programs in Computer Applications, Commerce, and Business Administration.
            </p>
            <p>
              Our institution combines modern teaching methodologies with traditional values, creating an environment where students develop both professionally and personally. With state-of-the-art facilities, experienced faculty, and a vibrant campus life, we prepare students for the challenges of the modern world.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-cream">
        <div className="container grid md:grid-cols-2 gap-8 max-w-4xl">
          <div className="bg-card rounded-xl p-8 border border-border">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground mb-3">Our Vision</h3>
            <p className="font-body text-muted-foreground leading-relaxed">
              To be a premier institution of higher learning, recognized for academic excellence, innovation, and producing socially responsible graduates who contribute meaningfully to society.
            </p>
          </div>
          <div className="bg-card rounded-xl p-8 border border-border">
            <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground mb-3">Our Mission</h3>
            <p className="font-body text-muted-foreground leading-relaxed">
              To provide accessible, affordable, and quality education that empowers students with knowledge, skills, and values necessary for successful careers and lifelong learning.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-background">
        <div className="container">
          <SectionHeading title="Our Core Values" subtitle="The principles that guide everything we do" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="text-center bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <v.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-display text-lg font-semibold text-foreground mb-2">{v.title}</h4>
                <p className="font-body text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

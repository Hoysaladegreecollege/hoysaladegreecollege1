import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import { Target, Eye, BookOpen, Users, Award, Heart } from "lucide-react";
import heroImage from "@/assets/hero-college.jpg";
import principalImage from "@/assets/principal.jpg";

const values = [
  { icon: BookOpen, title: "Academic Excellence", desc: "Rigorous curriculum designed to meet industry standards and foster innovation." },
  { icon: Users, title: "Holistic Development", desc: "Focus on sports, cultural activities, and life skills alongside academics." },
  { icon: Award, title: "Qualified Faculty", desc: "Experienced educators dedicated to student success and mentorship." },
  { icon: Heart, title: "Inclusive Environment", desc: "A welcoming campus that celebrates diversity and equal opportunity." },
];

export default function About() {
  return (
    <div>
      <section className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden">
        <img src={heroImage} alt="Campus" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative z-10 text-center text-primary-foreground">
          <h1 className="font-display text-4xl md:text-5xl font-bold">About Us</h1>
          <p className="font-body text-sm mt-2 opacity-70">Home / About</p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container max-w-4xl">
          <ScrollReveal>
            <SectionHeading title="About Hoysala Degree College" subtitle="Building a legacy of knowledge and character" />
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="font-body text-muted-foreground leading-relaxed space-y-4 text-base">
              <p>
                Hoysala Degree College, established in 2017 under Shri Shirdi Sai Educational Trust(R), is located in Nelamangala Town, Bengaluru Rural District. Affiliated to Bangalore University and approved by AICTE New Delhi, the college offers BCA, B.Com (Regular & Professional), and BBA programs.
              </p>
              <p>
                Our institution combines modern teaching methodologies with traditional values, creating an environment where students develop both professionally and personally. With state-of-the-art facilities, experienced faculty, and exclusive coaching for CA, CS & CMA aspirants, we prepare students for the challenges of the modern world.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Principal's Message */}
      <section className="py-16 bg-cream">
        <div className="container max-w-4xl">
          <div className="grid md:grid-cols-5 gap-8 items-start">
            <ScrollReveal className="md:col-span-2">
              <img src={principalImage} alt="Principal Sri Gopal H.R" className="rounded-2xl shadow-xl w-full" />
              <div className="mt-4 text-center">
                <p className="font-display text-lg font-bold text-foreground">Sri Gopal H.R</p>
                <p className="font-body text-sm text-muted-foreground">Principal</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200} className="md:col-span-3">
              <SectionHeading title="Principal's Message" centered={false} />
              <div className="font-body text-muted-foreground leading-relaxed text-sm space-y-3 border-l-4 border-secondary pl-6 italic">
                <p>It gives immense pleasure to welcome you to HOYSALA DEGREE COLLEGE, one of the best colleges in Nelamangala town, established in 2017 under the aegis of Shri Shirdi Sai Educational Trust(R).</p>
                <p>Our college is affiliated to Bangalore University and offers B.Com, BBA, and BCA programs. We believe in holistic development of students through academics, co-curricular activities, and value-based education.</p>
                <p>Our experienced faculty, modern infrastructure, and student-centric approach ensure that every student receives personalized attention and guidance to excel in their chosen field. We provide exclusive coaching for CA, CS & CMA aspirants alongside regular degree programs.</p>
                <p>We focus on daily attendance monitoring through SMS updates, monthly internal assessments, weekly tests for professional course aspirants, and hands-on workshops in AI & ML for technology students.</p>
                <p>I invite you to be part of the Hoysala family and experience excellence in education. Together, let us build a brighter future.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-background">
        <div className="container grid md:grid-cols-2 gap-8 max-w-4xl">
          <ScrollReveal>
            <div className="bg-card rounded-xl p-8 border border-border hover-lift">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-3">Our Vision</h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                To be a premier institution of higher learning, recognized for academic excellence, innovation, and producing socially responsible graduates who contribute meaningfully to society.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="bg-card rounded-xl p-8 border border-border hover-lift">
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-3">Our Mission</h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                To provide accessible, affordable, and quality education that empowers students with knowledge, skills, and values necessary for successful careers and lifelong learning.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-cream">
        <div className="container">
          <ScrollReveal>
            <SectionHeading title="Our Core Values" subtitle="The principles that guide everything we do" />
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 100}>
                <div className="text-center bg-card rounded-xl border border-border p-6 hover-lift">
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <v.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-display text-lg font-semibold text-foreground mb-2">{v.title}</h4>
                  <p className="font-body text-sm text-muted-foreground">{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

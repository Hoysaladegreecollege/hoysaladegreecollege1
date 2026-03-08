import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import SEOHead from "@/components/SEOHead";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import {
  Download,
  Smartphone,
  Monitor,
  Share,
  MoreVertical,
  Plus,
  CheckCircle,
  Globe,
  ArrowRight,
  Sparkles,
  Apple,
  Chrome,
} from "lucide-react";

export default function InstallPage() {
  const deferredPromptRef = useRef<any>(null);
  const [canInstallPWA, setCanInstallPWA] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e;
      setCanInstallPWA(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPromptRef.current) {
      deferredPromptRef.current.prompt();
      const result = await deferredPromptRef.current.userChoice;
      if (result.outcome === "accepted") {
        setIsInstalled(true);
        setCanInstallPWA(false);
        toast.success("App installed successfully!");
      }
      deferredPromptRef.current = null;
    }
  };

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  const iosSteps = [
    { step: 1, icon: Globe, title: "Open in Safari", desc: "Make sure you're using the Safari browser (not Chrome or other browsers)" },
    { step: 2, icon: Share, title: "Tap the Share button", desc: "Tap the Share icon (square with arrow) at the bottom of the screen" },
    { step: 3, icon: Plus, title: "Add to Home Screen", desc: "Scroll down and tap 'Add to Home Screen'" },
    { step: 4, icon: CheckCircle, title: "Confirm & Done", desc: "Tap 'Add' in the top right corner. The app icon will appear on your home screen!" },
  ];

  const androidSteps = [
    { step: 1, icon: Chrome, title: "Open in Chrome", desc: "Make sure you're using the Google Chrome browser" },
    { step: 2, icon: MoreVertical, title: "Tap the Menu (⋮)", desc: "Tap the three-dot menu icon in the top-right corner of Chrome" },
    { step: 3, icon: Download, title: "Install App / Add to Home Screen", desc: "Tap 'Install app' or 'Add to Home screen' from the menu" },
    { step: 4, icon: CheckCircle, title: "Confirm Installation", desc: "Tap 'Install' to confirm. The app icon will appear on your home screen!" },
  ];

  const desktopSteps = [
    { step: 1, icon: Chrome, title: "Open in Chrome or Edge", desc: "Visit this site in Google Chrome or Microsoft Edge browser" },
    { step: 2, icon: Download, title: "Click Install Icon", desc: "Look for the install icon (⊕) in the address bar or click the menu → 'Install HDC Portal'" },
    { step: 3, icon: CheckCircle, title: "Confirm & Launch", desc: "Click 'Install' to add the app. It will open in its own window like a native app!" },
  ];

  return (
    <div className="page-enter">
      <SEOHead
        title="Install HDC Portal Web App"
        description="Install the HDC Portal web app on your device for instant access to attendance, marks, timetable, and college notifications."
        canonical="/install"
      />
      <PageHeader title="Install Web App" subtitle="Get instant access right from your home screen" />

      {/* Hero Section */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, hsl(230,12%,6%) 0%, hsl(228,14%,8%) 40%, hsl(230,10%,4%) 100%)" }} />
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, hsla(220,70%,55%,0.08), transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

        <div className="relative container px-4">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto">
              {isInstalled ? (
                <div className="space-y-4">
                  <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">Already Installed!</h2>
                  <p className="font-body text-white/40 text-sm">HDC Portal is already installed on your device. Look for it on your home screen.</p>
                </div>
              ) : canInstallPWA ? (
                <div className="space-y-6">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                    <Download className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">Install with One Tap</h2>
                  <p className="font-body text-white/40 text-sm max-w-md mx-auto">Your browser supports direct installation. Click below to add HDC Portal to your device.</p>
                  <button
                    onClick={handleInstall}
                    className="group relative inline-flex items-center gap-3 px-12 py-5 rounded-2xl font-body text-base font-bold transition-all duration-500 hover:scale-105 hover:-translate-y-1 active:scale-[0.97] touch-manipulation"
                    style={{
                      background: "linear-gradient(135deg, hsla(220,70%,55%,1), hsla(250,60%,50%,1))",
                      color: "white",
                      boxShadow: "0 16px 48px hsla(230,70%,50%,0.35), inset 0 1px 0 hsla(220,100%,90%,0.2)",
                    }}
                  >
                    <span className="absolute inset-0 overflow-hidden rounded-2xl">
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </span>
                    <Download className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Install HDC Portal</span>
                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] mb-4 backdrop-blur-sm">
                    <Sparkles className="w-3 h-3 text-secondary/60" />
                    <span className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">Web App</span>
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">Install HDC Portal</h2>
                  <p className="font-body text-white/40 text-sm max-w-md mx-auto leading-relaxed">
                    No app store needed! Install directly from your browser and access everything offline — attendance, marks, timetable, and more.
                  </p>
                </div>
              )}

              {/* Benefits strip */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-10">
                {[
                  { icon: Smartphone, label: "Works Offline" },
                  { icon: Globe, label: "No App Store" },
                  { icon: Monitor, label: "All Devices" },
                ].map((b) => (
                  <div key={b.label} className="flex items-center gap-2 text-white/30 text-xs font-body">
                    <b.icon className="w-3.5 h-3.5" />
                    <span>{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Instructions Section */}
      <section className="py-16 sm:py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/[0.03] rounded-full blur-[100px] pointer-events-none" />
        <div className="container px-4">
          {/* iOS Instructions */}
          <ScrollReveal>
            <div className="max-w-3xl mx-auto mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center border border-border/40">
                  <Apple className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">iPhone & iPad</h3>
                  <p className="font-body text-xs text-muted-foreground">Install using Safari browser</p>
                </div>
                {isIOS && (
                  <span className="ml-auto px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">Your Device</span>
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {iosSteps.map((s, i) => (
                  <div key={i} className="relative p-5 rounded-2xl border border-border/30 bg-card group hover:border-border/60 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 border border-border/30 group-hover:bg-primary/10 transition-colors">
                        <span className="font-display text-sm font-bold text-primary">{s.step}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <s.icon className="w-4 h-4 text-muted-foreground" />
                          <h4 className="font-body text-sm font-semibold text-foreground">{s.title}</h4>
                        </div>
                        <p className="font-body text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Android Instructions */}
          <ScrollReveal delay={100}>
            <div className="max-w-3xl mx-auto mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center border border-border/40">
                  <Smartphone className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">Android</h3>
                  <p className="font-body text-xs text-muted-foreground">Install using Chrome browser</p>
                </div>
                {isAndroid && (
                  <span className="ml-auto px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">Your Device</span>
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {androidSteps.map((s, i) => (
                  <div key={i} className="relative p-5 rounded-2xl border border-border/30 bg-card group hover:border-border/60 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 border border-border/30 group-hover:bg-primary/10 transition-colors">
                        <span className="font-display text-sm font-bold text-primary">{s.step}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <s.icon className="w-4 h-4 text-muted-foreground" />
                          <h4 className="font-body text-sm font-semibold text-foreground">{s.title}</h4>
                        </div>
                        <p className="font-body text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Desktop Instructions */}
          <ScrollReveal delay={200}>
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center border border-border/40">
                  <Monitor className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">Desktop (Windows / Mac)</h3>
                  <p className="font-body text-xs text-muted-foreground">Install using Chrome or Edge</p>
                </div>
                {!isIOS && !isAndroid && (
                  <span className="ml-auto px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">Your Device</span>
                )}
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {desktopSteps.map((s, i) => (
                  <div key={i} className="relative p-5 rounded-2xl border border-border/30 bg-card group hover:border-border/60 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center border border-border/30 group-hover:bg-primary/10 transition-colors">
                        <span className="font-display text-base font-bold text-primary">{s.step}</span>
                      </div>
                      <div>
                        <h4 className="font-body text-sm font-semibold text-foreground mb-1">{s.title}</h4>
                        <p className="font-body text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, hsl(230,12%,6%), hsl(228,14%,8%))" }} />
        <div className="relative container px-4">
          <ScrollReveal>
            <div className="max-w-2xl mx-auto">
              <h3 className="font-display text-2xl font-bold text-white text-center mb-10">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {[
                  { q: "What's the difference between the APK and the Web App?", a: "The APK is a native Android app you download. The Web App (PWA) runs from your browser and works on ALL devices — iPhone, Android, Windows, Mac — without downloading from any store." },
                  { q: "Does it work offline?", a: "Yes! Once installed, the core pages and features are cached and available even without internet. Data syncs when you're back online." },
                  { q: "Will I receive notifications?", a: "Yes, push notifications work on Android and desktop. iOS support for notifications is available on iOS 16.4+." },
                  { q: "How do I uninstall it?", a: "On mobile, long-press the app icon and tap 'Remove'. On desktop, open the app → click the three-dot menu → 'Uninstall'." },
                ].map((faq, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                    <h4 className="font-body text-sm font-semibold text-white/80 mb-2">{faq.q}</h4>
                    <p className="font-body text-xs text-white/35 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

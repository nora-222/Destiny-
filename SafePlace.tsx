import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Lock, Heart, X, ChevronLeft, ChevronRight } from "lucide-react";
import {
  PASSWORD,
  apology,
  finale,
  hero,
  lessons,
  memories,
  promises,
} from "./content";

// -------------------- Password Gate --------------------
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [leaving, setLeaving] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim() === PASSWORD) {
      setError(false);
      setLeaving(true);
      window.setTimeout(onUnlock, 900);
    } else {
      setError(true);
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-6 transition-opacity duration-700 ${
        leaving ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ background: "radial-gradient(ellipse at center, oklch(0.16 0.01 60) 0%, oklch(0.06 0.005 60) 70%)" }}
    >
      <Particles />
      <div className="sanctuary-fade-up relative w-full max-w-md text-center">
        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full sanctuary-glass">
          <Lock className="h-6 w-6" style={{ color: "var(--sanctuary-gold)" }} />
        </div>
        <h1
          className="text-4xl sm:text-5xl font-light tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <span className="sanctuary-gold-text">Welcome, Destiny</span>{" "}
          <span aria-hidden>🤍</span>
        </h1>
        <p
          className="mt-4 text-sm sm:text-base"
          style={{ color: "var(--sanctuary-cream-soft)", opacity: 0.75 }}
        >
          This space was created only for you.
        </p>

        <form onSubmit={submit} className="mt-10 space-y-4">
          <input
            type="password"
            inputMode="numeric"
            autoFocus
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(false);
            }}
            placeholder="Enter your passcode"
            aria-label="Passcode"
            className="w-full rounded-2xl bg-transparent px-5 py-4 text-center text-lg tracking-[0.4em] outline-none transition sanctuary-glass focus:shadow-[0_0_40px_-5px_var(--sanctuary-gold)]"
            style={{ color: "var(--sanctuary-cream)" }}
          />
          <button
            type="submit"
            className="group w-full rounded-2xl px-5 py-4 text-sm font-medium tracking-widest uppercase transition-all duration-500 hover:scale-[1.02]"
            style={{
              background:
                "linear-gradient(135deg, var(--sanctuary-gold) 0%, var(--sanctuary-gold-deep) 100%)",
              color: "oklch(0.12 0.01 60)",
              boxShadow: "var(--sanctuary-glow)",
            }}
          >
            Enter
          </button>
          <p
            className={`text-xs transition-opacity duration-300 ${
              error ? "opacity-100" : "opacity-0"
            }`}
            style={{ color: "oklch(0.75 0.15 25)" }}
            role="alert"
          >
            That's not the right passcode.
          </p>
        </form>
      </div>
    </div>
  );
}

// -------------------- Floating Particles --------------------
function Particles() {
  const dots = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 8,
        duration: 8 + Math.random() * 10,
        key: i,
      })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d) => (
        <span
          key={d.key}
          className="absolute rounded-full"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            background: "var(--sanctuary-gold)",
            filter: "blur(0.5px)",
            boxShadow: "0 0 8px var(--sanctuary-gold)",
            opacity: 0.5,
            animation: `sanctuary-float ${d.duration}s ease-in-out ${d.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// -------------------- Scroll Reveal --------------------
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// -------------------- Typewriter --------------------
function Typewriter({ text, active }: { text: string; active: boolean }) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!active) return;
    let i = 0;
    setShown("");
    setDone(false);
    const id = window.setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        window.clearInterval(id);
        setDone(true);
      }
    }, 22);
    return () => window.clearInterval(id);
  }, [text, active]);
  return (
    <p
      className={`whitespace-pre-wrap text-lg leading-relaxed sm:text-xl ${
        done ? "" : "sanctuary-typewriter-caret"
      }`}
      style={{
        color: "var(--sanctuary-cream)",
        fontFamily: "var(--font-display)",
        fontWeight: 300,
      }}
    >
      {shown}
    </p>
  );
}

function ApologyBlock() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref}>
      <Typewriter text={apology} active={active} />
    </div>
  );
}

// -------------------- Lightbox --------------------
function Lightbox({
  index,
  onClose,
  onPrev,
  onNext,
}: {
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    }
    window.addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", key);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  const item = memories[index];
  return (
    <div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center px-4 sanctuary-fade"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close"
        className="absolute right-4 top-4 rounded-full p-3 sanctuary-glass"
        style={{ color: "var(--sanctuary-cream)" }}
      >
        <X className="h-5 w-5" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label="Previous"
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-3 sanctuary-glass sm:left-8"
        style={{ color: "var(--sanctuary-cream)" }}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label="Next"
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-3 sanctuary-glass sm:right-8"
        style={{ color: "var(--sanctuary-cream)" }}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <img
        src={item.src}
        alt={item.caption}
        className="max-h-[80vh] w-auto max-w-[92vw] rounded-2xl object-contain"
        style={{ boxShadow: "var(--sanctuary-glow)" }}
        onClick={(e) => e.stopPropagation()}
      />
      {item.caption && (
        <p
          className="mt-6 max-w-xl text-center text-sm sm:text-base"
          style={{ color: "var(--sanctuary-cream-soft)", fontFamily: "var(--font-display)", fontStyle: "italic" }}
        >
          {item.caption}
        </p>
      )}
    </div>
  );
}

// -------------------- Card --------------------
function GlassCard({
  title,
  body,
  index,
}: {
  title: string;
  body: string;
  index: number;
}) {
  return (
    <Reveal delay={index * 80}>
      <div className="group relative h-full rounded-3xl p-8 transition-all duration-500 hover:-translate-y-1 sanctuary-glass hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
        <div
          className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full transition-all duration-500 group-hover:scale-110"
          style={{
            background:
              "linear-gradient(135deg, var(--sanctuary-gold) 0%, var(--sanctuary-gold-deep) 100%)",
            color: "oklch(0.12 0.01 60)",
          }}
        >
          <span
            className="text-sm font-medium"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <h3
          className="text-2xl font-light"
          style={{ fontFamily: "var(--font-display)", color: "var(--sanctuary-cream)" }}
        >
          {title}
        </h3>
        <p
          className="mt-3 text-sm leading-relaxed sm:text-base"
          style={{ color: "var(--sanctuary-cream-soft)", opacity: 0.8 }}
        >
          {body}
        </p>
      </div>
    </Reveal>
  );
}

// -------------------- Section header --------------------
function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <Reveal>
      <div className="mb-14 text-center">
        <p
          className="mb-3 text-xs uppercase tracking-[0.4em]"
          style={{ color: "var(--sanctuary-gold)", opacity: 0.8 }}
        >
          {eyebrow}
        </p>
        <h2
          className="text-4xl font-light sm:text-5xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <span className="sanctuary-gold-text">{title}</span>
        </h2>
        <div
          className="mx-auto mt-6 h-px w-16"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--sanctuary-gold), transparent)",
          }}
        />
      </div>
    </Reveal>
  );
}

// -------------------- Main --------------------
export default function SafePlace() {
  const [unlocked, setUnlocked] = useState(false);
  const [entered, setEntered] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (unlocked) {
      // fade in the site
      window.setTimeout(() => setEntered(true), 50);
      window.scrollTo({ top: 0 });
    }
  }, [unlocked]);

  const scrollToApology = useCallback(() => {
    document.getElementById("apology")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () =>
    setLightboxIndex((i) =>
      i === null ? i : (i - 1 + memories.length) % memories.length
    );
  const next = () =>
    setLightboxIndex((i) => (i === null ? i : (i + 1) % memories.length));

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{
        background:
          "radial-gradient(ellipse at top, oklch(0.16 0.01 60) 0%, var(--sanctuary-bg-deep) 60%)",
        color: "var(--sanctuary-cream)",
        fontFamily: "var(--font-body)",
        scrollBehavior: "smooth",
      }}
    >
      {!unlocked && <PasswordGate onUnlock={() => setUnlocked(true)} />}

      <div
        className={`transition-opacity duration-1000 ${
          entered ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* HERO */}
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-24">
          <Particles />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 40%, color-mix(in oklab, var(--sanctuary-gold) 12%, transparent) 0%, transparent 60%)",
            }}
          />
          <div className="sanctuary-fade-up relative mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.35em] sanctuary-glass" style={{ color: "var(--sanctuary-gold)" }}>
              <Heart className="h-3 w-3" /> A private letter
            </div>
            <h1
              className="text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="sanctuary-gold-text">{hero.heading}</span>
            </h1>
            <p
              className="mx-auto mt-8 max-w-xl text-base leading-relaxed sm:text-lg"
              style={{ color: "var(--sanctuary-cream-soft)", opacity: 0.85 }}
            >
              {hero.body}
            </p>
            <button
              onClick={scrollToApology}
              className="mt-10 rounded-full px-8 py-4 text-xs font-medium uppercase tracking-[0.3em] transition-all duration-500 hover:scale-[1.03]"
              style={{
                background:
                  "linear-gradient(135deg, var(--sanctuary-gold) 0%, var(--sanctuary-gold-deep) 100%)",
                color: "oklch(0.12 0.01 60)",
                boxShadow: "var(--sanctuary-glow)",
              }}
            >
              {hero.cta}
            </button>
          </div>
          <div
            className="absolute bottom-8 left-1/2 h-12 w-px -translate-x-1/2"
            style={{
              background:
                "linear-gradient(180deg, transparent, var(--sanctuary-gold), transparent)",
              animation: "sanctuary-shimmer 2.5s ease-in-out infinite",
            }}
          />
        </section>

        {/* APOLOGY */}
        <section id="apology" className="relative px-6 py-28 sm:py-36">
          <div className="mx-auto max-w-3xl">
            <SectionHeading eyebrow="From my heart" title="My Apology" />
            <Reveal>
              <div className="rounded-3xl p-8 sm:p-12 sanctuary-glass" style={{ boxShadow: "var(--sanctuary-glow)" }}>
                <ApologyBlock />
              </div>
            </Reveal>
          </div>
        </section>

        {/* LESSONS */}
        <section className="relative px-6 py-28">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Growth" title="What I've Learned" />
            <div className="grid gap-6 sm:grid-cols-2">
              {lessons.map((l, i) => (
                <GlassCard key={l.title} title={l.title} body={l.body} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* PROMISES */}
        <section className="relative px-6 py-28">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Going forward" title="Promises Moving Forward" />
            <div className="grid gap-6 sm:grid-cols-2">
              {promises.map((p, i) => (
                <GlassCard key={p.title} title={p.title} body={p.body} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* MEMORIES */}
        <section className="relative px-6 py-28">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Little things" title="Memories" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
              {memories.map((m, i) => (
                <Reveal key={m.src} delay={i * 60}>
                  <button
                    onClick={() => openLightbox(i)}
                    className="group relative block aspect-square w-full overflow-hidden rounded-2xl sanctuary-glass"
                    aria-label={m.caption ?? `Memory ${i + 1}`}
                  >
                    <img
                      src={m.src}
                      alt={m.caption ?? ""}
                      loading="lazy"
                      width={1024}
                      height={1024}
                      className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    />
                    {m.caption && (
                      <div
                        className="absolute inset-x-0 bottom-0 p-4 text-left text-xs sm:text-sm opacity-0 transition-all duration-500 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                        style={{
                          color: "var(--sanctuary-cream)",
                          fontFamily: "var(--font-display)",
                          fontStyle: "italic",
                        }}
                      >
                        {m.caption}
                      </div>
                    )}
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* FINALE */}
        <section className="relative px-6 py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <div className="mx-auto mb-8 h-px w-24" style={{ background: "linear-gradient(90deg, transparent, var(--sanctuary-gold), transparent)" }} />
              <p
                className="text-2xl leading-relaxed sm:text-3xl"
                style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--sanctuary-cream)" }}
              >
                {finale.message}
              </p>
              <p
                className="mt-10 text-xs uppercase tracking-[0.4em]"
                style={{ color: "var(--sanctuary-gold)" }}
              >
                {finale.signature}
              </p>
              <div className="mt-8 inline-flex h-10 w-10 items-center justify-center rounded-full sanctuary-glass">
                <Heart className="h-4 w-4" style={{ color: "var(--sanctuary-gold)" }} />
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prev}
          onNext={next}
        />
      )}
    </div>
  );
}
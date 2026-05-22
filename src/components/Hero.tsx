import { useEffect, useRef } from 'react';

export default function Hero() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const nodes = el.querySelectorAll<HTMLElement>('.reveal');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="home" className="relative w-full overflow-hidden">
      {/* Full-bleed video — Z-Axis cascade layer 0 */}
      <div className="relative min-h-[100dvh] w-full flex items-end">
        <video
          src="https://cdn.scentbazaar.co/mp_.mp4"
          poster="https://i0.wp.com/yachts1.com/wp-content/uploads/2025/10/Sanlorenzo-Yachts-scaled.jpg?fit=2560%2C1917&ssl=1"
          autoPlay
          loop
          muted
          playsInline
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center scale-[1.02]"
        />

        {/* Multi-layer gradient — deeper, more editorial */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a120b] via-[#1a120b]/50 to-[#1a120b]/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a120b]/60 via-transparent to-transparent" />

        {/* Warm ambient glow at bottom */}
        <div className="absolute bottom-0 left-0 w-[60%] h-[40%] bg-brand-gold/5 blur-[100px] pointer-events-none" />

        {/* Hero content — Editorial Split on desktop */}
        <div ref={contentRef} className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pb-20 md:pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">

            {/* Left — Massive editorial typography */}
            <div>
              {/* Eyebrow */}
              <div className="reveal" style={{ transitionDelay: '100ms' }}>
                <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white/70 text-[9px] uppercase tracking-[0.25em] font-semibold px-3.5 py-1.5 rounded-full font-sans mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
                  Dubai Marina · Est. 2006
                </span>
              </div>

              {/* Headline — Cormorant Garamond at massive scale */}
              <h1
                className="reveal font-display font-light text-white leading-[0.95] text-[clamp(3rem,8vw,6.5rem)] tracking-[-0.02em]"
                style={{ transitionDelay: '200ms' }}
              >
                The Middle
                <br />
                <em className="italic text-brand-gold/90">East's</em>
                <br />
                premier yacht
                <br />
                dealer.
              </h1>

              {/* Divider */}
              <div
                className="reveal gold-rule my-8 w-24"
                style={{ transitionDelay: '300ms' }}
              />

              {/* Sub-copy */}
              <p
                className="reveal text-sm md:text-base text-white/55 font-sans font-normal leading-relaxed max-w-sm"
                style={{ transitionDelay: '380ms' }}
              >
                Sanlorenzo. Princess. Cranchi. Private viewings in Dubai Marina. Custom specifications on request.
              </p>

              {/* CTAs */}
              <div
                className="reveal flex flex-wrap items-center gap-3 mt-10"
                style={{ transitionDelay: '460ms' }}
              >
                {/* Primary CTA — button-in-button */}
                <a
                  href="#yachts-grid"
                  className="group inline-flex items-center gap-3 bg-[#FDFBF7] text-[#1a120b] text-[11px] font-bold uppercase tracking-[0.12em] pl-5 pr-1.5 py-1.5 rounded-full transition-all duration-600 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white active:scale-[0.98]"
                >
                  Browse fleet
                  <span className="w-8 h-8 rounded-full bg-[#1a120b]/8 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 12L12 2M12 2H4M12 2v8" />
                    </svg>
                  </span>
                </a>

                {/* Secondary CTA */}
                <a
                  href="#contact-section"
                  className="group inline-flex items-center gap-3 bg-white/10 border border-white/20 text-white text-[11px] font-bold uppercase tracking-[0.12em] pl-5 pr-1.5 py-1.5 rounded-full transition-all duration-600 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/15 hover:border-white/35 active:scale-[0.98]"
                >
                  Contact a broker
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 10L10 2M10 2H4M10 2v6" />
                    </svg>
                  </span>
                </a>
              </div>
            </div>

            {/* Right — Floating stat cards (Z-Axis cascade) */}
            <div
              className="reveal hidden md:flex flex-col gap-3 items-end"
              style={{ transitionDelay: '300ms' }}
            >
              {/* Card 1 — slightly rotated */}
              <div
                className="bg-white/8 border border-white/12 p-1.5 rounded-[1.5rem] w-64"
                style={{ transform: 'rotate(1.5deg) translateY(-8px)' }}
              >
                <div className="bg-[#FDFBF7]/10 rounded-[calc(1.5rem-0.375rem)] p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 font-sans mb-1">Fleet size</p>
                  <p className="font-display text-5xl font-light text-white leading-none">30+</p>
                  <p className="text-xs text-white/50 mt-1.5 font-sans">Vessels in stock</p>
                </div>
              </div>

              {/* Card 2 — counter-rotation */}
              <div
                className="bg-brand-gold/20 border border-brand-gold/25 p-1.5 rounded-[1.5rem] w-56"
                style={{ transform: 'rotate(-1deg) translateX(8px)' }}
              >
                <div className="bg-brand-gold/10 rounded-[calc(1.5rem-0.375rem)] p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-gold/60 font-sans mb-1">Experience</p>
                  <p className="font-display text-5xl font-light text-white leading-none">19+</p>
                  <p className="text-xs text-white/50 mt-1.5 font-sans">Years in the region</p>
                </div>
              </div>

              {/* Card 3 */}
              <div
                className="bg-white/8 border border-white/12 p-1.5 rounded-[1.5rem] w-60"
                style={{ transform: 'rotate(0.5deg)' }}
              >
                <div className="bg-white/5 rounded-[calc(1.5rem-0.375rem)] p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 font-sans mb-1">Coverage</p>
                  <p className="font-display text-2xl font-light text-white leading-tight">UAE · KSA<br/>Qatar · Oman</p>
                  <p className="text-xs text-white/50 mt-1.5 font-sans">Middle East & beyond</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/60 animate-pulse" />
        </div>
      </div>
    </section>
  );
}

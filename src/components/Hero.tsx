import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const mobileStatsRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const animateCounter = (el: HTMLElement, target: number, suffix: string) => {
    gsap.fromTo(
      { val: 0 },
      { val: target },
      {
        duration: 2.2,
        ease: 'power4.out',
        onUpdate: function () {
          el.textContent = Math.round((this as any)._targets[0].val) + suffix;
        },
      }
    );
  };

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Overlay fade in for cinematic entrance
    tl.from(overlayRef.current, { opacity: 0, duration: 1.2 }, 0);

    // Eyebrow slides + fades
    tl.from(eyebrowRef.current, { y: 32, opacity: 0, duration: 0.55 }, 0.2);

    // Headline words stagger with clip reveal
    const h1 = headlineRef.current;
    if (h1) {
      const words = h1.querySelectorAll<HTMLElement>('.word');
      tl.from(words, {
        y: 80,
        opacity: 0,
        rotationX: -25,
        transformOrigin: 'top center',
        duration: 0.7,
        stagger: 0.055,
        ease: 'power4.out',
    }, 0.32);
    }

    // Rule scales in
    tl.from(ruleRef.current, {
      scaleX: 0,
      opacity: 0,
      duration: 0.45,
      transformOrigin: 'left center',
      ease: 'power3.inOut',
    }, 0.65);

    // Copy
    tl.from(copyRef.current, { y: 24, opacity: 0, duration: 0.55 }, 0.74);

    // CTAs stagger
    tl.from(ctasRef.current?.children ?? [], {
      y: 20,
      opacity: 0,
      duration: 0.48,
      stagger: 0.07,
    }, 0.86);
    tl.set(ctasRef.current?.children ?? [], { opacity: 1, y: 0, clearProps: 'transform' });

    // Stat cards fly in from right
    const statTargets = [
      ...(statsRef.current?.querySelectorAll<HTMLElement>('.stat-card') ?? []),
      ...(mobileStatsRef.current?.querySelectorAll<HTMLElement>('.stat-card') ?? []),
    ];
    if (statTargets.length) {
      tl.from(statTargets, {
        x: 50,
        opacity: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power3.out',
      }, 0.38);
      tl.set(statTargets, { opacity: 1, x: 0, clearProps: 'transform' });
    }

    // Video parallax on scroll
    if (videoRef.current) {
      gsap.to(videoRef.current, {
        y: '22%',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    }

    // Headline subtle upward drift on scroll
    if (headlineRef.current) {
      gsap.to(headlineRef.current, {
        y: -40,
        opacity: 0.6,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '50% top',
          scrub: 1.2,
        },
      });
    }

    // Counter trigger
    const counters = section.querySelectorAll<HTMLElement>('[data-count]');
    counters.forEach((el) => {
      const target = parseInt(el.dataset.count ?? '0', 10);
      const suffix = el.dataset.suffix ?? '';
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => animateCounter(el, target, suffix),
      });
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="home" className="relative w-full overflow-hidden">
      <div className="relative min-h-[100svh] lg:min-h-[100dvh] w-full flex items-center box-border pt-28 pb-16 sm:pt-32 sm:pb-18 md:pt-32 md:pb-18">
        <video
          ref={videoRef}
          src="https://cdn.scentbazaar.co/Video%20Project%204.mp4"
          poster="https://i0.wp.com/yachts1.com/wp-content/uploads/2025/10/Sanlorenzo-Yachts-scaled.jpg?fit=2560%2C1917&ssl=1"
          autoPlay
          loop
          muted
          playsInline
          referrerPolicy="no-referrer"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center scale-[1.12] will-change-transform"
        />

        <div ref={overlayRef} className="absolute inset-0">
          <div className="absolute inset-0 bg-linear-to-t from-[#0c0f14] via-[#0c0f14]/55 to-[#0c0f14]/15" />
          <div className="absolute inset-0 bg-linear-to-r from-[#0c0f14]/70 via-[#0c0f14]/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-[70%] h-[50%] bg-brand-blue/8 blur-[120px] pointer-events-none" />
          <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-brand-blue/5 blur-[100px] pointer-events-none" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.08fr)_minmax(17rem,0.92fr)] gap-10 md:gap-12 lg:gap-16 items-center">

            <div className="max-w-3xl">
              <div ref={eyebrowRef}>
                <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white/70 text-[9px] uppercase tracking-[0.25em] font-semibold px-3.5 py-1.5 rounded-full font-sans mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
                  Dubai Marina · Est. 2006
                </span>
              </div>

              <h1
                ref={headlineRef}
                className="font-display font-light text-white leading-[0.98] text-[clamp(2.65rem,6.6vw,5.35rem)]"
              >
                <span className="word inline-block">The</span>{' '}
                <span className="word inline-block">Middle</span>{' '}
                <br className="sm:hidden" />
                <em className="italic text-brand-blue/90">
                  <span className="word inline-block">East's</span>
                </em>
                <br />
                <span className="word inline-block">premier</span>{' '}
                <span className="word inline-block">yacht</span>
                <br />
                <span className="word inline-block">dealer.</span>
              </h1>

              <div ref={ruleRef} className="blue-rule my-6 md:my-8 w-24" />

              <p ref={copyRef} className="text-sm md:text-base text-white/62 font-sans font-normal leading-relaxed max-w-md">
                Sanlorenzo. Princess. Cranchi. Private viewings in Dubai Marina. Custom specifications on request.
              </p>

              <div ref={ctasRef} className="flex flex-wrap items-center gap-3 mt-7 md:mt-9">
                <a
                  href="#yachts-grid"
                  className="group inline-flex items-center gap-3 bg-[#f0f6fc] text-[#0c0f14] text-[11px] font-bold uppercase tracking-[0.12em] pl-5 pr-1.5 py-1.5 rounded-full transition-all duration-600 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white active:scale-[0.98]"
                >
                  Browse fleet
                  <span className="w-8 h-8 rounded-full bg-[#0c0f14]/8 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 12L12 2M12 2H4M12 2v8" />
                    </svg>
                  </span>
                </a>

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

              {/* Mobile stat strip — visible only below md */}
              <div ref={mobileStatsRef} className="grid md:hidden grid-cols-3 gap-2 mt-8">
                <div className="stat-card min-w-0 bg-white/10 border border-white/15 p-1 rounded-[1rem]">
                  <div className="bg-white/5 rounded-[calc(1rem-0.25rem)] p-3">
                    <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-white/40 font-sans mb-1">Fleet</p>
                    <p className="font-display text-3xl font-light text-white leading-none" data-count="30" data-suffix="+">30+</p>
                    <p className="text-[9px] text-white/45 mt-1 font-sans leading-tight">In stock</p>
                  </div>
                </div>
                <div className="stat-card min-w-0 bg-brand-blue/20 border border-brand-blue/25 p-1 rounded-[1rem]">
                  <div className="bg-brand-blue/10 rounded-[calc(1rem-0.25rem)] p-3">
                    <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-brand-blue/60 font-sans mb-1">Years</p>
                    <p className="font-display text-3xl font-light text-white leading-none" data-count="19" data-suffix="+">19+</p>
                    <p className="text-[9px] text-white/45 mt-1 font-sans leading-tight">Region</p>
                  </div>
                </div>
                <div className="stat-card min-w-0 bg-white/10 border border-white/15 p-1 rounded-[1rem]">
                  <div className="bg-white/5 rounded-[calc(1rem-0.25rem)] p-3">
                    <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-white/40 font-sans mb-1">Area</p>
                    <p className="font-display text-xl font-light text-white leading-none">GCC</p>
                    <p className="text-[9px] text-white/45 mt-1 font-sans leading-tight">Coverage</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop stat cards */}
            <div ref={statsRef} className="hidden md:flex flex-col gap-3 items-end justify-center pr-2 lg:pr-4">
              <div
                className="stat-card bg-white/8 border border-white/12 p-1.5 rounded-[1.5rem] w-64"
                style={{ transform: 'rotate(1.5deg) translateY(-8px)' }}
              >
                <div className="bg-[#f0f6fc]/10 rounded-[calc(1.5rem-0.375rem)] p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 font-sans mb-1">Fleet size</p>
                  <p
                    className="font-display text-5xl font-light text-white leading-none"
                    data-count="30"
                    data-suffix="+"
                  >
                    30+
                  </p>
                  <p className="text-xs text-white/50 mt-1.5 font-sans">Vessels in stock</p>
                </div>
              </div>

              <div
                className="stat-card bg-brand-blue/20 border border-brand-blue/25 p-1.5 rounded-[1.5rem] w-56"
                style={{ transform: 'rotate(-1deg) translateX(8px)' }}
              >
                <div className="bg-brand-blue/10 rounded-[calc(1.5rem-0.375rem)] p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-blue/60 font-sans mb-1">Experience</p>
                  <p
                    className="font-display text-5xl font-light text-white leading-none"
                    data-count="19"
                    data-suffix="+"
                  >
                    19+
                  </p>
                  <p className="text-xs text-white/50 mt-1.5 font-sans">Years in the region</p>
                </div>
              </div>

              <div
                className="stat-card bg-white/8 border border-white/12 p-1.5 rounded-[1.5rem] w-60"
                style={{ transform: 'rotate(0.5deg)' }}
              >
                <div className="bg-white/5 rounded-[calc(1.5rem-0.375rem)] p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 font-sans mb-1">Coverage</p>
                  <p className="font-display text-2xl font-light text-white leading-tight">UAE · KSA<br />Qatar · Oman</p>
                  <p className="text-xs text-white/50 mt-1.5 font-sans">Middle East & beyond</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

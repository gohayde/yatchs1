import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const ITEMS = [
  { text: 'Sanlorenzo', accent: false },
  { text: 'Princess', accent: false },
  { text: 'Cranchi', accent: false },
  { text: 'Dubai Marina', accent: true },
  { text: 'Est. 2006', accent: false },
  { text: 'Private Viewings', accent: true },
  { text: 'UAE · KSA · Qatar · Oman', accent: false },
  { text: '30+ Vessels', accent: true },
  { text: 'Sanlorenzo', accent: false },
  { text: 'Princess', accent: false },
  { text: 'Cranchi', accent: false },
  { text: 'Dubai Marina', accent: true },
  { text: 'Est. 2006', accent: false },
  { text: 'Private Viewings', accent: true },
  { text: 'UAE · KSA · Qatar · Oman', accent: false },
  { text: '30+ Vessels', accent: true },
];

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const totalWidth = track.scrollWidth / 2;
    tweenRef.current = gsap.to(track, {
      x: -totalWidth,
      duration: 32,
      ease: 'none',
      repeat: -1,
    });
    return () => { tweenRef.current?.kill(); };
  }, []);

  const pause = () => tweenRef.current?.pause();
  const resume = () => tweenRef.current?.resume();

  return (
    <div
      className="w-full overflow-hidden border-y border-[#0c0f14]/10 bg-[#0c0f14] py-4 cursor-default select-none"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div ref={trackRef} className="flex items-center gap-0 whitespace-nowrap will-change-transform">
        {ITEMS.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-7 px-7">
            <span className={`text-[11px] font-bold uppercase tracking-[0.25em] font-sans ${item.accent ? 'text-brand-blue' : 'text-white/40'}`}>
              {item.text}
            </span>
            <span className={`w-1 h-1 rounded-full shrink-0 ${item.accent ? 'bg-brand-blue/60' : 'bg-white/20'}`} />
          </span>
        ))}
      </div>
    </div>
  );
}

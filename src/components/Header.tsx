import { useState, useEffect } from 'react';

interface HeaderProps {
  activeBrand: string;
  setActiveBrand: (brand: string) => void;
  onNavigateToSection?: (sectionId: string) => void;
}

export default function Header({ activeBrand, setActiveBrand, onNavigateToSection }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Fleet', id: 'yachts-grid' },
    { name: 'Sanlorenzo', brandFilter: 'SANLORENZO' },
    { name: 'Princess', brandFilter: 'PRINCESS' },
    { name: 'Cranchi', brandFilter: 'CRANCHI' },
    { name: 'Tenders', id: 'contact-section' },
    { name: 'Contact', id: 'contact-section' },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    setIsMobileMenuOpen(false);
    if (item.brandFilter) {
      setActiveBrand(item.brandFilter);
      document.getElementById('yachts-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (item.id) {
      if (onNavigateToSection) onNavigateToSection(item.id);
      else document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <a href="#yachts-grid" className="skip-link">Skip to content</a>

      {/* Floating island nav */}
      <header className="fixed top-0 left-0 right-0 z-[60] flex flex-col items-center pt-5 pointer-events-none">
        {/* Main pill */}
        <div
          className={`pointer-events-auto mx-auto w-[calc(100%-2rem)] max-w-5xl transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            isScrolled
              ? 'bg-[#FDFBF7]/92 backdrop-blur-2xl shadow-[0_8px_32px_-8px_rgba(26,18,11,0.14),0_1px_0_rgba(26,18,11,0.06)]'
              : 'bg-[#FDFBF7]/80 backdrop-blur-xl shadow-[0_4px_24px_-4px_rgba(26,18,11,0.1)]'
          } rounded-full border border-[#1a120b]/8 px-2 py-1.5`}
        >
          <div className="flex items-center justify-between gap-4 px-2">
            {/* Logo */}
            <button
              onClick={() => setActiveBrand('')}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded-full flex-shrink-0"
              aria-label="Yachts1 home"
            >
              <img
                src="https://i0.wp.com/yachts1.com/wp-content/uploads/2024/11/Y1_Yachts1_Logo_Small.png?fit=1190%2C606&ssl=1"
                alt="Yachts1"
                className="h-8 md:h-9 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </button>

            {/* Desktop nav links */}
            <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
              {navItems.map((item, idx) => {
                const isActive = item.brandFilter && activeBrand === item.brandFilter;
                return (
                  <button
                    key={idx}
                    onClick={() => handleNavClick(item)}
                    className={`relative text-[11px] font-semibold tracking-[0.07em] uppercase py-2 px-3.5 rounded-full cursor-pointer whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                      isActive
                        ? 'text-[#1a120b] bg-brand-gold/15'
                        : 'text-[#1a120b]/60 hover:text-[#1a120b] hover:bg-[#1a120b]/5'
                    }`}
                  >
                    {item.name}
                    {isActive && (
                      <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-gold" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right side CTAs */}
            <div className="hidden lg:flex items-center gap-2">
              <a
                href="tel:+971509955700"
                className="text-[11px] font-semibold text-[#1a120b]/60 hover:text-[#1a120b] tracking-wider uppercase transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] px-3 py-2"
              >
                +971 50 995 5700
              </a>
              <button
                onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="group inline-flex items-center gap-2 bg-[#1a120b] text-[#FDFBF7] text-[11px] font-bold uppercase tracking-[0.1em] pl-4 pr-1.5 py-1.5 rounded-full cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-brand-espresso active:scale-[0.98]"
              >
                Enquire
                <span className="w-6 h-6 rounded-full bg-[#FDFBF7]/15 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 10L10 2M10 2H4M10 2v6" />
                  </svg>
                </span>
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded-full"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              <span
                className={`block w-5 h-px bg-[#1a120b] origin-center transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-[6px]' : ''
                }`}
              />
              <span
                className={`block w-5 h-px bg-[#1a120b] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  isMobileMenuOpen ? 'opacity-0 scale-x-0' : ''
                }`}
              />
              <span
                className={`block w-5 h-px bg-[#1a120b] origin-center transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-[6px]' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Brand filter strip — below pill */}
        <div className={`pointer-events-auto mt-2 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex items-center gap-1.5 bg-[#FDFBF7]/90 backdrop-blur-xl border border-[#1a120b]/8 rounded-full px-3 py-1.5 shadow-[0_2px_12px_-2px_rgba(26,18,11,0.1)]">
            {(['SANLORENZO', 'PRINCESS', 'CRANCHI'] as const).map((brand) => (
              <button
                key={brand}
                onClick={() => setActiveBrand(activeBrand === brand ? '' : brand)}
                className={`text-[9px] font-bold tracking-[0.15em] uppercase py-1 px-3 rounded-full cursor-pointer transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  activeBrand === brand
                    ? 'bg-brand-gold text-white shadow-[0_2px_8px_rgba(184,150,90,0.35)]'
                    : 'text-[#1a120b]/50 hover:text-[#1a120b] hover:bg-[#1a120b]/5'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Full-screen mobile overlay */}
      <div
        className={`fixed inset-0 z-[55] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } bg-[#FDFBF7]/95 backdrop-blur-3xl flex flex-col justify-center items-center`}
        aria-hidden={!isMobileMenuOpen}
      >
        <nav className="flex flex-col items-center gap-2 w-full px-8">
          {navItems.map((item, idx) => {
            const isActive = item.brandFilter && activeBrand === item.brandFilter;
            return (
              <button
                key={idx}
                onClick={() => handleNavClick(item)}
                className={`w-full text-center transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] cursor-pointer py-4 border-b border-[#1a120b]/8 font-display text-4xl font-light tracking-tight ${
                  isMobileMenuOpen
                    ? 'opacity-100 translate-y-0 blur-none'
                    : 'opacity-0 translate-y-8 blur-sm'
                } ${isActive ? 'text-brand-gold' : 'text-[#1a120b]/80 hover:text-[#1a120b]'}`}
                style={{ transitionDelay: isMobileMenuOpen ? `${idx * 60 + 100}ms` : '0ms' }}
              >
                {item.name}
              </button>
            );
          })}
        </nav>

        <div
          className={`mt-10 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: isMobileMenuOpen ? '500ms' : '0ms' }}
        >
          <a
            href="tel:+971509955700"
            className="font-mono text-sm tracking-wider text-[#1a120b]/50"
          >
            +971 50 995 5700
          </a>
        </div>
      </div>
    </>
  );
}

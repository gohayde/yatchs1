import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { YACHTS_DATA } from '../data/yachts';
import { Yacht } from '../types';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

interface YachtGridProps {
  activeBrand: string;
  setActiveBrand: (brand: string) => void;
  onSelectYacht?: (yacht: Yacht) => void;
}

export default function YachtGrid({ activeBrand, setActiveBrand, onSelectYacht }: YachtGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYacht, setSelectedYacht] = useState<Yacht | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const filteredYachts = useMemo(() => {
    return YACHTS_DATA.filter((yacht) => {
      const matchesBrand = activeBrand ? yacht.brand === activeBrand : true;
      const matchesQuery = searchQuery
        ? yacht.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          yacht.engines.toLowerCase().includes(searchQuery.toLowerCase()) ||
          yacht.brand.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchesBrand && matchesQuery;
    });
  }, [activeBrand, searchQuery]);

  // Scroll reveal for section header
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const nodes = section.querySelectorAll<HTMLElement>('.reveal');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { (e.target as HTMLElement).classList.add('is-visible'); obs.unobserve(e.target); }
      }),
      { threshold: 0.1 }
    );
    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);

  const handleOpenInquiry = (yacht: Yacht) => {
    setSelectedYacht(yacht);
    setShowModal(true);
    setInquirySubmitted(false);
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail || !selectedYacht) return;

    const payload = {
      name: inquiryName, email: inquiryEmail, phone: inquiryPhone,
      yacht_id: selectedYacht.id, yacht_name: selectedYacht.name,
      timestamp: new Date().toISOString()
    };

    const submissions = JSON.parse(localStorage.getItem('yachts1_inquiries') || '[]');
    submissions.push({ ...payload, type: 'yacht_inquiry' });
    localStorage.setItem('yachts1_inquiries', JSON.stringify(submissions));

    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          await supabase.from('inquiries').insert([{
            name: payload.name, email: payload.email, phone: payload.phone,
            yacht_id: payload.yacht_id, yacht_name: payload.yacht_name,
            country: 'Detail Inquiry',
            message: `Requested price/brochure for ${payload.yacht_name}`
          }]);
        } catch (err) { console.error(err); }
      }
    }

    setInquirySubmitted(true);
    setTimeout(() => {
      setShowModal(false);
      setInquiryName(''); setInquiryEmail(''); setInquiryPhone('');
    }, 3000);
  };

  return (
    <section
      ref={sectionRef}
      id="yachts-grid"
      className="w-full py-28 md:py-36 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* Section header */}
        <div className="mb-16 md:mb-20 flex flex-col md:flex-row gap-8 md:items-end justify-between">
          <div>
            <div className="reveal" style={{ transitionDelay: '0ms' }}>
              <span className="inline-flex items-center gap-2 bg-brand-gold/12 border border-brand-gold/20 text-brand-gold text-[9px] uppercase tracking-[0.25em] font-bold px-3.5 py-1.5 rounded-full font-sans mb-5">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 8h2m8 0h2M8 2v2m0 8v2M4.5 4.5l1.4 1.4m4.2 4.2l1.4 1.4M4.5 11.5l1.4-1.4m4.2-4.2l1.4-1.4" />
                </svg>
                {activeBrand ? `${activeBrand} collection` : 'Complete fleet'}
              </span>
            </div>
            <h2
              className="reveal font-display font-light text-[#0c0f14] leading-[0.95] text-[clamp(2.5rem,5vw,4rem)] tracking-[-0.02em]"
              style={{ transitionDelay: '80ms' }}
            >
              {filteredYachts.length} {filteredYachts.length === 1 ? 'vessel' : 'vessels'}
              <br />
              <em className="italic text-brand-gold/80">available</em>
            </h2>
          </div>

          <div
            className="reveal flex items-center gap-3 w-full md:w-auto"
            style={{ transitionDelay: '160ms' }}
          >
            {/* Search — Double-Bezel input */}
            <div className="relative flex-1 md:w-72 bg-[#0c0f14]/4 border border-[#0c0f14]/8 rounded-full p-0.5">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search by model or engine..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#f0f6fc] rounded-full py-2.5 pl-9 pr-4 text-[11px] font-sans text-[#0c0f14] focus:outline-none focus:ring-2 focus:ring-brand-gold/30 transition-all placeholder:text-[#0c0f14]/35 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]"
                />
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#0c0f14]/30 pointer-events-none" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 10.5l3 3M7 12A5 5 0 107 2a5 5 0 000 10z" />
                </svg>
              </div>
            </div>

            {(activeBrand || searchQuery) && (
              <button
                onClick={() => { setActiveBrand(''); setSearchQuery(''); }}
                className="text-[10px] font-bold text-[#0c0f14]/50 hover:text-[#0c0f14] uppercase tracking-wider py-2.5 px-4 bg-[#0c0f14]/5 border border-[#0c0f14]/8 rounded-full hover:bg-[#0c0f14]/10 transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] whitespace-nowrap cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Yacht grid — Asymmetrical Bento on lg+ */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredYachts.map((yacht, index) => (
              <motion.article
                layout
                initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
                transition={{ duration: 0.55, delay: Math.min(index * 0.05, 0.25), ease: [0.32, 0.72, 0, 1] }}
                key={yacht.id}
                className={`card-lift group cursor-pointer ${
                  index % 7 === 0 ? 'md:col-span-2' : ''
                }`}
                onClick={() => handleOpenInquiry(yacht)}
              >
                {/* Outer shell — Double-Bezel */}
                <div className="bg-[#0c0f14]/[0.03] border border-[#0c0f14]/8 p-1.5 rounded-[2rem] h-full">
                  {/* Inner core */}
                  <div className="bg-[#f0f6fc] rounded-[calc(2rem-0.375rem)] overflow-hidden h-full flex flex-col shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]">

                    {/* Image */}
                    <div className={`relative overflow-hidden bg-brand-sand ${index % 7 === 0 ? 'aspect-[21/9]' : 'aspect-[16/10]'}`}>
                      <img
                        src={yacht.image}
                        alt={`${yacht.brand} ${yacht.name}`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.05]"
                        referrerPolicy="no-referrer"
                      />
                      {/* Image overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f14]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Brand pill */}
                      <div className="absolute top-4 left-4 bg-[#0c0f14]/70 text-white text-[8px] uppercase tracking-[0.18em] font-bold py-1 px-3 rounded-full font-sans">
                        {yacht.brand}
                      </div>

                      {/* Available dot */}
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#0c0f14]/60 text-emerald-400 text-[8px] uppercase tracking-[0.12em] font-bold py-1 px-2.5 rounded-full font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.9)]" />
                        In stock
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-5 md:p-6 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-display font-light text-[#0c0f14] text-xl md:text-2xl leading-tight tracking-tight group-hover:text-brand-gold transition-colors duration-400 ease-[cubic-bezier(0.32,0.72,0,1)]">
                          {yacht.name}
                        </h3>
                        <span className="text-[10px] font-bold text-[#0c0f14]/35 uppercase tracking-wider font-sans mt-1">
                          Price on request
                        </span>
                      </div>

                      {/* Gold rule */}
                      <div className="gold-rule mb-4" />

                      {/* Specs grid */}
                      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs tabular">
                        {[
                          { label: 'Length', value: yacht.loa },
                          { label: 'Beam', value: yacht.beam },
                          { label: 'Speed', value: yacht.speed },
                          { label: 'Engines', value: yacht.engines },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <dt className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#0c0f14]/35 font-sans mb-0.5">{label}</dt>
                            <dd className="font-sans font-semibold text-[#0c0f14]/80 text-[11px] truncate">{value}</dd>
                          </div>
                        ))}
                      </dl>

                      {/* CTA row */}
                      <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#0c0f14]/6">
                        <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-700/80 font-sans">
                          Available for viewing
                        </span>
                        <span className="group-hover:text-brand-gold text-[#0c0f14]/30 transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)]">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13L13 3M13 3H5M13 3v8" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredYachts.length === 0 && (
          <div className="py-36 text-center max-w-sm mx-auto">
            <div className="w-16 h-16 bg-[#0c0f14]/5 border border-[#0c0f14]/8 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6">
              <svg className="w-7 h-7 text-[#0c0f14]/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12V8a2 2 0 00-2-2H6a2 2 0 00-2 2v4m16 0v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4m16 0H4M12 6v6m0 0l-2-2m2 2l2-2" />
              </svg>
            </div>
            <p className="font-display font-light text-2xl text-[#0c0f14]/80 mb-2">No vessels found</p>
            <p className="text-sm text-[#0c0f14]/45 font-sans mb-8 leading-relaxed">We have 30 luxury yachts ready for viewing in Dubai Marina. Reset to browse the full catalogue.</p>
            <button
              onClick={() => { setActiveBrand(''); setSearchQuery(''); }}
              className="group inline-flex items-center gap-3 bg-[#0c0f14] text-[#f0f6fc] text-[11px] font-bold uppercase tracking-[0.12em] pl-5 pr-1.5 py-1.5 rounded-full cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-brand-espresso active:scale-[0.98]"
            >
              View all yachts
              <span className="w-8 h-8 rounded-full bg-[#f0f6fc]/15 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 12L12 2M12 2H4M12 2v8" />
                </svg>
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Inquiry modal */}
      <AnimatePresence>
        {showModal && selectedYacht && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-[70] flex items-end md:items-center justify-center p-0 md:p-6 bg-[#0c0f14]/60 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label={`Inquiry for ${selectedYacht.name}`}
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              className="w-full max-w-lg"
            >
              {/* Outer shell */}
              <div className="bg-[#0c0f14]/5 border border-[#0c0f14]/12 p-1.5 rounded-[2rem] md:rounded-[2rem] rounded-b-none md:rounded-b-[2rem]">
                {/* Inner core */}
                <div className="bg-[#f0f6fc] rounded-[calc(2rem-0.375rem)] md:rounded-[calc(2rem-0.375rem)] rounded-b-none md:rounded-b-[calc(2rem-0.375rem)] overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]">

                  {/* Modal image */}
                  <div className="relative h-44 bg-brand-espresso overflow-hidden">
                    <img
                      src={selectedYacht.image}
                      alt={selectedYacht.name}
                      className="w-full h-full object-cover opacity-75"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f14]/90 via-[#0c0f14]/30 to-transparent" />

                    <button
                      onClick={() => setShowModal(false)}
                      className="absolute top-4 right-4 w-8 h-8 bg-[#0c0f14]/50 hover:bg-[#0c0f14]/75 text-white rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer"
                      aria-label="Close"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2 12L12 2M2 2l10 10" />
                      </svg>
                    </button>

                    <div className="absolute bottom-5 left-5">
                      <span className="inline-block bg-brand-gold text-white text-[8px] font-black tracking-[0.18em] uppercase px-2.5 py-1 rounded-full font-sans mb-2">
                        {selectedYacht.brand}
                      </span>
                      <h3 className="font-display font-light text-white text-2xl leading-tight">
                        {selectedYacht.name}
                      </h3>
                    </div>
                  </div>

                  {/* Modal body */}
                  <div className="p-6">
                    {inquirySubmitted ? (
                      <div className="py-10 text-center space-y-4">
                        <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-[1rem] flex items-center justify-center mx-auto">
                          <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 10l4 4 8-8" />
                          </svg>
                        </div>
                        <h4 className="font-display font-light text-xl text-[#0c0f14]">Inquiry received</h4>
                        <p className="text-sm text-[#0c0f14]/50 font-sans max-w-xs mx-auto leading-relaxed">
                          A broker will prepare your private specifications sheet and reach out within 2 hours.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleInquirySubmit} className="space-y-4" noValidate>
                        {/* Quick specs */}
                        <div className="grid grid-cols-4 gap-2 bg-[#0c0f14]/[0.03] border border-[#0c0f14]/6 p-3.5 rounded-2xl tabular">
                          {[
                            { label: 'Length', value: selectedYacht.loa },
                            { label: 'Beam', value: selectedYacht.beam },
                            { label: 'Speed', value: selectedYacht.speed },
                            { label: 'Engines', value: selectedYacht.engines },
                          ].map(({ label, value }) => (
                            <div key={label} className="text-center">
                              <dt className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#0c0f14]/35 font-sans">{label}</dt>
                              <dd className="font-sans font-semibold text-[#0c0f14]/80 text-[10px] truncate mt-0.5">{value}</dd>
                            </div>
                          ))}
                        </div>

                        {/* Fields */}
                        <div className="space-y-2.5">
                          {[
                            { id: 'inquiry-name', type: 'text', label: 'Full name', required: true, placeholder: 'Mohammed Al Rashidi', value: inquiryName, onChange: setInquiryName },
                            { id: 'inquiry-email', type: 'email', label: 'Email address', required: true, placeholder: 'm.rashidi@example.ae', value: inquiryEmail, onChange: setInquiryEmail },
                            { id: 'inquiry-phone', type: 'tel', label: 'WhatsApp / Mobile', required: false, placeholder: '+971 50 847 2193', value: inquiryPhone, onChange: setInquiryPhone },
                          ].map(({ id, type, label, required, placeholder, value, onChange }) => (
                            <div key={id}>
                              <label htmlFor={id} className="block text-[9px] font-bold text-[#0c0f14]/45 uppercase tracking-[0.15em] font-sans mb-1.5">
                                {label}{required && <span className="text-brand-gold ml-1">*</span>}
                              </label>
                              <div className="bg-[#0c0f14]/[0.03] border border-[#0c0f14]/8 p-0.5 rounded-xl">
                                <input
                                  id={id}
                                  type={type}
                                  required={required}
                                  value={value}
                                  onChange={(e) => onChange(e.target.value)}
                                  placeholder={placeholder}
                                  className="w-full bg-[#f0f6fc] rounded-[calc(0.75rem-0.125rem)] px-3.5 py-2.5 text-sm font-sans text-[#0c0f14] focus:outline-none focus:ring-2 focus:ring-brand-gold/25 transition-all placeholder:text-[#0c0f14]/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]"
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          type="submit"
                          className="group w-full inline-flex items-center justify-between bg-[#0c0f14] text-[#f0f6fc] text-[11px] font-bold uppercase tracking-[0.12em] pl-5 pr-1.5 py-1.5 rounded-full cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-brand-espresso active:scale-[0.98] mt-1"
                        >
                          Request price & brochure
                          <span className="w-9 h-9 rounded-full bg-[#f0f6fc]/12 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2 12L12 2M12 2H4M12 2v8" />
                            </svg>
                          </span>
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

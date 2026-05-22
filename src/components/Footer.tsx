import React, { useState, useEffect, useRef } from 'react';
import { ContactFormInput, SubscriptionInput } from '../types';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

export default function Footer() {
  const [subEmail, setSubEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'success' | 'checking'>('idle');
  const [formData, setFormData] = useState<ContactFormInput>({ name: '', email: '', phone: '', country: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    const nodes = footer.querySelectorAll<HTMLElement>('.reveal');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { (e.target as HTMLElement).classList.add('is-visible'); obs.unobserve(e.target); }
      }),
      { threshold: 0.1 }
    );
    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail) return;
    setSubStatus('checking');
    localStorage.setItem('yachts1_subscriber', subEmail);
    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try { await supabase.from('subscribers').insert([{ email: subEmail, created_at: new Date().toISOString() }]); }
        catch (err) { console.error(err); }
      }
    }
    setTimeout(() => { setSubStatus('success'); setTimeout(() => { setSubEmail(''); setSubStatus('idle'); }, 3500); }, 900);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) { setFormStatus('error'); return; }
    setFormStatus('sending');
    const payload = { ...formData, timestamp: new Date().toISOString() };
    const submissions = JSON.parse(localStorage.getItem('yachts1_inquiries') || '[]');
    submissions.push({ ...payload, type: 'footer_contact' });
    localStorage.setItem('yachts1_inquiries', JSON.stringify(submissions));
    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try { await supabase.from('inquiries').insert([{ name: payload.name, email: payload.email, phone: payload.phone, country: payload.country, message: payload.message, yacht_id: 'general', yacht_name: 'General Contact' }]); }
        catch (err) { console.error(err); }
      }
    }
    setTimeout(() => {
      setFormStatus('success');
      setTimeout(() => { setFormData({ name: '', email: '', phone: '', country: '', message: '' }); setFormStatus('idle'); }, 3500);
    }, 1400);
  };

  return (
    <footer ref={footerRef} className="w-full font-sans">

      {/* About — warm cream, editorial split */}
      <section className="bg-brand-sand border-t border-[#1a120b]/8">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-28 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            <div className="reveal space-y-6">
              <span className="inline-flex items-center gap-2 bg-brand-gold/12 border border-brand-gold/20 text-brand-gold text-[9px] uppercase tracking-[0.25em] font-bold px-3.5 py-1.5 rounded-full">
                About Yachts1
              </span>
              <h3 className="font-display font-light text-[#1a120b] text-4xl md:text-5xl leading-[0.95] tracking-tight">
                Buy your next<br /><em className="italic text-brand-gold/80">yacht</em> with us.
              </h3>
              <p className="text-sm leading-relaxed text-[#1a120b]/55 max-w-prose">
                Yachts1 brings decades of experience in yacht sales, management, and after-sales support across the Middle East. Whether you're buying a yacht in Dubai, Qatar, KSA, Oman, or the Maldives, our brokers ensure a professional experience from first viewing to handover.
              </p>
            </div>

            <div className="reveal space-y-6" style={{ transitionDelay: '100ms' }}>
              <div className="gold-rule" />
              <h3 className="font-display font-light text-[#1a120b] text-3xl leading-tight tracking-tight">
                Sanlorenzo, Princess,<br />Cranchi — <em className="italic">and more.</em>
              </h3>
              <p className="text-sm leading-relaxed text-[#1a120b]/55 max-w-prose">
                We offer a curated selection of new and pre-owned yachts from the world's leading shipyards. Our team assists at every stage — inspection, documentation, insurance, registration, and crew placement.
              </p>
              <p className="text-xs leading-relaxed text-[#1a120b]/35 italic font-light">
                Your trusted partner for luxury yacht ownership in the UAE and across the region.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe — dark espresso band */}
      <section className="bg-brand-espresso py-28 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="reveal grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 bg-brand-gold/15 border border-brand-gold/25 text-brand-gold text-[9px] uppercase tracking-[0.25em] font-bold px-3.5 py-1.5 rounded-full mb-5">
                Broker network
              </span>
              <h3 className="font-display font-light text-white text-4xl md:text-5xl leading-[0.95] tracking-tight">
                Private listings,<br /><em className="italic text-brand-gold/80">first.</em>
              </h3>
              <p className="mt-4 text-sm text-white/45 font-normal leading-relaxed max-w-sm">
                Join our broker network for early access to new builds and off-market yachts.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-3">
              {/* Double-bezel input */}
              <div className="bg-white/5 border border-white/10 p-1 rounded-2xl">
                <input
                  type="email"
                  required
                  value={subEmail}
                  onChange={(e) => setSubEmail(e.target.value)}
                  placeholder="your@email.com"
                  disabled={subStatus !== 'idle'}
                  className="w-full bg-white/8 rounded-[calc(1rem-0.25rem)] px-4 py-3.5 text-sm font-sans text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-brand-gold/30 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                />
              </div>
              <button
                type="submit"
                disabled={subStatus !== 'idle'}
                className="group w-full inline-flex items-center justify-between bg-brand-gold hover:bg-brand-gold/90 disabled:opacity-60 text-white text-[11px] font-bold uppercase tracking-[0.12em] pl-5 pr-1.5 py-1.5 rounded-full cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
              >
                {subStatus === 'checking' ? 'Saving...' : subStatus === 'success' ? 'Subscribed ✓' : 'Subscribe to private listings'}
                <span className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 12L12 2M12 2H4M12 2v8" />
                  </svg>
                </span>
              </button>
              {subStatus === 'success' && (
                <p className="text-xs text-emerald-400 font-semibold">Subscribed. Private broker updates will follow.</p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Contact section */}
      <section id="contact-section" className="bg-[#FDFBF7] border-t border-[#1a120b]/8 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-28 md:py-32">

          {/* Section label */}
          <div className="reveal mb-16">
            <span className="inline-flex items-center gap-2 bg-brand-gold/12 border border-brand-gold/20 text-brand-gold text-[9px] uppercase tracking-[0.25em] font-bold px-3.5 py-1.5 rounded-full mb-5">
              Get in touch
            </span>
            <h2 className="font-display font-light text-[#1a120b] text-4xl md:text-5xl leading-[0.95] tracking-tight">
              Speak to a<br /><em className="italic text-brand-gold/80">broker.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Col 1: Contact details */}
            <div className="reveal space-y-8" style={{ transitionDelay: '80ms' }}>
              {/* Address */}
              <div className="bg-[#1a120b]/[0.03] border border-[#1a120b]/8 p-1.5 rounded-[2rem]">
                <div className="bg-[#FDFBF7] rounded-[calc(2rem-0.375rem)] p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] space-y-4">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-gold font-sans">Location</p>
                  <div className="space-y-1">
                    <p className="font-semibold text-[#1a120b] text-sm">Yachts One LLC</p>
                    <p className="text-sm text-[#1a120b]/55">Dubai Marina Club, WH-453</p>
                    <p className="text-sm text-[#1a120b]/55">P.O.Box 122261, Dubai, UAE</p>
                  </div>
                  <div className="gold-rule" />
                  <div className="space-y-2">
                    <a href="mailto:sales@yachts1.com" className="flex items-center gap-2.5 text-sm text-[#1a120b]/60 hover:text-brand-gold transition-colors duration-300 group">
                      <span className="w-7 h-7 rounded-full bg-[#1a120b]/5 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-gold/10 transition-colors duration-300">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M1 3l6 5 6-5M1 3v8h12V3H1z" />
                        </svg>
                      </span>
                      sales@yachts1.com
                    </a>
                    <a href="tel:+971509955700" className="flex items-center gap-2.5 text-sm text-[#1a120b]/60 hover:text-brand-gold transition-colors duration-300 group">
                      <span className="w-7 h-7 rounded-full bg-[#1a120b]/5 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-gold/10 transition-colors duration-300">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2 2l2.5 1L5.5 5 4 6.5s1 2.5 3.5 3.5L9 8.5l2 1L12 12c-5.5 2-12-4.5-10-10z" />
                        </svg>
                      </span>
                      +971 50 995 5700
                    </a>
                    <a href="tel:+97144563333" className="flex items-center gap-2.5 text-sm text-[#1a120b]/60 hover:text-brand-gold transition-colors duration-300 group">
                      <span className="w-7 h-7 rounded-full bg-[#1a120b]/5 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-gold/10 transition-colors duration-300">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2 2l2.5 1L5.5 5 4 6.5s1 2.5 3.5 3.5L9 8.5l2 1L12 12c-5.5 2-12-4.5-10-10z" />
                        </svg>
                      </span>
                      +971 4 456 3333
                    </a>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="flex items-center gap-2">
                {[
                  { label: 'Facebook', path: 'M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z' },
                  { label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                  { label: 'LinkedIn', path: 'M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z' },
                  { label: 'YouTube', path: 'M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z' },
                ].map(({ label, path }) => (
                  <a
                    key={label}
                    href="#"
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className="group w-9 h-9 bg-[#1a120b]/5 border border-[#1a120b]/8 rounded-full flex items-center justify-center text-[#1a120b]/35 hover:text-brand-gold hover:bg-brand-gold/10 hover:border-brand-gold/20 transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)]"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                      <path d={path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2: Map */}
            <div className="reveal" style={{ transitionDelay: '160ms' }}>
              <div className="bg-[#1a120b]/[0.03] border border-[#1a120b]/8 p-1.5 rounded-[2rem] h-full min-h-[280px]">
                <div className="bg-brand-sand rounded-[calc(2rem-0.375rem)] overflow-hidden h-full relative shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]">
                  <iframe
                    title="Yachts1 Dubai Marina location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3613.433433534571!2d55.138244275159195!3d25.086433236151433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f15195e2f750d%3A0xe53a3eb8852e008!2sDubai%20Marina%20Mall!5e0!3m2!1sen!2sae!4v1716381985000!5m2!1sen!2sae"
                    className="w-full h-full min-h-[280px] border-0 grayscale"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="absolute top-4 left-4 bg-[#FDFBF7]/95 border border-[#1a120b]/8 px-3 py-1.5 rounded-full">
                    <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#1a120b]/60">Dubai Marina</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Col 3: Contact form */}
            <div className="reveal" style={{ transitionDelay: '240ms' }}>
              <div className="bg-[#1a120b]/[0.03] border border-[#1a120b]/8 p-1.5 rounded-[2rem] h-full">
                <div className="bg-[#FDFBF7] rounded-[calc(2rem-0.375rem)] p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] space-y-5 h-full">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-gold font-sans">Send an inquiry</p>

                  <form onSubmit={handleContactSubmit} className="space-y-3" noValidate>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { id: 'c-name', type: 'text', placeholder: 'Your name', req: true, val: formData.name, key: 'name' },
                        { id: 'c-email', type: 'email', placeholder: 'Email address', req: true, val: formData.email, key: 'email' },
                        { id: 'c-phone', type: 'tel', placeholder: 'Phone number', req: false, val: formData.phone, key: 'phone' },
                        { id: 'c-country', type: 'text', placeholder: 'Country', req: false, val: formData.country, key: 'country' },
                      ].map(({ id, type, placeholder, req, val, key }) => (
                        <div key={id} className="bg-[#1a120b]/[0.03] border border-[#1a120b]/8 p-0.5 rounded-xl">
                          <input
                            id={id}
                            type={type}
                            required={req}
                            placeholder={placeholder}
                            value={val}
                            onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                            className="w-full bg-[#FDFBF7] rounded-[calc(0.75rem-0.125rem)] px-3 py-2.5 text-xs font-sans text-[#1a120b] focus:outline-none focus:ring-2 focus:ring-brand-gold/25 transition-all placeholder:text-[#1a120b]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="bg-[#1a120b]/[0.03] border border-[#1a120b]/8 p-0.5 rounded-2xl">
                      <textarea
                        id="c-message"
                        required
                        rows={4}
                        placeholder="How can we help?"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-[#FDFBF7] rounded-[calc(1rem-0.125rem)] px-3.5 py-2.5 text-xs font-sans text-[#1a120b] focus:outline-none focus:ring-2 focus:ring-brand-gold/25 transition-all resize-none placeholder:text-[#1a120b]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={formStatus === 'sending'}
                      className="group w-full inline-flex items-center justify-between bg-[#1a120b] hover:bg-brand-espresso disabled:opacity-70 text-[#FDFBF7] text-[11px] font-bold uppercase tracking-[0.12em] pl-5 pr-1.5 py-1.5 rounded-full cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
                    >
                      {formStatus === 'sending' ? 'Sending...' : 'Send message'}
                      <span className="w-9 h-9 rounded-full bg-[#FDFBF7]/12 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M1 7l5.5-5.5L12 7M6.5 1.5V13" />
                        </svg>
                      </span>
                    </button>
                  </form>

                  {formStatus === 'success' && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs rounded-2xl flex items-center gap-2.5 font-sans">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l3.5 3.5 6.5-7" />
                      </svg>
                      Message received. Our team will be in touch shortly.
                    </div>
                  )}
                  {formStatus === 'error' && (
                    <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-2xl flex items-center gap-2.5 font-sans">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5v4m0 2.5v.5M2 8a6 6 0 1012 0A6 6 0 002 8z" />
                      </svg>
                      Please fill in your name, email, and message.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal bar */}
      <section className="bg-brand-espresso border-t border-white/5 py-6 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <img
            src="https://i0.wp.com/yachts1.com/wp-content/uploads/2024/11/Y1_Yachts1_Logo_Small.png?fit=1190%2C606&ssl=1"
            alt="Yachts1"
            className="h-7 w-auto object-contain brightness-0 invert opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-wrap items-center justify-center gap-5 text-[10px] text-white/25 font-sans">
            <a href="#" className="hover:text-white/60 transition-colors duration-300">Privacy policy</a>
            <a href="#" className="hover:text-white/60 transition-colors duration-300">Terms of service</a>
            <span>© 2026 Yachts1.com — All rights reserved</span>
          </div>
        </div>
      </section>
    </footer>
  );
}

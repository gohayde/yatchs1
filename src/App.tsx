import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import YachtGrid from './components/YachtGrid';
import Footer from './components/Footer';
import Floater from './components/Floater';

export default function App() {
  const [activeBrand, setActiveBrand] = useState<string>('');

  const handleNavigateToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-between selection:bg-brand-blue selection:text-white">
      {/* Upper Site Header and Filter Pill tabs */}
      <Header 
        activeBrand={activeBrand} 
        setActiveBrand={setActiveBrand}
        onNavigateToSection={handleNavigateToSection}
      />

      {/* Main content elements */}
      <main className="flex-grow">
        {/* Hero showcase */}
        <Hero />

        {/* Dynamic Interactive Yacht list grid */}
        <YachtGrid 
          activeBrand={activeBrand} 
          setActiveBrand={setActiveBrand} 
        />
      </main>

      {/* Bottom info maps and forms footer */}
      <Footer />

      {/* Embedded WhatsApp/Phone Support floaters */}
      <Floater />
    </div>
  );
}

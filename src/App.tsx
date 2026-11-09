import React, { useState } from 'react';
import { Sparkles, Share2, RotateCcw, Check, Sliders } from 'lucide-react';
import { AgencyProvider, useAgency } from './context/AgencyContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VideoPresentation } from './components/VideoPresentation';
import { FeaturedProduct } from './components/FeaturedProduct';
import { PricingSection } from './components/PricingSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { AboutTeamSection } from './components/AboutTeamSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { OwnerLoginModal } from './components/OwnerLoginModal';
import { OwnerDashboardModal } from './components/OwnerDashboardModal';
import { BusinessCardGeneratorModal } from './components/BusinessCardGeneratorModal';
import { PricingPackage } from './data/agencyData';

function MainContent() {
  const {
    isOwnerLoggedIn,
    logoutOwner,
    siteColors,
    siteTypography,
    isCustomShowcaseActive,
    clearCustomShowcase,
    agencyInfo
  } = useAgency();
  const [selectedPlanForContact, setSelectedPlanForContact] = useState<string>('video-ia');
  const [copiedBannerLink, setCopiedBannerLink] = useState(false);

  // Modals for Owner & Business Card Generator
  const [isOwnerLoginOpen, setIsOwnerLoginOpen] = useState(false);
  const [isOwnerDashboardOpen, setIsOwnerDashboardOpen] = useState(false);
  const [isCardGeneratorOpen, setIsCardGeneratorOpen] = useState(false);

  const scrollToContact = (planId?: string) => {
    if (planId) {
      setSelectedPlanForContact(planId);
    }
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPricing = () => {
    const element = document.getElementById('tarifs');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectPackage = (pkg: PricingPackage) => {
    scrollToContact(pkg.id);
  };

  return (
    <div
      style={{
        backgroundColor: siteColors.bgColor,
        color: siteColors.textColor,
        fontFamily: siteTypography.fontFamily,
        fontSize: `${siteTypography.fontSize}px`,
        fontWeight: siteTypography.fontWeight
      }}
      className="min-h-screen flex flex-col leading-relaxed selection:bg-[#073587] selection:text-white w-full max-w-full overflow-x-hidden"
    >
      {/* Top Banner if viewing a personal customized showcase via shared link */}
      {isCustomShowcaseActive && (
        <div className="bg-amber-400 text-slate-950 px-3 py-2 text-xs font-bold border-b border-amber-500 shadow-xs flex flex-wrap items-center justify-between gap-2 z-50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#073587] shrink-0" />
            <span>
              Vitrine Personnalisée active : <strong>{agencyInfo.name}</strong>
            </span>
            <span className="hidden md:inline-block text-[11px] bg-slate-900/10 px-2 py-0.5 rounded-full font-semibold">
              Vidéo, tarifs et coordonnées personnalisés
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href).then(() => {
                    setCopiedBannerLink(true);
                    setTimeout(() => setCopiedBannerLink(false), 2000);
                  });
                }
              }}
              className="px-2.5 py-1 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-[11px] font-black inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copiedBannerLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3" />}
              <span>{copiedBannerLink ? 'Lien copié !' : 'Copier ce lien'}</span>
            </button>

            {isOwnerLoggedIn ? (
              <button
                onClick={() => setIsOwnerDashboardOpen(true)}
                className="px-2.5 py-1 bg-[#073587] text-white hover:bg-[#05235c] rounded-lg text-[11px] font-black inline-flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Sliders className="w-3 h-3" />
                <span>Modifier dans l'Espace Propriétaire</span>
              </button>
            ) : null}

            <button
              onClick={clearCustomShowcase}
              className="px-2 py-1 text-slate-800 hover:text-slate-950 hover:bg-black/5 rounded-lg text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
              title="Revenir à la version standard Africa Web"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Version standard</span>
            </button>
          </div>
        </div>
      )}
      {/* Navigation (Single-line Main Header) */}
      <Navbar
        onOpenContact={() => scrollToContact()}
        onOpenOwnerDashboard={() => setIsOwnerDashboardOpen(true)}
        onOpenOwnerLogin={() => setIsOwnerLoginOpen(true)}
        onOpenBusinessCardGenerator={() => setIsCardGeneratorOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero
          onExplorePricing={scrollToPricing}
          onOpenContact={(planId) => scrollToContact(planId)}
          onOpenBusinessCardGenerator={() => setIsCardGeneratorOpen(true)}
        />

        {/* Video Presentation Section (Customizable / Togglable by Owner) */}
        <VideoPresentation
          onOpenOwnerDashboard={() => setIsOwnerDashboardOpen(true)}
          onOpenOwnerLogin={() => setIsOwnerLoginOpen(true)}
        />

        {/* Featured Product Section (Guide Culinaire ou Produit Vedette) */}
        <FeaturedProduct />

        {/* Formations & Tarifs Section with Free Business Card Generator Button */}
        <PricingSection
          onSelectPackage={handleSelectPackage}
          onOpenBusinessCardGenerator={() => setIsCardGeneratorOpen(true)}
        />

        {/* Client Testimonials */}
        <TestimonialsSection />

        {/* About & Responsable Section */}
        <AboutTeamSection onOpenContact={() => scrollToContact()} />

        {/* Professional Contact & Inscription Form */}
        <ContactSection initialPlan={selectedPlanForContact} />
      </main>

      {/* Footer with Owner Account Access in the bottom corner */}
      <Footer
        onOpenOwnerLogin={() => setIsOwnerLoginOpen(true)}
        onOpenOwnerDashboard={() => setIsOwnerDashboardOpen(true)}
        onOpenBusinessCardGenerator={() => setIsCardGeneratorOpen(true)}
      />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />

      {/* Free Professional Business Card Generator Modal */}
      <BusinessCardGeneratorModal
        isOpen={isCardGeneratorOpen}
        onClose={() => setIsCardGeneratorOpen(false)}
      />

      {/* Owner Login Modal */}
      <OwnerLoginModal
        isOpen={isOwnerLoginOpen}
        onClose={() => setIsOwnerLoginOpen(false)}
        onSuccess={() => setIsOwnerDashboardOpen(true)}
      />

      {/* Owner Admin Dashboard */}
      <OwnerDashboardModal
        isOpen={isOwnerDashboardOpen}
        onClose={() => setIsOwnerDashboardOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AgencyProvider>
      <MainContent />
    </AgencyProvider>
  );
}

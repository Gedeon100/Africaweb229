import React, { useState } from 'react';
import { Menu, X, MessageCircle, ChevronRight, CreditCard, Share2, Lock, ShieldCheck } from 'lucide-react';
import { useAgency } from '../context/AgencyContext';
import { getWhatsAppUrl } from '../data/agencyData';

interface NavbarProps {
  onOpenContact: (prefillPackage?: string) => void;
  onOpenOwnerDashboard?: () => void;
  onOpenOwnerLogin?: () => void;
  onOpenBusinessCardGenerator?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenContact,
  onOpenOwnerDashboard,
  onOpenOwnerLogin,
  onOpenBusinessCardGenerator
}) => {
  const { agencyInfo, headerConfig, siteColors, trackClick, isOwnerLoggedIn } = useAgency();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter only visible links configured by the owner
  const visibleNavLinks = headerConfig.navLinks.filter(l => l.visible);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs font-sans w-full">
      {/* Main Single-Line Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4 lg:gap-8 max-w-full">
          {/* Zone 1: Logo & Brand Name on one single line */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#hero');
            }}
            className="flex items-center gap-2 sm:gap-2.5 min-w-0 group py-1"
          >
            <img
              src={agencyInfo.logoUrl}
              alt="Africa Web Logo"
              className="h-8 sm:h-11 w-auto object-contain transition-transform group-hover:scale-102 shrink-0"
            />
            <div className="flex items-center gap-1.5 whitespace-nowrap min-w-0">
              <span
                className="text-lg sm:text-2xl font-black tracking-tight leading-none truncate"
                style={{ color: siteColors.primary }}
              >
                {headerConfig.brandTitle}
                <span style={{ color: siteColors.accent }}>{headerConfig.brandHighlight}</span>
              </span>
              <span className="hidden sm:inline-block text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1.5 border-l border-slate-200">
                {headerConfig.brandSubtitle}
              </span>
            </div>
          </a>

          {/* Zone 2: Clean single-line Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs xl:text-sm font-bold text-slate-700 whitespace-nowrap shrink-0">
            {visibleNavLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="hover:text-[#073587] transition-colors py-1.5 hover:opacity-80"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Actions on the same single line */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Quick WhatsApp button */}
            <a
              href={getWhatsAppUrl("Bonjour Africa Web, je souhaite des renseignements sur vos formations.")}
              onClick={() => trackClick('whatsapp')}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-black text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600/30 shrink-0" />
              <span>WhatsApp</span>
            </a>

            {/* Owner Quick Access Button */}
            {isOwnerLoggedIn && onOpenOwnerDashboard && (
              <button
                type="button"
                onClick={onOpenOwnerDashboard}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all whitespace-nowrap cursor-pointer shadow-xs border border-amber-500/50"
                title="Panneau Propriétaire & Personnalisation de Mon Lien"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-950" />
                <span>Mon Lien</span>
              </button>
            )}

            {/* Carte de visite gratuite button */}
            {onOpenBusinessCardGenerator && (
              <button
                type="button"
                onClick={onOpenBusinessCardGenerator}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all whitespace-nowrap cursor-pointer shadow-xs border border-amber-500/40"
              >
                <CreditCard className="w-3.5 h-3.5 text-slate-950" />
                <span>Carte de visite gratuite</span>
              </button>
            )}

            {/* Primary CTA */}
            {headerConfig.showOrderBtn && (
              <button
                onClick={() => {
                  const element = document.getElementById('tarifs');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-black text-white rounded-xl shadow-xs hover:shadow transition-all whitespace-nowrap cursor-pointer hover:opacity-90"
                style={{ backgroundColor: siteColors.primary }}
              >
                <span>Nos Formations</span>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            )}

            {/* Mobile Controls */}
            <div className="flex items-center gap-2 lg:hidden">
              {isOwnerLoggedIn && onOpenOwnerDashboard && (
                <button
                  type="button"
                  onClick={onOpenOwnerDashboard}
                  className="p-2 text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-2xs font-bold"
                  title="Mon Lien"
                  aria-label="Mon Lien"
                >
                  <Share2 className="w-4.5 h-4.5" />
                </button>
              )}

              <a
                href={getWhatsAppUrl()}
                onClick={() => trackClick('whatsapp')}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-2xs"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4.5 h-4.5 fill-white/20" />
              </a>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-300 cursor-pointer"
                aria-label="Menu de navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-6 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2">
            {visibleNavLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="py-2 text-base font-bold text-slate-900 hover:text-[#073587] border-b border-slate-100 last:border-none"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-2 flex flex-col gap-2">
            {/* Mobile Owner Space & Custom Link button */}
            {isOwnerLoggedIn && onOpenOwnerDashboard ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOwnerDashboard();
                }}
                className="w-full py-3 px-4 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer border border-amber-500/50"
              >
                <Share2 className="w-4 h-4 text-slate-950" />
                <span>Mon Espace Propriétaire & Mon Lien</span>
              </button>
            ) : onOpenOwnerLogin ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOwnerLogin();
                }}
                className="w-full py-2.5 px-4 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
              >
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span>Connexion Espace Propriétaire</span>
              </button>
            ) : null}

            {onOpenBusinessCardGenerator && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBusinessCardGenerator();
                }}
                className="w-full py-3 px-4 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer border border-amber-500/40"
              >
                <CreditCard className="w-4 h-4 text-slate-950" />
                <span>Créer ma Carte de Visite Gratuite</span>
              </button>
            )}

            <a
              href={getWhatsAppUrl("Bonjour Africa Web, je souhaite échanger au sujet de vos formations.")}
              onClick={() => trackClick('whatsapp')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white/20" />
              <span>Discuter sur WhatsApp ({agencyInfo.whatsappDisplay})</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

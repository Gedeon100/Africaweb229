import React, { useState } from 'react';
import {
  Check,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Clock,
  ShieldCheck,
  Video,
  FileSpreadsheet,
  Image as ImageIcon,
  Globe,
  Layers,
  Server,
  CreditCard,
  Download
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';
import { getWhatsAppUrl, PricingPackage } from '../data/agencyData';

interface PricingSectionProps {
  onSelectPackage: (pkg: PricingPackage) => void;
  onOpenBusinessCardGenerator?: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onSelectPackage,
  onOpenBusinessCardGenerator
}) => {
  const { pricingPackages, trackClick, siteColors, siteTypography } = useAgency();

  // State for Service 4 option selection (Avec ou Sans Hébergement)
  const [siteWebOption, setSiteWebOption] = useState<'avec-hebergement' | 'sans-hebergement'>('avec-hebergement');

  const getPackageIcon = (id: string) => {
    switch (id) {
      case 'video-ia':
        return <Video className="w-5 h-5 text-amber-500" />;
      case 'produit-digital':
        return <FileSpreadsheet className="w-5 h-5 text-indigo-500" />;
      case 'images-publicitaires':
        return <ImageIcon className="w-5 h-5 text-pink-500" />;
      case 'site-web-pro':
        return <Globe className="w-5 h-5 text-emerald-500" />;
      case 'agent-ia-entreprise':
        return <Sparkles className="w-5 h-5 text-purple-600" />;
      default:
        return <Layers className="w-5 h-5 text-[#073587]" />;
    }
  };

  return (
    <section id="tarifs" className="py-16 sm:py-20 bg-slate-50/80 border-b border-slate-200/80 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider text-[#073587] mb-2.5">
            <span>Catalogue Officiel</span>
            <span aria-hidden="true" className="text-amber-500">·</span>
            <span>Formations & Services Pratiques</span>
          </div>
          <h2
            style={{
              fontFamily: siteTypography.titleFontFamily || siteTypography.fontFamily,
              fontSize: siteTypography.titleFontSize ? `${siteTypography.titleFontSize}px` : undefined,
              fontWeight: siteTypography.titleFontWeight || '900'
            }}
            className="text-2xl sm:text-4xl text-slate-900 tracking-tight leading-tight"
          >
            Des compétences rentables et concrètes pour décoller
          </h2>
          <p
            style={{
              fontFamily: siteTypography.subtitleFontFamily || siteTypography.fontFamily,
              fontSize: siteTypography.subtitleFontSize ? `${siteTypography.subtitleFontSize}px` : undefined,
              fontWeight: siteTypography.subtitleFontWeight || '600'
            }}
            className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed"
          >
            Formez-vous aux outils d'intelligence artificielle, à la création d'agents IA pour les entreprises et au développement web sans code. Formations pas-à-pas adaptées aux débutants comme aux professionnels, sur mobile Android, iPhone et ordinateur.
          </p>
        </div>

        {/* Formations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {pricingPackages.map((pkg) => {
            const isSiteWeb = pkg.id === 'site-web-pro';
            const isPopular = pkg.popular;

            // Handle dynamic price and message if package has options
            let activePrice = pkg.price;
            let activeWhatsAppMsg = pkg.whatsappMessage;
            let activeNote = pkg.priceNote;

            if (isSiteWeb && pkg.options && pkg.options.length > 0) {
              const selectedOpt = pkg.options.find(o => o.id === siteWebOption) || pkg.options[0];
              activePrice = selectedOpt.price;
              if (selectedOpt.whatsappMessage) {
                activeWhatsAppMsg = selectedOpt.whatsappMessage;
              }
              if (selectedOpt.note) {
                activeNote = selectedOpt.note;
              }
            }

            return (
              <div
                key={pkg.id}
                className={`relative bg-white rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between ${
                  isPopular
                    ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-lg md:-translate-y-1'
                    : 'border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'
                } p-5 sm:p-6`}
              >
                {/* Popular Pill Tag */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[11px] font-black py-0.5 px-3.5 rounded-full shadow-sm flex items-center gap-1.5 whitespace-nowrap">
                    <Sparkles className="w-3 h-3" />
                    <span>Recommandé & Très Demandé</span>
                  </div>
                )}

                {/* Top Section */}
                <div>
                  {/* Category & Icon */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      {getPackageIcon(pkg.id)}
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 font-mono">
                      Pack Officiel
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug mb-2">
                    {pkg.name}
                  </h3>

                  {/* Delay / Format */}
                  <div className="text-xs text-slate-600 mb-4 flex items-center gap-1.5 font-bold">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{pkg.delay}</span>
                  </div>

                  {/* Special Option Selector for Service 4 (Hostinger vs Sans Hébergement) */}
                  {isSiteWeb && pkg.options && (
                    <div className="mb-4 p-1.5 bg-slate-100 rounded-xl border border-slate-200 space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-wider text-slate-700 px-1 pt-0.5">
                        Choisissez votre formule :
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[11px] font-bold">
                        <button
                          type="button"
                          onClick={() => setSiteWebOption('avec-hebergement')}
                          className={`py-2 px-2.5 rounded-xl text-center transition-all cursor-pointer ${
                            siteWebOption === 'avec-hebergement'
                              ? 'bg-[#073587] text-white shadow-xs'
                              : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                          }`}
                        >
                          <span className="block text-xs font-bold leading-tight">Avec Hébergement</span>
                          <span
                            style={{
                              fontFamily: siteTypography.priceFontFamily || 'Arial, Helvetica, sans-serif',
                              fontWeight: siteTypography.priceFontWeight || '900'
                            }}
                            className="text-xs sm:text-sm tracking-normal block mt-0.5 price-tag"
                          >
                            25 000 F
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSiteWebOption('sans-hebergement')}
                          className={`py-2 px-2.5 rounded-xl text-center transition-all cursor-pointer ${
                            siteWebOption === 'sans-hebergement'
                              ? 'bg-[#073587] text-white shadow-xs'
                              : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                          }`}
                        >
                          <span className="block text-xs font-bold leading-tight">Sans Hébergement</span>
                          <span
                            style={{
                              fontFamily: siteTypography.priceFontFamily || 'Arial, Helvetica, sans-serif',
                              fontWeight: siteTypography.priceFontWeight || '900'
                            }}
                            className="text-xs sm:text-sm tracking-normal block mt-0.5 price-tag"
                          >
                            15 000 F
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Price display with Arial and prominent bold weight */}
                  <div className="pb-4 mb-4 border-b border-slate-100">
                    <div className="flex items-baseline gap-1.5">
                      <span
                        style={{
                          fontFamily: siteTypography.priceFontFamily || 'Arial, Helvetica, sans-serif',
                          fontSize: siteTypography.priceFontSize ? `${siteTypography.priceFontSize}px` : undefined,
                          fontWeight: siteTypography.priceFontWeight || '900'
                        }}
                        className="text-3xl sm:text-4xl text-slate-950 tracking-tight leading-none"
                      >
                        {activePrice}
                      </span>
                    </div>

                    {activeNote && (
                      <span className="text-[11px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80 inline-block mt-1.5 leading-snug">
                        {activeNote}
                      </span>
                    )}

                    <p className="mt-3 text-xs text-slate-700 leading-relaxed font-semibold">
                      {pkg.description}
                    </p>

                    {pkg.hosting && (
                      <div className="mt-3 p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-[11px] font-black text-emerald-900">
                        <Server className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{pkg.hosting}</span>
                      </div>
                    )}
                  </div>

                  {/* Included features list */}
                  <div className="space-y-2.5 mb-6">
                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider block">
                      Programme inclus :
                    </span>
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-800 font-semibold leading-snug">
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 font-black stroke-[3]" />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA Buttons (Optimized for Android & iPhone Touch Targets) */}
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  {/* WhatsApp Direct Enrollment */}
                  <a
                    href={getWhatsAppUrl(activeWhatsAppMsg)}
                    onClick={() => trackClick('whatsapp')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full min-h-[44px] py-3 px-3 rounded-xl text-xs sm:text-sm font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
                    aria-label={`S'inscrire sur WhatsApp pour ${pkg.name}`}
                  >
                    <MessageCircle className="w-4 h-4 fill-white/20 shrink-0" />
                    <span>
                      S'inscrire sur WhatsApp (
                      <strong style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} className="font-black tracking-normal">
                        {activePrice}
                      </strong>
                      )
                    </span>
                  </a>

                  {/* Form Trigger */}
                  <button
                    onClick={() => onSelectPackage(pkg)}
                    className="w-full min-h-[40px] py-2 px-3 rounded-xl text-xs font-bold text-slate-800 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-center"
                  >
                    <span>Poser une question / Devis</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Immediate Prominent Button Directly Under Formations */}
        <div className="mt-8 text-center flex flex-col items-center justify-center gap-2 px-2 max-w-full">
          <button
            type="button"
            onClick={onOpenBusinessCardGenerator}
            className="w-full sm:w-auto px-5 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-[#073587] hover:bg-[#05235c] text-white font-black text-xs sm:text-base shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 sm:gap-3 cursor-pointer border-2 border-amber-400 group ring-4 ring-amber-400/20 max-w-full text-center"
          >
            <CreditCard className="w-5 h-5 text-amber-400 shrink-0 group-hover:rotate-6 transition-transform" />
            <span style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} className="text-white break-words">
              Créer Ma Carte de Visite Professionnelle Gratuite
            </span>
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 hidden sm:inline" />
          </button>
          <span className="text-[11px] sm:text-xs font-bold text-slate-500 text-center">
            100% Gratuit · Sans inscription · Téléchargement HD & QR Code immédiat
          </span>
        </div>

        {/* Free Professional Business Card Generator Section (Directement sous les formations) */}
        <div className="mt-8 bg-gradient-to-r from-[#073587] via-[#05235c] to-[#041938] rounded-3xl p-5 sm:p-8 text-white shadow-xl border-2 border-amber-400 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 max-w-full">
          {/* Decorative luxury background glow */}
          <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left: Hook & Description */}
          <div className="space-y-2.5 max-w-2xl text-center md:text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>Outil Exclusif & 100% Gratuit</span>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight">
              Créez votre Carte de Visite Professionnelle en 1 Clic
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 font-semibold leading-relaxed">
              Accessible gratuitement à tous les entrepreneurs et professionnels d'Afrique : indiquez votre nom, profession, coordonnées et photo, et obtenez instantanément une carte de visite au design exceptionnel avec QR Code interactif prêt à imprimer et à télécharger en HD.
            </p>
          </div>

          {/* Right: Big Action Button */}
          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto relative z-10">
            <button
              type="button"
              onClick={onOpenBusinessCardGenerator}
              className="w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-base shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border-2 border-white/40 group max-w-full text-center"
            >
              <CreditCard className="w-5 h-5 text-slate-950 shrink-0 group-hover:rotate-6 transition-transform" />
              <span className="break-words">Créer Ma Carte de Visite Gratuite</span>
            </button>
          </div>
        </div>

        {/* Support & Multi-pack Guarantee Banner */}
        <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-5 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#073587] flex items-center justify-center shrink-0 font-black">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-black text-slate-900">
                Vous souhaitez cumuler plusieurs formations ou un accompagnement sur-mesure ?
              </h4>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">
                Tarifs dégressifs pour les packs complets et les entreprises. Échangez en direct avec le responsable sur WhatsApp.
              </p>
            </div>
          </div>

          <a
            href={getWhatsAppUrl("Bonjour Africa Web, je souhaite un devis personnalisé pour suivre plusieurs de vos formations (Vidéo IA, Produit Digital, Images Publicitaires, Site Web Pro).")}
            onClick={() => trackClick('whatsapp')}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 text-xs sm:text-sm font-black text-[#073587] bg-blue-50 hover:bg-blue-100 border border-[#073587]/30 rounded-xl whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Discuter d'un pack sur-mesure</span>
          </a>
        </div>
      </div>
    </section>
  );
};

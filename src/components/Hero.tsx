import React from 'react';
import {
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Video,
  FileSpreadsheet,
  Image as ImageIcon,
  Globe,
  Sparkles,
  CreditCard
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';
import { getWhatsAppUrl } from '../data/agencyData';

interface HeroProps {
  onExplorePricing: () => void;
  onOpenContact: (planId?: string) => void;
  onOpenBusinessCardGenerator?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExplorePricing,
  onOpenContact,
  onOpenBusinessCardGenerator
}) => {
  const { agencyInfo, pricingPackages, siteColors, siteTypography, trackClick } = useAgency();

  const videoPkg = pricingPackages.find(p => p.id === 'video-ia');
  const digitalPkg = pricingPackages.find(p => p.id === 'produit-digital');
  const imagesPkg = pricingPackages.find(p => p.id === 'images-publicitaires');
  const webPkg = pricingPackages.find(p => p.id === 'site-web-pro');
  const agentPkg = pricingPackages.find(p => p.id === 'agent-ia-entreprise');

  return (
    <section id="hero" className="relative bg-white pt-8 pb-14 lg:pt-14 lg:pb-18 border-b border-slate-100 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            {/* Clean unboxed kicker with dot separator */}
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider" style={{ color: siteColors.primary }}>
              <span>{agencyInfo.heroKicker || "Académie & Agence Numérique · Formations Pratiques & Création Web"}</span>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontFamily: siteTypography.titleFontFamily || siteTypography.fontFamily,
                fontSize: siteTypography.titleFontSize ? `${siteTypography.titleFontSize}px` : undefined,
                fontWeight: siteTypography.titleFontWeight || '900'
              }}
              className="text-2xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-[1.18] text-balance"
            >
              {agencyInfo.heroHeadline || "Maîtrisez la création de vidéos IA, produits digitaux, affiches, sites web et agents IA pro."}
            </h1>

            {/* Subtitle / Description */}
            <p
              style={{
                fontFamily: siteTypography.subtitleFontFamily || siteTypography.fontFamily,
                fontSize: siteTypography.subtitleFontSize ? `${siteTypography.subtitleFontSize}px` : undefined,
                fontWeight: siteTypography.subtitleFontWeight || '600'
              }}
              className="text-sm sm:text-base lg:text-lg text-slate-700 leading-relaxed max-w-2xl"
            >
              {agencyInfo.heroSubtitle ? (
                agencyInfo.heroSubtitle
              ) : (
                <>
                  <strong className="text-slate-900 font-black">{agencyInfo.name}</strong> vous forme aux compétences les plus rentables du marché : Vidéos publicitaires avec <strong className="text-[#073587]">Google Flow & Arena IA</strong> ({videoPkg?.price || '10 000 FCFA'}), Produits digitaux ({digitalPkg?.price || '15 000 FCFA'}), Images publicitaires ({imagesPkg?.price || '5 000 FCFA'}), Création de sites web pro sans code ({webPkg?.price || '25 000 FCFA'} avec hébergement ou 15 000 FCFA) et Création d'agents IA pour les entreprises ({agentPkg?.price || '20 000 FCFA'}).
                </>
              )}
            </p>

            {/* Quick feature list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs sm:text-sm text-slate-800 font-bold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Prise en main immédiate sur Android, iPhone et PC</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Paiements faciles : Mobile Money & Cartes bancaires</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Méthodes sans code accessibles à tous les débutants</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Accompagnement et support dédié direct sur WhatsApp</span>
              </div>
            </div>

            {/* Primary Action Buttons (100% responsive on Android & iPhone) */}
            <div className="pt-3 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 w-full max-w-full">
              <button
                onClick={onExplorePricing}
                style={{ backgroundColor: siteColors.primary }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 text-xs sm:text-sm font-black text-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer hover:opacity-90 min-h-[44px] text-center"
              >
                <span>Voir nos formations disponible</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>

              {onOpenBusinessCardGenerator && (
                <button
                  type="button"
                  onClick={onOpenBusinessCardGenerator}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer min-h-[44px] border border-amber-500/50 group text-center"
                >
                  <CreditCard className="w-4 h-4 text-slate-950 shrink-0 group-hover:rotate-6 transition-transform" />
                  <span>Créer ma carte de visite gratuite</span>
                </button>
              )}

              <a
                href={getWhatsAppUrl("Bonjour Africa Web, je souhaite échanger directement avec vous pour m'inscrire à l'une de vos formations.")}
                onClick={() => trackClick('whatsapp')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-3.5 text-xs sm:text-sm font-black text-slate-900 bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-slate-400 rounded-xl shadow-xs transition-all group cursor-pointer min-h-[44px] text-center"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600/30 shrink-0 group-hover:scale-110 transition-transform" />
                <span>WhatsApp ({agencyInfo.whatsappDisplay})</span>
              </a>
            </div>

            {/* Trust markers */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-5 text-xs text-slate-600 font-bold">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#073587]" />
                <span>Formation certifiée & compétences rentables immédiatement</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>100% optimisé pour smartphone Android & iPhone</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Anchor with Africa Web Logo & 4 Offer Strips */}
          <div className="lg:col-span-5">
            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs relative">
              {/* Logo Presentation Banner */}
              <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200 shadow-xs mb-4 flex flex-col items-center text-center">
                <img
                  src={agencyInfo.logoUrl}
                  alt={agencyInfo.name}
                  className="h-16 sm:h-20 w-auto object-contain mb-2"
                />
                <p className="text-xs font-bold text-slate-800 italic">
                  "{agencyInfo.slogan}"
                </p>
                <div className="mt-1 text-[11px] text-slate-600 font-bold">
                  {agencyInfo.motto}
                </div>
              </div>

              {/* 4 Core Solution Strips */}
              <div className="space-y-2.5">
                {/* 1. Vidéo Publicitaire IA */}
                <div
                  onClick={() => onOpenContact('video-ia')}
                  className="bg-white p-3 rounded-xl border border-slate-200 hover:border-amber-500 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Video className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                        1. Vidéo Publicitaire & Pro IA
                      </h4>
                      <p className="text-[11px] text-slate-500 font-semibold">Google Flow, Arena IA & Voix off</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                      className="text-xs sm:text-sm font-black text-amber-600 block"
                    >
                      {videoPkg?.price || '10 000 FCFA'}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold">Accès direct</span>
                  </div>
                </div>

                {/* 2. Produit Digital Pro */}
                <div
                  onClick={() => onOpenContact('produit-digital')}
                  className="bg-white p-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <FileSpreadsheet className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                        2. Produit Digital Professionnel
                      </h4>
                      <p className="text-[11px] text-slate-500 font-semibold">E-books, Tunnels & Monétisation</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                      className="text-xs sm:text-sm font-black text-indigo-700 block"
                    >
                      {digitalPkg?.price || '15 000 FCFA'}
                    </span>
                    <span className="text-[10px] text-amber-600 font-bold">Très demandé</span>
                  </div>
                </div>

                {/* 3. Images Publicitaires */}
                <div
                  onClick={() => onOpenContact('images-publicitaires')}
                  className="bg-white p-3 rounded-xl border border-slate-200 hover:border-pink-500 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                      <ImageIcon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 group-hover:text-pink-600 transition-colors">
                        3. Création Images Publicitaires
                      </h4>
                      <p className="text-[11px] text-slate-500 font-semibold">Affiches, Vente & Réseaux Sociaux</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                      className="text-xs sm:text-sm font-black text-pink-600 block"
                    >
                      {imagesPkg?.price || '5 000 FCFA'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">Débutant</span>
                  </div>
                </div>

                {/* 4. Site Web Pro Sans Code */}
                <div
                  onClick={() => onOpenContact('site-web-pro')}
                  className="bg-white p-3 rounded-xl border border-slate-200 hover:border-[#073587] hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#073587] flex items-center justify-center shrink-0">
                      <Globe className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 group-hover:text-[#073587] transition-colors">
                        4. Création Site Web Pro Sans Code
                      </h4>
                      <p className="text-[11px] text-slate-500 font-semibold">Boutique, Vitrine, Marketplace</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      style={{ fontFamily: siteTypography.priceFontFamily || 'Arial, Helvetica, sans-serif' }}
                      className="text-xs sm:text-sm font-black text-[#073587] block"
                    >
                      25 000 F / 15 000 F
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold">Hostinger ou Gratuit</span>
                  </div>
                </div>

                {/* 5. Création Agent IA pour Entreprises */}
                <div
                  onClick={() => onOpenContact('agent-ia-entreprise')}
                  className="bg-white p-3 rounded-xl border border-slate-200 hover:border-purple-500 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 group-hover:text-purple-600 transition-colors">
                        5. Créer un Agent IA pour Entreprises
                      </h4>
                      <p className="text-[11px] text-slate-500 font-semibold">Support client 24/7, Ventes & n8n</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      style={{ fontFamily: siteTypography.priceFontFamily || 'Arial, Helvetica, sans-serif' }}
                      className="text-xs sm:text-sm font-black text-purple-700 block"
                    >
                      {agentPkg?.price || '20 000 FCFA'}
                    </span>
                    <span className="text-[10px] text-purple-600 font-bold">Nouveau & Rentable</span>
                  </div>
                </div>
              </div>

              {/* Instant WhatsApp Quick Touch */}
              <div className="mt-3.5 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-700 font-bold">
                <span className="text-[11px]">Besoin d'un conseil immédiat ?</span>
                <a
                  href={getWhatsAppUrl("Bonjour Africa Web, pouvez-vous me conseiller sur la formation la plus adaptée pour mon projet ?")}
                  onClick={() => trackClick('whatsapp')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>Écrire sur WhatsApp</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { Mail, Phone, MessageCircle, ArrowUp, Lock, ShieldCheck, LogOut } from 'lucide-react';
import { useAgency } from '../context/AgencyContext';
import { getWhatsAppUrl } from '../data/agencyData';

interface FooterProps {
  onOpenOwnerLogin: () => void;
  onOpenOwnerDashboard: () => void;
  onOpenBusinessCardGenerator?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenOwnerLogin,
  onOpenOwnerDashboard,
  onOpenBusinessCardGenerator
}) => {
  const { agencyInfo, footerConfig, siteColors, isOwnerLoggedIn, logoutOwner, trackClick } = useAgency();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="text-slate-300 pt-16 pb-12 border-t border-slate-800 font-sans transition-colors"
      style={{ backgroundColor: siteColors.primaryDark }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info & Mission (Can be toggled by owner) */}
          {footerConfig.showBrandBlock && (
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={agencyInfo.logoUrl}
                  alt={agencyInfo.name}
                  className="h-10 w-auto object-contain bg-white/10 p-1 rounded-lg"
                />
                <span className="text-xl font-bold text-white tracking-tight">
                  Africa<span className="text-amber-400">Web</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm font-medium">
                {agencyInfo.slogan}
              </p>

              <p className="text-xs text-amber-300 font-bold">
                "{agencyInfo.motto}"
              </p>

              {/* Direct Contact Links */}
              <div className="pt-2 space-y-2 text-xs font-bold">
                <a
                  href={getWhatsAppUrl()}
                  onClick={() => trackClick('whatsapp')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp : {agencyInfo.whatsappDisplay}</span>
                </a>

                <a
                  href={`mailto:${agencyInfo.email}`}
                  onClick={() => trackClick('email')}
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>Email : {agencyInfo.email}</span>
                </a>

                {footerConfig.showDomainMention && (
                  <div className="pt-1 flex items-center gap-1.5 text-[11px] text-emerald-300 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Tous nos sites sont livrés avec nom de domaine dédié et adresses emails professionnelles</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Core Services Links (Can be toggled by owner) */}
          {footerConfig.showServicesBlock && (
            <div className="lg:col-span-4 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Nos 5 Formations & Tarifs
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400 font-semibold">
                <li>
                  <a href="#tarifs" className="hover:text-amber-400 transition-colors flex items-center justify-between">
                    <span>1. Vidéo Publicitaire IA (Google Flow, Arena)</span>
                    <span
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                      className="text-amber-300 font-black text-xs sm:text-sm tracking-normal"
                    >
                      10 000 FCFA
                    </span>
                  </a>
                </li>
                <li>
                  <a href="#tarifs" className="hover:text-amber-400 transition-colors flex items-center justify-between">
                    <span>2. Produit Digital Professionnel</span>
                    <span
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                      className="text-amber-300 font-black text-xs sm:text-sm tracking-normal"
                    >
                      15 000 FCFA
                    </span>
                  </a>
                </li>
                <li>
                  <a href="#tarifs" className="hover:text-amber-400 transition-colors flex items-center justify-between">
                    <span>3. Création des Images Publicitaires</span>
                    <span
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                      className="text-amber-300 font-black text-xs sm:text-sm tracking-normal"
                    >
                      5 000 FCFA
                    </span>
                  </a>
                </li>
                <li>
                  <a href="#tarifs" className="hover:text-amber-400 transition-colors flex items-center justify-between">
                    <span>4. Site Web Pro Sans Code (Hostinger/Gratuit)</span>
                    <span
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                      className="text-amber-300 font-black text-xs sm:text-sm tracking-normal"
                    >
                      25 000 F / 15 000 F
                    </span>
                  </a>
                </li>
                <li>
                  <a href="#tarifs" className="hover:text-amber-400 transition-colors flex items-center justify-between">
                    <span>5. Créer un Agent IA pour Entreprises</span>
                    <span
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                      className="text-amber-300 font-black text-xs sm:text-sm tracking-normal"
                    >
                      20 000 FCFA
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          )}

          {/* Quick Access */}
          {footerConfig.showQuickLinksBlock && (
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Accès Rapide
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400 font-semibold">
                <li>
                  <a href="#hero" className="hover:text-white transition-colors">Accueil</a>
                </li>
                <li>
                  <a href="#tarifs" className="hover:text-white transition-colors">Formations & Tarifs</a>
                </li>
                <li>
                  <a href="#presentation-video" className="hover:text-white transition-colors">Vidéo de Présentation</a>
                </li>
                <li>
                  <a href="#apropos" className="hover:text-white transition-colors">À Propos & Équipe</a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">Contact & Inscription</a>
                </li>
                {onOpenBusinessCardGenerator && (
                  <li>
                    <button
                      type="button"
                      onClick={onOpenBusinessCardGenerator}
                      className="text-amber-400 hover:text-amber-300 transition-colors font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Carte de Visite Gratuite</span>
                    </button>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom copyright & Owner button in bottom corner */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-semibold border-t border-slate-800">
          <p>{footerConfig.copyrightText}</p>

          <div className="flex items-center gap-3">
            {/* Bouton Compte Propriétaire dans le coin inférieur de la bas de page */}
            {isOwnerLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenOwnerDashboard}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 font-bold transition-all cursor-pointer text-xs"
                  title="Ouvrir le Panneau de Contrôle Propriétaire"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tableau de Bord Propriétaire</span>
                </button>
                <button
                  onClick={logoutOwner}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-900/40 hover:bg-red-800 text-red-300 border border-red-500/30 font-bold transition-all cursor-pointer text-xs"
                  title="Se déconnecter"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Déconnexion</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenOwnerLogin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all cursor-pointer"
                title="Accès Espace Propriétaire (Connexion)"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Compte Propriétaire</span>
              </button>
            )}

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs"
            >
              <span>Haut</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

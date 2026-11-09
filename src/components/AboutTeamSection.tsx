import React from 'react';
import { MessageCircle, Mail, Award, HeartHandshake } from 'lucide-react';
import { useAgency } from '../context/AgencyContext';
import { getWhatsAppUrl } from '../data/agencyData';

interface AboutTeamSectionProps {
  onOpenContact: () => void;
}

export const AboutTeamSection: React.FC<AboutTeamSectionProps> = ({ onOpenContact }) => {
  const { agencyInfo, trackClick } = useAgency();

  return (
    <section id="apropos" className="py-20 bg-white border-b border-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Image 3 - Responsable du site & Relation Client */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border-2 border-slate-200 shadow-md bg-slate-50 group">
              <img
                src={agencyInfo.responsablePhoto}
                alt="Responsable du site - Africa Web"
                className="w-full h-auto object-cover object-center group-hover:scale-102 transition-transform duration-300"
              />
              {/* Badge overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {agencyInfo.responsableName || "Samuel G."} · {agencyInfo.responsableRole || "Direction & Service Clientèle"}
                    </h4>
                    <p className="text-[11px] text-slate-600 font-semibold">
                      {agencyInfo.name}
                    </p>
                  </div>
                  <span className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" title="En ligne pour vous répondre" />
                </div>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-600 text-center font-bold">
              {agencyInfo.responsableBio || "Votre interlocuteur dédié pour le cadrage et le suivi de vos formations et projets numériques."}
            </p>
          </div>

          {/* Right Column: Mission, Values & Commitment */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#073587]">
              <span>À Propos de {agencyInfo.name}</span>
              <span aria-hidden="true" className="text-amber-500">·</span>
              <span>Vision Panafricaine</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {agencyInfo.aboutTitle || "Un partenaire humain et dévoué à votre réussite en ligne."}
            </h2>

            <p className="text-base text-slate-700 leading-relaxed font-semibold">
              {agencyInfo.aboutText || `Chez ${agencyInfo.name}, nous croyons qu'une entreprise africaine ne doit plus dépendre d'outils complexes ou inadaptés à notre réalité locale. Que vous ayez besoin de maîtriser la vidéo publicitaire par IA, de concevoir des produits digitaux ou de créer votre propre site web professionnel avec ou sans hébergement, nous mettons notre savoir-faire au service de votre croissance.`}
            </p>

            {/* Core Values Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-200">
                <div className="flex items-center gap-2.5 mb-2">
                  <HeartHandshake className="w-5 h-5 text-[#073587]" />
                  <h4 className="text-sm font-bold text-slate-900">Accompagnement Proche</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  Pas de jargon technique obscur. Nous vous expliquons chaque étape et vous formons pour que vous gardiez le plein contrôle.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-200">
                <div className="flex items-center gap-2.5 mb-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <h4 className="text-sm font-bold text-slate-900">Adapté au Marché Africain</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  Intégration directe des passerelles de paiement locales (MTN, Moov, Orange, Wave) et des tunnels WhatsApp.
                </p>
              </div>
            </div>

            {/* Direct Contact Bar (Android-friendly) */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <a
                href={getWhatsAppUrl("Bonjour, je souhaite échanger directement avec le responsable d'Africa Web.")}
                onClick={() => trackClick('whatsapp')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" />
                <span>Écrire sur WhatsApp ({agencyInfo.whatsappDisplay})</span>
              </a>

              <a
                href={`mailto:${agencyInfo.email}`}
                onClick={() => trackClick('email')}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-bold text-slate-900 bg-white hover:bg-slate-50 border-2 border-slate-300 rounded-xl transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4 text-amber-500" />
                <span>{agencyInfo.email}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

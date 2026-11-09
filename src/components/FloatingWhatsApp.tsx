import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useAgency } from '../context/AgencyContext';
import { getWhatsAppUrl } from '../data/agencyData';

export const FloatingWhatsApp: React.FC = () => {
  const { trackClick } = useAgency();
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-40 flex flex-col items-end font-sans max-w-[calc(100vw-2rem)]">
      {/* Floating greeting pill */}
      {showTooltip && (
        <div className="mb-2 bg-white text-slate-900 text-[11px] sm:text-xs font-bold px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl shadow-lg border-2 border-slate-200 flex items-center gap-2 max-w-[240px] sm:max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="leading-tight text-[11px] sm:text-xs">
            Besoin d'un devis rapide ? <strong>WhatsApp direct</strong>
          </span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-slate-700 ml-1 cursor-pointer shrink-0"
            title="Fermer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Button (Prominent on Android) */}
      <a
        href={getWhatsAppUrl("Bonjour Africa Web, je visite votre site internet et je souhaite des informations sur vos offres.")}
        onClick={() => trackClick('whatsapp')}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-108 group relative cursor-pointer"
        aria-label="Contacter Africa Web sur WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white/20 group-hover:scale-110 transition-transform" />

        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-30 animate-ping -z-10" />
      </a>
    </div>
  );
};

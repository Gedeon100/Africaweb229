import React, { useState } from 'react';
import { Mail, MessageCircle, Copy, Check, Send, AlertCircle } from 'lucide-react';
import { useAgency } from '../context/AgencyContext';
import { getWhatsAppUrl } from '../data/agencyData';

interface ContactSectionProps {
  initialPlan?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ initialPlan }) => {
  const { agencyInfo, pricingPackages, trackClick } = useAgency();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    projectType: initialPlan || 'video-ia',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(agencyInfo.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const getPackageNameById = (id: string) => {
    const pkg = pricingPackages.find(p => p.id === id);
    if (pkg) return `${pkg.name} (${pkg.price})`;
    return "Projet sur-mesure";
  };

  const buildMessageContent = () => {
    return `*Nouvelle demande via le site Africa Web*\n\n` +
      `👤 *Nom :* ${formData.fullName || 'Non précisé'}\n` +
      `📞 *Téléphone / WhatsApp :* ${formData.phone || 'Non précisé'}\n` +
      `✉️ *Email :* ${formData.email || 'Non précisé'}\n` +
      `🎯 *Formule sélectionnée :* ${getPackageNameById(formData.projectType)}\n\n` +
      `📝 *Détails du projet :*\n${formData.message || 'Bonjour, je souhaite démarrer un projet.'}`;
  };

  const handleSendViaWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      setErrorMessage("Veuillez renseigner au moins votre nom et votre numéro de téléphone/WhatsApp.");
      return;
    }
    setErrorMessage('');
    trackClick('whatsapp');
    trackClick('quote');
    const fullText = buildMessageContent();
    const whatsappUrl = `https://wa.me/${agencyInfo.whatsappNumber}?text=${encodeURIComponent(fullText)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  const handleSendViaEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) {
      setErrorMessage("Veuillez renseigner votre nom et votre adresse email.");
      return;
    }
    setErrorMessage('');
    trackClick('email');
    trackClick('quote');
    const subject = encodeURIComponent(`Demande de projet - ${getPackageNameById(formData.projectType)} - ${formData.fullName}`);
    const body = encodeURIComponent(buildMessageContent());
    window.location.href = `mailto:${agencyInfo.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 bg-slate-50 border-b border-slate-200/80 scroll-mt-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-[#073587] mb-2">
            <span>Démarrer un Projet</span>
            <span aria-hidden="true" className="text-amber-500">·</span>
            <span>Contact & Devis</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Prêt à lancer votre site web avec Africa Web ?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-700 font-semibold">
            Contactez-nous directement par <strong>WhatsApp</strong> ou par <strong>Email</strong>, ou remplissez le formulaire ci-dessous pour recevoir une proposition adaptée.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Contact Cards (WhatsApp & Email) */}
          <div className="lg:col-span-5 space-y-5">
            {/* WhatsApp Card */}
            <div className="bg-white rounded-2xl border-2 border-emerald-200 p-6 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6 fill-emerald-600/30" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Contacter sur WhatsApp
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    Échange direct, réponse rapide 7j/7
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-700 mb-4 leading-relaxed font-semibold">
                Le moyen le plus rapide pour poser vos questions, échanger sur votre cahier des charges et lancer la création de votre site.
              </p>

              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200 mb-4">
                <span className="text-sm font-black text-slate-900 font-mono">
                  {agencyInfo.whatsappDisplay}
                </span>
                <span className="text-[11px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-300">
                  En ligne
                </span>
              </div>

              <a
                href={getWhatsAppUrl("Bonjour Africa Web, je souhaite commander un site internet / une boutique en ligne.")}
                onClick={() => trackClick('whatsapp')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" />
                <span>Ouvrir WhatsApp directement</span>
              </a>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Nous écrire par Email
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    Pour devis officiels & cahiers des charges
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-700 mb-4 leading-relaxed font-semibold">
                Vous avez un document de cadrage ou préférez communiquer par courrier électronique ? Envoyez-nous un email directement.
              </p>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 mb-4">
                <span className="text-xs sm:text-sm font-bold text-slate-900 truncate mr-2 font-mono">
                  {agencyInfo.email}
                </span>
                <button
                  type="button"
                  onClick={copyEmailToClipboard}
                  className="px-2.5 py-1 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-md shrink-0 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Copier l'adresse email"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copié</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier</span>
                    </>
                  )}
                </button>
              </div>

              <a
                href={`mailto:${agencyInfo.email}?subject=Demande%20de%20cr%C3%A9ation%20de%20site%20web%20-%20Africa%20Web`}
                onClick={() => trackClick('email')}
                className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-2 transition-colors border border-slate-300 cursor-pointer"
              >
                <Mail className="w-4 h-4 text-amber-600" />
                <span>Envoyer un email</span>
              </a>
            </div>
          </div>

          {/* Right Column: Professional Interactive Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="mb-6">
              <h3 className="text-xl font-black text-slate-900">
                Formulaire de Demande de Projet
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">
                Remplissez les détails ci-dessous. Vous pouvez envoyer directement votre demande via WhatsApp ou par Email en un clic.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 bg-emerald-50 rounded-xl border-2 border-emerald-300 text-center space-y-3 animate-in fade-in">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 font-bold" />
                </div>
                <h4 className="text-base font-black text-emerald-900">
                  Demande préparée avec succès !
                </h4>
                <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto font-semibold">
                  Merci pour votre confiance. L'équipe Africa Web analyse votre demande et vous recontacte dans les plus brefs délais.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-bold text-emerald-800 underline mt-2 cursor-pointer"
                >
                  Envoyer une autre demande
                </button>
              </div>
            ) : (
              <form className="space-y-4">
                {errorMessage && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2 border border-red-200 font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Kodjo Lawson"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#073587]/30 focus:border-[#073587] font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Numéro WhatsApp / Téléphone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: +229 01 68 54 62 37"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#073587]/30 focus:border-[#073587] font-semibold"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Adresse Email
                  </label>
                  <input
                    type="email"
                    placeholder="Ex: contact@monentreprise.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#073587]/30 focus:border-[#073587] font-semibold"
                  />
                </div>

                {/* Project Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Offre souhaitée *
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#073587]/30 focus:border-[#073587] bg-white font-bold"
                  >
                    {pricingPackages.map(pkg => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} ({pkg.price})
                      </option>
                    ))}
                    <option value="surmesure">Projet spécifique / Sur-mesure</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Description de votre projet & objectifs
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Présentez brièvement votre activité, vos produits ou votre calendrier souhaité..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#073587]/30 focus:border-[#073587] font-semibold"
                  />
                </div>

                {/* Dual Submits (High visibility on Android) */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleSendViaWhatsApp}
                    className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-white/20" />
                    <span>Envoyer sur WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendViaEmail}
                    className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#073587] hover:bg-[#05235c] flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Envoyer par Email</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 font-semibold text-center pt-2">
                  🔒 Vos informations restent strictement confidentielles et ne sont jamais partagées.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import {
  Smartphone,
  Monitor,
  ExternalLink,
  ArrowLeft,
  ShoppingCart,
  MessageCircle,
  Star,
  Check,
  ShieldCheck,
  Clock,
  Award,
  Phone,
  Search,
  Globe,
  ThumbsUp,
  Share2,
  Heart,
  Send,
  Zap,
  CreditCard,
  Code2,
  Bell,
  UserCheck,
  Building2,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { ProjectItem, getWhatsAppUrl } from '../data/agencyData';

interface LiveSiteSimulatorProps {
  project: ProjectItem;
  onClose: () => void;
}

export const LiveSiteSimulator: React.FC<LiveSiteSimulatorProps> = ({ project, onClose }) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [cartCount, setCartCount] = useState(0);

  // Fintech Interactive State (CinetPay simulator)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'mtn' | 'moov' | 'orange' | 'wave' | 'card'>('mtn');
  const [fintechPaymentSuccess, setFintechPaymentSuccess] = useState(false);
  const [fintechAmount, setFintechAmount] = useState('25 000');
  const [activeFintechTab, setActiveFintechTab] = useState<'checkout' | 'api'>('checkout');

  // Social Interactive State (Facebook simulator)
  const [likeCount, setLikeCount] = useState(342);
  const [isLiked, setIsLiked] = useState(false);
  const [socialComments, setSocialComments] = useState<string[]>([
    "Superbe initiative ! J'ai commandé mon stock la semaine dernière, livraison rapide.",
    "Félicitations pour le développement de la plateforme, très fluide sur mobile."
  ]);
  const [newCommentInput, setNewCommentInput] = useState('');

  // Alibaba B2B RFQ State
  const [rfqSubmitted, setRfqSubmitted] = useState(false);
  const [moqUnits, setMoqUnits] = useState(50);

  const theme = project.colorTheme || {
    primary: '#073587',
    primaryDark: '#05235c',
    accent: '#f59e0b',
    lightBg: '#f8fafc',
    border: '#cbd5e1',
    badgeBg: '#f1f5f9',
    badgeText: '#0f172a'
  };

  const layout = project.layoutFormat || 'blueprint-corporate';

  const handleToggleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
      setIsLiked(false);
    } else {
      setLikeCount(prev => prev + 1);
      setIsLiked(true);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentInput.trim()) return;
    setSocialComments(prev => [...prev, newCommentInput.trim()]);
    setNewCommentInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      {/* Top Browser Simulator Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-white">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Fermer le simulateur</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Simulateur Réalisation Africa Web</span>
            <span className="text-slate-600">·</span>
            <span className="text-amber-400 font-black">{project.title}</span>
            <span className="text-slate-600">·</span>
            <span className="text-emerald-400 font-mono text-[11px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              {project.domain || `${project.id}.com`}
            </span>
          </div>
        </div>

        {/* Device Switcher (Desktop / Android Phone) */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-black rounded-lg transition-colors cursor-pointer ${
              deviceMode === 'desktop' ? 'bg-[#073587] text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Ordinateur</span>
          </button>

          <button
            onClick={() => setDeviceMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-black rounded-lg transition-colors cursor-pointer ${
              deviceMode === 'mobile' ? 'bg-[#073587] text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android / Mobile</span>
          </button>
        </div>

        {/* External Link or Direct WhatsApp Order */}
        <div className="flex items-center gap-2">
          {project.externalLink ? (
            <a
              href={project.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ouvrir l'URL officielle</span>
            </a>
          ) : (
            <a
              href={getWhatsAppUrl(`Bonjour Africa Web, je viens de tester la démo du site "${project.title}" et je souhaite commander une solution similaire.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-lg transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
              <span>Commander ce type de site</span>
            </a>
          )}
        </div>
      </div>

      {/* Simulator Viewport Body */}
      <div className="flex-1 overflow-auto p-2 sm:p-5 flex items-center justify-center">
        <div
          className={`bg-white rounded-xl shadow-2xl border-2 border-slate-300 overflow-hidden transition-all duration-300 flex flex-col ${
            deviceMode === 'mobile'
              ? 'w-[390px] max-w-full h-[730px] max-h-[86vh] rounded-3xl ring-8 ring-slate-800'
              : 'w-full max-w-5xl h-[780px] max-h-[86vh]'
          }`}
        >
          {/* Simulated Browser URL bar with custom domain disposition */}
          <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>

            <div className="flex-1 bg-white px-3 py-1 rounded-md text-[11px] font-mono text-slate-800 border border-slate-200 flex items-center justify-between">
              <span className="truncate font-bold">
                🔒 https://{project.domain || (project.externalLink ? project.externalLink.replace('https://', '') : `${project.id}.com`)}
              </span>
              <span className="text-[10px] text-emerald-700 font-black ml-2 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>SSL Sécurisé</span>
              </span>
            </div>

            {project.domainBadge && (
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 hidden sm:inline">
                {project.domainBadge}
              </span>
            )}
          </div>

          {/* Interactive Simulated Website Canvas */}
          <div
            className="flex-1 overflow-y-auto font-sans"
            style={{ backgroundColor: theme.lightBg }}
          >
            {/* ============================================================ */}
            {/* 1. FORMAT: ALIBABA B2B GLOBAL TRADE (AfriBABA) */}
            {/* ============================================================ */}
            {layout === 'alibaba-b2b' && (
              <div className="space-y-4 bg-[#f5f5f7]">
                {/* Alibaba Signature Orange Top Header */}
                <div className="bg-[#ff6000] text-white px-4 py-3 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl sm:text-2xl font-black tracking-tighter">AfriBABA</span>
                      <span className="text-[10px] bg-white text-[#ff6000] font-black px-1.5 py-0.5 rounded uppercase">B2B Trade</span>
                    </div>

                    <div className="flex-1 max-w-lg hidden sm:flex items-center bg-white rounded-lg overflow-hidden border border-amber-300">
                      <span className="px-3 text-xs font-black text-slate-600 border-r border-slate-200">Fournisseurs</span>
                      <input
                        type="text"
                        placeholder="Rechercher des produits de gros, usines, conteneurs..."
                        className="flex-1 px-3 py-1.5 text-xs text-slate-900 font-bold outline-none"
                      />
                      <button className="bg-slate-900 text-white px-4 py-1.5 text-xs font-black flex items-center gap-1">
                        <Search className="w-3.5 h-3.5" />
                        <span>Chercher</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-bold">
                      <span className="bg-white/20 px-2 py-1 rounded">Devis RFQ</span>
                      <span className="hidden md:inline">Protection Acheteur</span>
                    </div>
                  </div>

                  {/* Taxonomy Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pt-2.5 text-[11px] font-bold text-amber-100 whitespace-nowrap">
                    <span className="text-white font-black">Catégories de gros :</span>
                    <span className="bg-white/10 px-2 py-0.5 rounded cursor-pointer hover:bg-white/20">Machines & Équipements</span>
                    <span className="bg-white/10 px-2 py-0.5 rounded cursor-pointer hover:bg-white/20">Textiles & Balles Wax</span>
                    <span className="bg-white/10 px-2 py-0.5 rounded cursor-pointer hover:bg-white/20">Énergie Solaire & Batteries</span>
                    <span className="bg-white/10 px-2 py-0.5 rounded cursor-pointer hover:bg-white/20">Agro-industrie & Grains</span>
                  </div>
                </div>

                {/* Hero Wholesale Promo Banner */}
                <div className="p-4 sm:p-6 mx-3 sm:mx-6 bg-gradient-to-r from-slate-950 via-slate-900 to-[#e05300] text-white rounded-2xl shadow-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded">
                      Fournisseurs Certifiés Or
                    </span>
                    <span className="text-xs text-amber-300 font-mono">Usines vérifiées au Bénin, Nigéria, Côte d'Ivoire</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black">
                    Approvisionnement direct d'usines africaines aux meilleurs tarifs de gros
                  </h3>
                  <p className="text-xs text-slate-300 max-w-xl font-bold">
                    Négociez directement avec les fabricants. Sécurisation complète des paiements et garantie de conformité avant expédition maritime ou terrestre.
                  </p>
                </div>

                {/* B2B Product Cards with MOQ (Quantité Minimale) */}
                <div className="p-4 sm:p-6 mx-3 sm:mx-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Flame className="w-4 h-4 text-[#ff6000]" />
                      <span>Produits de gros les plus demandés</span>
                    </h4>
                    <span className="text-xs font-bold text-slate-500">Tarifs dégressifs par volume</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      {
                        title: "Système Solaire Hybride 5kVA Panafricain",
                        supplier: "SunAfrik Energy Factory · Cotonou",
                        price: "185 000 FCFA / unité",
                        moq: "MOQ : 5 unités",
                        tag: "Vérifié Or",
                        leadTime: "Livraison 3 à 5 jours"
                      },
                      {
                        title: "Balles de Tissu Wax Authentique 500 Mètres",
                        supplier: "Textile Dahomey Confection · Bénin",
                        price: "92 000 FCFA / balle",
                        moq: "MOQ : 3 balles",
                        tag: "Fabricant Direct",
                        leadTime: "En stock local"
                      },
                      {
                        title: "Broyeur Multifonction Manioc & Maïs Industriel",
                        supplier: "AgroMachinerie West Africa",
                        price: "390 000 FCFA / machine",
                        moq: "MOQ : 1 machine",
                        tag: "Garantie 2 ans",
                        leadTime: "Expédition express"
                      }
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-black mb-1">
                            <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">{item.tag}</span>
                            <span className="text-slate-500">{item.leadTime}</span>
                          </div>
                          <h5 className="font-black text-xs text-slate-900 mt-1">{item.title}</h5>
                          <p className="text-[11px] text-slate-500 font-bold">{item.supplier}</p>
                          <div className="mt-2">
                            <span className="text-sm font-black text-[#ff6000] font-mono block">{item.price}</span>
                            <span className="text-[11px] font-black text-slate-700 bg-slate-200 px-2 py-0.5 rounded inline-block mt-0.5">{item.moq}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setRfqSubmitted(true);
                            setTimeout(() => setRfqSubmitted(false), 3000);
                          }}
                          className="w-full py-2 bg-[#ff6000] hover:bg-[#e05300] text-white text-xs font-black rounded-lg transition-colors cursor-pointer"
                        >
                          Demander une cotation (RFQ)
                        </button>
                      </div>
                    ))}
                  </div>

                  {rfqSubmitted && (
                    <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-black rounded-xl border border-emerald-300 text-center animate-in fade-in">
                      ✓ Demande de cotation RFQ envoyée au fournisseur vérifié avec succès !
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* 2. FORMAT: CINETPAY FINTECH & PAYMENT GATEWAY (PayAfrik) */}
            {/* ============================================================ */}
            {layout === 'cinetpay-fintech' && (
              <div className="space-y-5 bg-[#070f26] text-white p-4 sm:p-6 min-h-full">
                {/* Fintech Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center font-black text-slate-950">
                      PA
                    </div>
                    <div>
                      <span className="font-black text-base text-cyan-300">PayAfrik Gateway</span>
                      <span className="text-[10px] text-slate-400 block font-mono">Inspiré de CinetPay & API Checkout</span>
                    </div>
                  </div>

                  {/* Mode switcher tabs */}
                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-black">
                    <button
                      onClick={() => setActiveFintechTab('checkout')}
                      className={`px-3 py-1.5 rounded-lg cursor-pointer ${
                        activeFintechTab === 'checkout' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Simulateur Checkout Mobile Money
                    </button>
                    <button
                      onClick={() => setActiveFintechTab('api')}
                      className={`px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1 ${
                        activeFintechTab === 'api' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Code API Développeurs</span>
                    </button>
                  </div>
                </div>

                {activeFintechTab === 'checkout' ? (
                  <div className="max-w-xl mx-auto bg-slate-900/90 rounded-2xl border border-slate-700 p-5 sm:p-7 shadow-2xl space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-xs font-bold text-slate-400 block">Montant à encaisser :</span>
                        <span className="text-2xl font-black text-white font-mono">{fintechAmount} FCFA</span>
                      </div>
                      <span className="text-xs font-black text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/40">
                        🔒 Chiffrement 256-bit
                      </span>
                    </div>

                    {/* Operator selection */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-300 block">
                        Choisissez votre moyen de paiement Mobile Money ou Carte :
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                          { id: 'mtn', label: 'MTN Mobile Money', color: '#eab308' },
                          { id: 'moov', label: 'Moov Money', color: '#0284c7' },
                          { id: 'orange', label: 'Orange Money', color: '#f97316' },
                          { id: 'wave', label: 'Wave', color: '#06b6d4' },
                          { id: 'card', label: 'Carte Visa / Master', color: '#8b5cf6' },
                        ].map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setSelectedPaymentMethod(m.id as any)}
                            className={`p-2.5 rounded-xl border text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                              selectedPaymentMethod === m.id
                                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                            <span>{m.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Phone Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-300 block">
                        Numéro de téléphone du payeur :
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-2 bg-slate-800 rounded-xl text-xs font-mono font-bold text-slate-400 border border-slate-700">
                          +229
                        </span>
                        <input
                          type="text"
                          defaultValue="01 68 54 62 37"
                          className="flex-1 px-3.5 py-2 bg-slate-800 rounded-xl text-xs font-mono font-bold text-white border border-slate-700 outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setFintechPaymentSuccess(true);
                        setTimeout(() => setFintechPaymentSuccess(false), 4000);
                      }}
                      className="w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 text-xs font-black rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Valider le paiement de {fintechAmount} FCFA</span>
                    </button>

                    {fintechPaymentSuccess && (
                      <div className="p-3.5 bg-emerald-950 border border-emerald-500 rounded-xl text-emerald-300 text-xs font-black text-center animate-in zoom-in-95 flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Paiement validé avec succès en 1.4s · Reçu envoyé par SMS</span>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Developer API View */
                  <div className="max-w-2xl mx-auto bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                      <span className="font-bold text-cyan-400">cURL · Requête de Paiement Instantané</span>
                      <span>POST /api/v1/charge</span>
                    </div>
                    <pre className="text-slate-300 overflow-x-auto p-3 bg-slate-950 rounded-xl text-[11px] leading-relaxed">
{`curl -X POST https://api.payafrik.io/v1/charge \\
  -H "Authorization: Bearer sec_key_live_9482104" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 25000,
    "currency": "XOF",
    "customer": { "phone": "+2290168546237", "name": "Client Afrique" },
    "channels": ["MTN_BENIN", "MOOV_BENIN", "WAVE"],
    "callback_url": "https://monsite.com/webhook"
  }'`}
                    </pre>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-emerald-400">
                      ✓ Statut 200 OK : Webhook envoyé en temps réel · Rapprochement bancaire instantané
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ============================================================ */}
            {/* 3. FORMAT: FACEBOOK SOCIAL & COMMUNITY (AfriConnect) */}
            {/* ============================================================ */}
            {layout === 'facebook-social' && (
              <div className="space-y-4 bg-[#f0f2f5] min-h-full pb-8">
                {/* Facebook Blue Header */}
                <div className="bg-[#1877f2] text-white px-4 py-2.5 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black tracking-tight">AfriConnect</span>
                    <div className="hidden sm:flex items-center bg-white/20 rounded-full px-3 py-1 text-xs">
                      <Search className="w-3.5 h-3.5 text-white/80 mr-1.5" />
                      <input
                        type="text"
                        placeholder="Rechercher des créateurs, entreprises..."
                        className="bg-transparent text-white placeholder-white/70 outline-none text-xs w-48 font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                      <Bell className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-xs">
                      AW
                    </div>
                  </div>
                </div>

                {/* Stories Bar */}
                <div className="px-4 sm:px-6">
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                    {[
                      { name: "Créer une story", role: "Africa Web", bg: "from-blue-600 to-indigo-700" },
                      { name: "Kodjo L.", role: "BTP Cotonou", bg: "from-amber-600 to-orange-700" },
                      { name: "Aminata D.", role: "Mode Abidjan", bg: "from-pink-600 to-rose-700" },
                      { name: "Dr. Eric D.", role: "Académie", bg: "from-emerald-600 to-teal-700" },
                    ].map((st, i) => (
                      <div
                        key={i}
                        className={`w-24 sm:w-28 h-36 rounded-xl bg-gradient-to-b ${st.bg} text-white p-2.5 flex flex-col justify-between shrink-0 shadow-xs cursor-pointer hover:opacity-95`}
                      >
                        <span className="w-6 h-6 rounded-full bg-white text-slate-900 text-[10px] font-black flex items-center justify-center border-2 border-blue-500">
                          {st.name.charAt(0)}
                        </span>
                        <div>
                          <span className="text-[11px] font-black block leading-tight">{st.name}</span>
                          <span className="text-[9px] text-white/80 font-bold">{st.role}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Publisher Box */}
                <div className="max-w-xl mx-auto bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-[#1877f2] font-black flex items-center justify-center text-xs">
                      AW
                    </div>
                    <input
                      type="text"
                      placeholder="Que souhaitez-vous partager avec la communauté ?"
                      className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-xs font-bold text-slate-700 outline-none"
                    />
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-around text-xs font-bold text-slate-600">
                    <span className="flex items-center gap-1.5 cursor-pointer hover:text-[#1877f2]">📷 Photo/Vidéo</span>
                    <span className="flex items-center gap-1.5 cursor-pointer hover:text-emerald-600">🏷️ Taguer partenaire</span>
                    <span className="flex items-center gap-1.5 cursor-pointer hover:text-amber-600">💡 Opportunité B2B</span>
                  </div>
                </div>

                {/* Rich Feed Post with Interactive Likes & Comments */}
                <div className="max-w-xl mx-auto bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div className="p-4 pb-0 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-[#1877f2] text-white font-black flex items-center justify-center text-xs">
                        AC
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-black text-xs text-slate-900">Africa Web Community</span>
                          <span className="w-3.5 h-3.5 bg-[#1877f2] text-white rounded-full flex items-center justify-center text-[8px]">✓</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold">Il y a 2h · Public 🌐</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 text-xs font-bold text-slate-800 leading-relaxed space-y-2">
                    <p>
                      🚀 Félicitations à nos 50 nouveaux entrepreneurs partenaires qui viennent de lancer leur plateforme en ligne ! Le commerce digital panafricain est en pleine explosion.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-900 to-[#1877f2] text-white p-6 text-center space-y-1">
                    <span className="text-[10px] uppercase font-black tracking-widest text-amber-300">Statistique Réseau</span>
                    <h4 className="text-xl font-black">+140% d'échanges commerciaux ce mois-ci</h4>
                    <p className="text-xs text-blue-100 font-bold">Rejoignez le mouvement des créateurs africains connectés.</p>
                  </div>

                  {/* Reaction counts */}
                  <div className="px-4 py-1 flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-100">
                    <div className="flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-[#1877f2] text-white flex items-center justify-center text-[10px]">👍</span>
                      <span>{likeCount} mentions J'aime</span>
                    </div>
                    <span>{socialComments.length} commentaires · 48 partages</span>
                  </div>

                  {/* Like / Comment buttons */}
                  <div className="px-4 py-1.5 flex items-center justify-around text-xs font-black text-slate-700">
                    <button
                      onClick={handleToggleLike}
                      className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg cursor-pointer transition-colors ${
                        isLiked ? 'text-[#1877f2] bg-blue-50' : 'hover:bg-slate-100'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>J'aime</span>
                    </button>
                    <button className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-slate-100 cursor-pointer">
                      <MessageCircle className="w-4 h-4" />
                      <span>Commenter</span>
                    </button>
                    <button className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-slate-100 cursor-pointer">
                      <Share2 className="w-4 h-4" />
                      <span>Partager</span>
                    </button>
                  </div>

                  {/* Comment List */}
                  <div className="p-4 pt-2 bg-slate-50 rounded-b-xl space-y-2 border-t border-slate-100">
                    {socialComments.map((comment, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-700 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                          {idx % 2 === 0 ? 'M' : 'K'}
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex-1">
                          <span className="font-black text-slate-900 block text-[11px]">Membre Vérifié</span>
                          <span className="text-slate-700 font-bold">{comment}</span>
                        </div>
                      </div>
                    ))}

                    <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Écrire un commentaire..."
                        value={newCommentInput}
                        onChange={(e) => setNewCommentInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-full text-xs font-bold outline-none"
                      />
                      <button
                        type="submit"
                        className="p-1.5 bg-[#1877f2] hover:bg-blue-700 text-white rounded-full cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* 4. FORMAT: AMAZON & JUMIA MEGA STORE (SuperDeal) */}
            {/* ============================================================ */}
            {layout === 'amazon-jumia' && (
              <div className="space-y-4 bg-white min-h-full">
                {/* Amazon Dark Top Header */}
                <div className="bg-[#131921] text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="leading-tight">
                      <span className="text-xl font-black tracking-tight text-white">SuperDeal</span>
                      <span className="text-amber-400 font-black text-sm">.africa</span>
                    </div>
                    <div className="hidden md:flex items-center gap-1 text-[11px] text-slate-300 font-bold border border-slate-700 px-2 py-1 rounded">
                      <span>📍 Livrer à Cotonou</span>
                    </div>
                  </div>

                  <div className="flex-1 max-w-md hidden sm:flex items-center bg-white rounded-lg overflow-hidden">
                    <input
                      type="text"
                      placeholder="Rechercher parmi 25 000 articles..."
                      className="flex-1 px-3 py-1.5 text-xs text-slate-900 font-bold outline-none"
                    />
                    <button className="bg-[#f68b1e] text-slate-950 px-3.5 py-1.5 text-xs font-black">
                      <Search className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      onClick={() => setCartCount(c => c + 1)}
                      className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-black text-white">{cartCount} articles</span>
                    </div>
                  </div>
                </div>

                {/* Flash Sales Banner with Live Countdown */}
                <div className="mx-4 sm:mx-6 p-4 bg-gradient-to-r from-red-600 to-[#f68b1e] text-white rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-black/30 px-2 py-0.5 rounded">
                      VENTES FLASH DU JOUR
                    </span>
                    <h4 className="text-lg font-black mt-0.5">Jusqu'à -50% sur l'électronique & maison</h4>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-black bg-black/40 px-3 py-1.5 rounded-xl">
                    <Clock className="w-3.5 h-3.5 text-amber-300" />
                    <span>Fin dans : 04h : 22m : 18s</span>
                  </div>
                </div>

                {/* Product Grid */}
                <div className="p-4 sm:p-6 mx-4 sm:mx-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { name: "Smartphone 4G 128Go Double SIM", price: "64 900 FCFA", oldPrice: "89 000 FCFA", disc: "-27%" },
                      { name: "Ventilateur Solaire Rechargeable 16''", price: "28 500 FCFA", oldPrice: "38 000 FCFA", disc: "-25%" },
                      { name: "Pack Écouteurs Sans Fil Bluetooth 5.3", price: "12 500 FCFA", oldPrice: "19 000 FCFA", disc: "-34%" },
                    ].map((prod, i) => (
                      <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-shadow flex flex-col justify-between space-y-2">
                        <div>
                          <span className="text-[10px] font-black bg-red-100 text-red-700 px-2 py-0.5 rounded">{prod.disc}</span>
                          <h5 className="font-black text-xs text-slate-900 mt-2">{prod.name}</h5>
                          <div className="flex items-center gap-1 text-amber-500 my-1">
                            {[...Array(5)].map((_, s) => (
                              <Star key={s} className="w-3 h-3 fill-amber-400" />
                            ))}
                            <span className="text-[10px] text-slate-500 font-bold ml-1">(128 avis)</span>
                          </div>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-sm font-black text-slate-900 font-mono">{prod.price}</span>
                            <span className="text-xs text-slate-400 line-through font-mono">{prod.oldPrice}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setCartCount(c => c + 1)}
                          className="w-full py-2 bg-[#f68b1e] hover:bg-[#e07b19] text-slate-950 text-xs font-black rounded-lg transition-colors cursor-pointer"
                        >
                          Ajouter au panier
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* 5. FORMAT: CULINARY FUNNEL (Guide Recettes KGM) */}
            {/* ============================================================ */}
            {layout === 'culinary-funnel' && (
              <div className="space-y-6 p-4 sm:p-6 bg-[#fffbeb]">
                <div className="p-8 text-white text-center rounded-2xl" style={{ background: `linear-gradient(135deg, ${theme.primary} 0%, #b91c1c 100%)` }}>
                  <span className="text-[11px] font-black uppercase tracking-wider bg-white text-red-700 px-3 py-1 rounded-md inline-block mb-2 shadow-xs">
                    OFFRE PROMOTIONNELLE -80% DE RÉDUCTION
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black mb-2">{project.title}</h3>
                  <p className="text-xs sm:text-sm text-amber-100 max-w-lg mx-auto font-bold mb-4">{project.heroSlogan || project.description}</p>
                  <div className="inline-flex items-center gap-2 bg-black/40 px-4 py-1.5 rounded-xl text-xs font-black">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Accès immédiat après paiement par Mobile Money</span>
                  </div>
                </div>

                <div className="p-6 bg-white rounded-2xl border-2 border-amber-300 shadow-xs space-y-3">
                  <h4 className="text-sm font-black text-amber-950">Inclus dans la commande :</h4>
                  <ul className="text-xs text-slate-800 font-bold space-y-1.5">
                    <li>✓ 150+ recettes béninoises et ouest-africaines illustrées pas à pas</li>
                    <li>✓ Vidéos des techniques secrètes de sauces et marinades</li>
                    <li>✓ Guide des épices et herbes médicinales culinaires</li>
                    <li>✓ Support WhatsApp dédié pour répondre à vos questions culinaires</li>
                  </ul>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* 6. FORMAT: BLUEPRINT CORPORATE & BTP (AfrikBât) */}
            {/* ============================================================ */}
            {layout === 'blueprint-corporate' && (
              <div className="space-y-6 bg-[#f8fafc] p-4 sm:p-6">
                <div className="p-8 text-white rounded-2xl" style={{ background: `linear-gradient(135deg, ${theme.primaryDark} 0%, #1e293b 100%)` }}>
                  <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-amber-400 block mb-1">
                    BUREAU D'ÉTUDES & BÂTIMENT INDUSTRIEL
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black mb-2">{project.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-bold mb-4">{project.heroSlogan || project.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: "Complexe Résidentiel Haie Vive", stat: "12 Appartements de Standing" },
                    { name: "Entrepôt Logistique Zone Portuaire", stat: "3 500 m² Couverts" },
                    { name: "Siège Administratif R+3", stat: "Bâtiment Éco-Conçu" },
                    { name: "Villa Contemporaine Calavi", stat: "Conception Bioclimatique" },
                  ].map((site, i) => (
                    <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                      <span className="text-[10px] font-mono text-sky-700 font-black uppercase">Chantier Validé</span>
                      <h5 className="font-black text-xs sm:text-sm text-slate-900">{site.name}</h5>
                      <p className="text-xs text-slate-600 font-bold">{site.stat}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Simulated Clean Footer without Hostinger */}
            <div className="p-4 bg-slate-900 text-white text-center text-xs font-bold flex flex-wrap items-center justify-between gap-2 border-t border-slate-800">
              <span className="flex items-center gap-1.5 text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Plateforme Sécurisée & Nom de Domaine Dédié</span>
              </span>
              <span className="text-slate-400">
                Site conçu par Africa Web Agence Numérique
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

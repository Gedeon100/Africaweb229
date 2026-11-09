import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  CreditCard,
  Download,
  Printer,
  Sparkles,
  Share2,
  Upload,
  User,
  Phone,
  Mail,
  MapPin,
  Globe,
  Briefcase,
  Building,
  Check,
  RefreshCw,
  Eye,
  Sliders,
  Copy,
  Layers,
  MessageCircle
} from 'lucide-react';
import QRCode from 'qrcode';
import { compressImageFile } from '../utils/mediaStorage';

export interface BusinessCardData {
  fullName: string;
  profession: string;
  company: string;
  phone: string;
  email: string;
  city: string;
  website: string;
  tagline: string;
  photoUrl: string;
  theme: 'africa-blue' | 'emerald-gold' | 'carbon-dark' | 'royal-white' | 'ruby-burgundy';
}

interface BusinessCardGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const THEMES = [
  {
    id: 'africa-blue',
    name: 'Prestige Bleu & Or (Signature Africa Web)',
    badgeColor: 'bg-amber-400 text-slate-950',
    primary: '#073587',
    secondary: '#041938',
    accent: '#f59e0b',
    border: 'border-amber-400/50',
    cardBg: 'from-[#073587] via-[#05235c] to-[#031530]',
    textColor: 'text-white',
    subTextColor: 'text-amber-300',
    iconBg: 'bg-amber-400/20 text-amber-300',
    qrColor: { dark: '#073587', light: '#ffffff' }
  },
  {
    id: 'emerald-gold',
    name: 'Émeraude Impériale & Or',
    badgeColor: 'bg-emerald-500 text-white',
    primary: '#064e3b',
    secondary: '#022c22',
    accent: '#fbbf24',
    border: 'border-amber-300/50',
    cardBg: 'from-[#064e3b] via-[#022c22] to-[#011a14]',
    textColor: 'text-white',
    subTextColor: 'text-amber-300',
    iconBg: 'bg-amber-400/20 text-amber-300',
    qrColor: { dark: '#064e3b', light: '#ffffff' }
  },
  {
    id: 'carbon-dark',
    name: 'Carbone Noir & Platine',
    badgeColor: 'bg-slate-800 text-slate-200',
    primary: '#0f172a',
    secondary: '#020617',
    accent: '#e2e8f0',
    border: 'border-slate-600/60',
    cardBg: 'from-[#1e293b] via-[#0f172a] to-[#020617]',
    textColor: 'text-white',
    subTextColor: 'text-slate-300',
    iconBg: 'bg-white/10 text-slate-200',
    qrColor: { dark: '#0f172a', light: '#ffffff' }
  },
  {
    id: 'royal-white',
    name: 'Blanc Royal & Cobalt',
    badgeColor: 'bg-blue-600 text-white',
    primary: '#073587',
    secondary: '#ffffff',
    accent: '#073587',
    border: 'border-slate-300',
    cardBg: 'from-white via-slate-50 to-blue-50/50',
    textColor: 'text-slate-900',
    subTextColor: 'text-[#073587]',
    iconBg: 'bg-blue-100 text-[#073587]',
    qrColor: { dark: '#073587', light: '#ffffff' }
  },
  {
    id: 'ruby-burgundy',
    name: 'Rubis Bordeaux & Cuivre',
    badgeColor: 'bg-rose-700 text-white',
    primary: '#4c0519',
    secondary: '#27030d',
    accent: '#f43f5e',
    border: 'border-rose-400/40',
    cardBg: 'from-[#4c0519] via-[#27030d] to-[#140106]',
    textColor: 'text-white',
    subTextColor: 'text-rose-300',
    iconBg: 'bg-rose-400/20 text-rose-300',
    qrColor: { dark: '#4c0519', light: '#ffffff' }
  }
] as const;

export const BusinessCardGeneratorModal: React.FC<BusinessCardGeneratorModalProps> = ({ isOpen, onClose }) => {
  const [cardData, setCardData] = useState<BusinessCardData>({
    fullName: 'Samuel G.',
    profession: 'Directeur Général & Expert IA',
    company: 'Africa Web - Agence Numérique',
    phone: '+229 97 00 00 00',
    email: 'contact@africa-web.com',
    city: 'Cotonou, Bénin',
    website: 'www.africa-web.com',
    tagline: 'Création de sites web pro, vidéos IA & produits digitaux',
    photoUrl: '/assets/aistudio/IMG-20260807-WA0001_87ce40ff.jpg',
    theme: 'africa-blue'
  });

  const [activeSide, setActiveSide] = useState<'recto' | 'verso' | 'both'>('recto');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string>('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentTheme = THEMES.find((t) => t.id === cardData.theme) || THEMES[0];

  // Helper toast notification
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Generate vCard format text
  const getVCardString = () => {
    return [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${cardData.fullName}`,
      `ORG:${cardData.company}`,
      `TITLE:${cardData.profession}`,
      `TEL;TYPE=CELL,VOICE:${cardData.phone}`,
      `EMAIL;TYPE=WORK,INTERNET:${cardData.email}`,
      `ADR;TYPE=WORK:;;;${cardData.city};;;`,
      `URL:${cardData.website.startsWith('http') ? cardData.website : 'https://' + cardData.website}`,
      `NOTE:${cardData.tagline}`,
      'END:VCARD'
    ].join('\r\n');
  };

  // Regenerate QR Code on card details or theme change
  useEffect(() => {
    if (!isOpen) return;

    const generateQR = async () => {
      try {
        const vCard = getVCardString();
        const url = await QRCode.toDataURL(vCard, {
          width: 300,
          margin: 1,
          color: currentTheme.qrColor
        });
        setQrCodeDataUrl(url);
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    };

    generateQR();
  }, [cardData, isOpen]);

  if (!isOpen) return null;

  // Handle Photo Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      const compressedDataUrl = await compressImageFile(file, 800, 800, 0.9);
      setCardData((prev) => ({ ...prev, photoUrl: compressedDataUrl }));
      showToast('Photo de profil mise à jour avec succès !');
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de l'import de la photo.");
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = '';
    }
  };

  // Canvas drawing helpers for HD Download
  const drawCardOnCanvas = async (
    ctx: CanvasRenderingContext2D,
    side: 'recto' | 'verso',
    offsetX: number,
    offsetY: number,
    width = 1050,
    height = 600
  ) => {
    const r = 24; // corner radius
    ctx.save();
    ctx.translate(offsetX, offsetY);

    // Card background with rounded clip
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(width - r, 0);
    ctx.quadraticCurveTo(width, 0, width, r);
    ctx.lineTo(width, height - r);
    ctx.quadraticCurveTo(width, height, width - r, height);
    ctx.lineTo(r, height);
    ctx.quadraticCurveTo(0, height, 0, height - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.clip();

    // Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    if (cardData.theme === 'royal-white') {
      bgGrad.addColorStop(0, '#ffffff');
      bgGrad.addColorStop(0.5, '#f8fafc');
      bgGrad.addColorStop(1, '#f1f5f9');
    } else if (cardData.theme === 'emerald-gold') {
      bgGrad.addColorStop(0, '#064e3b');
      bgGrad.addColorStop(0.6, '#022c22');
      bgGrad.addColorStop(1, '#011a14');
    } else if (cardData.theme === 'carbon-dark') {
      bgGrad.addColorStop(0, '#1e293b');
      bgGrad.addColorStop(0.6, '#0f172a');
      bgGrad.addColorStop(1, '#020617');
    } else if (cardData.theme === 'ruby-burgundy') {
      bgGrad.addColorStop(0, '#4c0519');
      bgGrad.addColorStop(0.6, '#27030d');
      bgGrad.addColorStop(1, '#140106');
    } else {
      // Default: africa-blue
      bgGrad.addColorStop(0, '#073587');
      bgGrad.addColorStop(0.55, '#05235c');
      bgGrad.addColorStop(1, '#031530');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Luxury Geometric Accent Grid
    ctx.strokeStyle = cardData.theme === 'royal-white' ? 'rgba(7, 53, 135, 0.08)' : 'rgba(245, 158, 11, 0.12)';
    ctx.lineWidth = 1;
    for (let x = 40; x < width; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Outer Gold / Accent Border
    ctx.strokeStyle =
      cardData.theme === 'royal-white'
        ? '#cbd5e1'
        : cardData.theme === 'carbon-dark'
        ? '#475569'
        : '#f59e0b';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Inner Hairline Frame
    ctx.strokeStyle =
      cardData.theme === 'royal-white' ? 'rgba(7, 53, 135, 0.15)' : 'rgba(245, 158, 11, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    const isLight = cardData.theme === 'royal-white';
    const primaryTextColor = isLight ? '#0f172a' : '#ffffff';
    const accentTextColor = isLight ? '#073587' : '#fbbf24';
    const mutedTextColor = isLight ? '#475569' : '#cbd5e1';

    if (side === 'recto') {
      // RECTO CONTENT
      // 1. Company Name & Africa Web Partner Badge (Top Left)
      ctx.fillStyle = accentTextColor;
      ctx.font = 'bold 22px Arial, Helvetica, sans-serif';
      ctx.fillText((cardData.company || 'AFRICA WEB').toUpperCase(), 50, 65);

      ctx.fillStyle = mutedTextColor;
      ctx.font = 'bold 14px Arial, Helvetica, sans-serif';
      ctx.fillText('CARTE DE VISITE OFFICIELLE', 50, 90);

      // Gold Divider line under company
      ctx.fillStyle = accentTextColor;
      ctx.fillRect(50, 105, 140, 3);

      // 2. Photo Medallion (Center Left)
      const photoSize = 150;
      const photoX = 50;
      const photoY = 135;

      // Outer Ring
      ctx.save();
      ctx.beginPath();
      ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2 + 5, 0, Math.PI * 2);
      ctx.fillStyle = accentTextColor;
      ctx.fill();

      // Clip for Photo
      ctx.beginPath();
      ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
      ctx.clip();

      if (cardData.photoUrl) {
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = cardData.photoUrl;
          await new Promise((res) => {
            if (img.complete) res(null);
            else {
              img.onload = () => res(null);
              img.onerror = () => res(null);
            }
          });
          ctx.drawImage(img, photoX, photoY, photoSize, photoSize);
        } catch {
          ctx.fillStyle = isLight ? '#e2e8f0' : '#1e293b';
          ctx.fillRect(photoX, photoY, photoSize, photoSize);
        }
      } else {
        ctx.fillStyle = isLight ? '#e2e8f0' : '#1e293b';
        ctx.fillRect(photoX, photoY, photoSize, photoSize);
        ctx.fillStyle = primaryTextColor;
        ctx.font = 'bold 50px Arial, Helvetica, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(cardData.fullName.charAt(0) || 'A', photoX + photoSize / 2, photoY + photoSize / 2 + 18);
        ctx.textAlign = 'left';
      }
      ctx.restore();

      // 3. Name & Profession (Right of Photo)
      const textStartX = 230;
      ctx.fillStyle = primaryTextColor;
      ctx.font = 'bold 38px Arial, Helvetica, sans-serif';
      ctx.fillText(cardData.fullName || 'Votre Nom', textStartX, 175);

      ctx.fillStyle = accentTextColor;
      ctx.font = 'bold 20px Arial, Helvetica, sans-serif';
      ctx.fillText((cardData.profession || 'Votre Profession').toUpperCase(), textStartX, 215);

      ctx.fillStyle = mutedTextColor;
      ctx.font = 'italic 16px Arial, Helvetica, sans-serif';
      ctx.fillText(`« ${cardData.tagline || 'Excellence & Professionnalisme'} »`, textStartX, 250);

      // 4. Contact Details Rows (Bottom Left to Center)
      const contactYStart = 330;
      const contactRowHeight = 44;

      const contacts = [
        { label: 'Tél / WhatsApp', val: cardData.phone || '+229 00 00 00 00' },
        { label: 'Email', val: cardData.email || 'contact@example.com' },
        { label: 'Localisation', val: cardData.city || 'Afrique' },
        { label: 'Site Internet', val: cardData.website || 'www.africa-web.com' }
      ];

      contacts.forEach((item, index) => {
        const col = index < 2 ? 0 : 1;
        const row = index % 2;
        const cx = 50 + col * 360;
        const cy = contactYStart + row * contactRowHeight;

        // Little Bullet
        ctx.fillStyle = accentTextColor;
        ctx.beginPath();
        ctx.arc(cx + 6, cy - 6, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = mutedTextColor;
        ctx.font = 'bold 12px Arial, Helvetica, sans-serif';
        ctx.fillText(item.label.toUpperCase(), cx + 22, cy - 14);

        ctx.fillStyle = primaryTextColor;
        ctx.font = 'bold 18px Arial, Helvetica, sans-serif';
        ctx.fillText(item.val, cx + 22, cy + 6);
      });

      // 5. Scannable QR Code (Right Side Box)
      const qrBoxSize = 160;
      const qrX = width - qrBoxSize - 50;
      const qrY = height - qrBoxSize - 60;

      // QR Background Card
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrX - 10, qrY - 10, qrBoxSize + 20, qrBoxSize + 40);
      ctx.strokeStyle = accentTextColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(qrX - 10, qrY - 10, qrBoxSize + 20, qrBoxSize + 40);

      if (qrCodeDataUrl) {
        try {
          const qrImg = new Image();
          qrImg.src = qrCodeDataUrl;
          await new Promise((res) => {
            if (qrImg.complete) res(null);
            else {
              qrImg.onload = () => res(null);
              qrImg.onerror = () => res(null);
            }
          });
          ctx.drawImage(qrImg, qrX, qrY, qrBoxSize, qrBoxSize);
        } catch (e) {
          console.error(e);
        }
      }

      ctx.fillStyle = '#073587';
      ctx.font = 'bold 11px Arial, Helvetica, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SCANNEZ POUR CONTACT', qrX + qrBoxSize / 2, qrY + qrBoxSize + 18);
      ctx.textAlign = 'left';

      // Watermark / Trust Footer
      ctx.fillStyle = mutedTextColor;
      ctx.font = 'bold 12px Arial, Helvetica, sans-serif';
      ctx.fillText('Généré par Africa Web · www.africa-web.com', 50, height - 35);
    } else {
      // VERSO CONTENT
      // Grand Logo Central & Slogan
      const centerX = width / 2;

      ctx.textAlign = 'center';

      // Top Header
      ctx.fillStyle = accentTextColor;
      ctx.font = 'bold 18px Arial, Helvetica, sans-serif';
      ctx.fillText('RÉSEAU PROFESSIONNEL & DIGITAL D’AFRIQUE', centerX, 90);

      // Grand Nom de Marque / Société
      ctx.fillStyle = primaryTextColor;
      ctx.font = 'black 48px Arial, Helvetica, sans-serif';
      ctx.fillText((cardData.company || 'AFRICA WEB').toUpperCase(), centerX, 160);

      // Slogan
      ctx.fillStyle = mutedTextColor;
      ctx.font = 'bold 20px Arial, Helvetica, sans-serif';
      ctx.fillText(cardData.tagline || 'Excellence, Présence en ligne & Solutions d’Élite', centerX, 210);

      // Gold Center Line
      ctx.fillStyle = accentTextColor;
      ctx.fillRect(centerX - 100, 235, 200, 3);

      // Central Big QR Code with Frame
      const qrSize = 180;
      const qrX = centerX - qrSize / 2;
      const qrY = 270;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrX - 12, qrY - 12, qrSize + 24, qrSize + 48);
      ctx.strokeStyle = accentTextColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(qrX - 12, qrY - 12, qrSize + 24, qrSize + 48);

      if (qrCodeDataUrl) {
        try {
          const qrImg = new Image();
          qrImg.src = qrCodeDataUrl;
          await new Promise((res) => {
            if (qrImg.complete) res(null);
            else {
              qrImg.onload = () => res(null);
              qrImg.onerror = () => res(null);
            }
          });
          ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
        } catch (e) {
          console.error(e);
        }
      }

      ctx.fillStyle = '#073587';
      ctx.font = 'bold 13px Arial, Helvetica, sans-serif';
      ctx.fillText('SCANNEZ POUR ENREGISTRER MON CONTACT', centerX, qrY + qrSize + 22);

      // Bottom Website & Coordinates
      ctx.fillStyle = primaryTextColor;
      ctx.font = 'bold 20px Arial, Helvetica, sans-serif';
      ctx.fillText(`${cardData.website} · ${cardData.phone}`, centerX, height - 45);

      ctx.textAlign = 'left';
    }

    ctx.restore();
  };

  // Download Single Side PNG
  const handleDownloadPNG = async (side: 'recto' | 'verso') => {
    setIsExporting(true);
    showToast(`Génération du fichier HD (${side === 'recto' ? 'Recto' : 'Verso'})...`);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1050;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');

      await drawCardOnCanvas(ctx, side, 0, 0, 1050, 600);

      const link = document.createElement('a');
      const safeName = cardData.fullName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      link.download = `carte-visite-${side}-${safeName || 'pro'}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      showToast(`Votre carte (${side}) a été téléchargée en Haute Définition !`);
    } catch (err) {
      console.error(err);
      showToast('Erreur lors du téléchargement. Veuillez réessayer.');
    } finally {
      setIsExporting(false);
    }
  };

  // Download Combined Recto + Verso PNG
  const handleDownloadCombined = async () => {
    setIsExporting(true);
    showToast('Création de la planche complète (Recto + Verso)...');

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1150;
      canvas.height = 1350;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');

      // Light/Dark Presentation Canvas Background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sheet Title
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 24px Arial, Helvetica, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('CARTE DE VISITE PROFESSIONNELLE · FORMAT IMPRESSION & RÉSEAUX', canvas.width / 2, 50);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 16px Arial, Helvetica, sans-serif';
      ctx.fillText(`${cardData.fullName} · ${cardData.profession} · ${cardData.company}`, canvas.width / 2, 80);

      // Draw Recto (Top)
      await drawCardOnCanvas(ctx, 'recto', 50, 110, 1050, 580);

      // Label Recto
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 14px Arial, Helvetica, sans-serif';
      ctx.fillText('▲ FACE AVANT (RECTO)', canvas.width / 2, 720);

      // Draw Verso (Bottom)
      await drawCardOnCanvas(ctx, 'verso', 50, 740, 1050, 580);

      // Label Verso
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 14px Arial, Helvetica, sans-serif';
      ctx.fillText('▲ FACE ARRIÈRE (VERSO)', canvas.width / 2, 1345);

      const link = document.createElement('a');
      const safeName = cardData.fullName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      link.download = `carte-visite-complete-${safeName || 'pro'}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      showToast('Planche complète (Recto + Verso) téléchargée avec succès !');
    } catch (err) {
      console.error(err);
      showToast('Erreur lors du téléchargement de la planche.');
    } finally {
      setIsExporting(false);
    }
  };

  // Download Contact vCard file (.vcf)
  const handleDownloadVCard = () => {
    try {
      const vCardText = getVCardString();
      const blob = new Blob([vCardText], { type: 'text/vcard;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const safeName = cardData.fullName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      link.download = `${safeName || 'contact'}.vcf`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      showToast('Fichier contact (.vcf) téléchargé ! Vous pouvez l’importer dans votre téléphone.');
    } catch (e) {
      console.error(e);
      showToast('Impossible de générer le fichier vCard.');
    }
  };

  // Print Dialog
  const handlePrint = () => {
    window.print();
  };

  // Share to WhatsApp
  const handleShareWhatsApp = () => {
    const text =
      `Bonjour ! Voici mes coordonnées professionnelles via ma carte de visite officielle Africa Web :\n\n` +
      `👤 *${cardData.fullName}*\n` +
      `💼 *${cardData.profession}*\n` +
      `🏢 *${cardData.company}*\n` +
      `📞 *Tél/WhatsApp :* ${cardData.phone}\n` +
      `✉️ *Email :* ${cardData.email}\n` +
      `🌐 *Site Web :* ${cardData.website}\n` +
      `📍 *Ville :* ${cardData.city}\n\n` +
      `Créez vous aussi votre carte gratuitement sur : https://africa-web.com`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto overflow-x-hidden">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-60 bg-[#073587] text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-2xl border-2 border-amber-400 flex items-center gap-2 animate-bounce max-w-[calc(100vw-2rem)]">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="truncate">{toastMsg}</span>
        </div>
      )}

      <div className="relative w-full max-w-6xl max-w-[calc(100vw-0.5rem)] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-slate-200 overflow-hidden my-auto flex flex-col max-h-[96vh]">
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-[#073587] via-[#05235c] to-[#041938] px-4 sm:px-5 py-3 sm:py-4 text-white flex items-center justify-between border-b-2 border-amber-400">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 font-black shadow-md">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Générateur de Carte de Visite Professionnelle
                </h2>
                <span className="bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
                  100% Gratuit
                </span>
              </div>
              <p className="text-xs text-amber-200 font-semibold hidden sm:block">
                Entrez vos informations, ajoutez votre photo et obtenez votre carte personnalisée avec QR Code interactif.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Fermer le générateur"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body: Split 2 columns (Form on Left / Interactive Live Preview on Right) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Input Form & Personalization Controls */}
          <div className="lg:col-span-5 space-y-5">
            {/* Theme Picker */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
              <label className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-[#073587]" />
                <span>1. Choisissez votre Style de Prestige</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {THEMES.map((theme) => {
                  const isSelected = cardData.theme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setCardData((prev) => ({ ...prev, theme: theme.id as any }))}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'border-[#073587] bg-blue-50/70 ring-2 ring-[#073587]/30 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: theme.primary }}
                        />
                        <span className="text-xs font-bold text-slate-800 truncate">{theme.name}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#073587] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Profile Photo Upload */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <label className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-[#073587]" />
                <span>2. Votre Photo ou Logo</span>
              </label>

              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 shrink-0 bg-slate-100 flex items-center justify-center shadow-inner">
                  {cardData.photoUrl ? (
                    <img
                      src={cardData.photoUrl}
                      alt="Aperçu photo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-slate-400" />
                  )}
                  {isUploadingPhoto && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <RefreshCw className="w-4 h-4 text-white animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1.5">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-1.5 bg-[#073587] hover:bg-[#05235c] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{cardData.photoUrl ? 'Changer ma photo' : 'Importer ma photo'}</span>
                    </button>
                    {cardData.photoUrl && (
                      <button
                        type="button"
                        onClick={() => setCardData((prev) => ({ ...prev, photoUrl: '' }))}
                        className="px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        Retirer
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Prend en charge les photos depuis votre téléphone (Android/iPhone) ou votre ordinateur.
                  </p>
                </div>
              </div>
            </div>

            {/* Identity & Contact Fields */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
              <label className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-[#073587]" />
                <span>3. Vos Informations Professionnelles</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Nom & Prénom *
                  </label>
                  <input
                    type="text"
                    value={cardData.fullName}
                    onChange={(e) => setCardData((prev) => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Ex: Samuel Gandonou"
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#073587] focus:bg-white transition-all"
                  />
                </div>

                {/* Profession / Role */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Profession / Métier *
                  </label>
                  <input
                    type="text"
                    value={cardData.profession}
                    onChange={(e) => setCardData((prev) => ({ ...prev, profession: e.target.value }))}
                    placeholder="Ex: Concepteur Web & IA"
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#073587] focus:bg-white transition-all"
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Entreprise / Marque
                  </label>
                  <input
                    type="text"
                    value={cardData.company}
                    onChange={(e) => setCardData((prev) => ({ ...prev, company: e.target.value }))}
                    placeholder="Ex: Africa Web"
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#073587] focus:bg-white transition-all"
                  />
                </div>

                {/* Phone / WhatsApp */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Téléphone / WhatsApp *
                  </label>
                  <input
                    type="text"
                    value={cardData.phone}
                    onChange={(e) => setCardData((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+229 XX XX XX XX"
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#073587] focus:bg-white transition-all"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Adresse Email
                  </label>
                  <input
                    type="email"
                    value={cardData.email}
                    onChange={(e) => setCardData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="contact@monentreprise.com"
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#073587] focus:bg-white transition-all"
                  />
                </div>

                {/* City & Country */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Ville, Pays
                  </label>
                  <input
                    type="text"
                    value={cardData.city}
                    onChange={(e) => setCardData((prev) => ({ ...prev, city: e.target.value }))}
                    placeholder="Cotonou, Bénin"
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#073587] focus:bg-white transition-all"
                  />
                </div>

                {/* Website / Portfolio */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Site Web / Portfolio
                  </label>
                  <input
                    type="text"
                    value={cardData.website}
                    onChange={(e) => setCardData((prev) => ({ ...prev, website: e.target.value }))}
                    placeholder="www.mon-site.com"
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#073587] focus:bg-white transition-all"
                  />
                </div>

                {/* Tagline / Slogan */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Slogan ou Phrase d'Accroche
                  </label>
                  <input
                    type="text"
                    value={cardData.tagline}
                    onChange={(e) => setCardData((prev) => ({ ...prev, tagline: e.target.value }))}
                    placeholder="Ex: Création de sites web, vidéos publicitaires & IA"
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#073587] focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Live Preview & High Definition Actions */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* View Switcher: Recto / Verso / Côte à côte */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveSide('recto')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeSide === 'recto' ? 'bg-[#073587] text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  Face Avant (Recto)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSide('verso')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeSide === 'verso' ? 'bg-[#073587] text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  Face Arrière (Verso)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSide('both')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeSide === 'both' ? 'bg-[#073587] text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  Vue Complète (Recto + Verso)
                </button>
              </div>

              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Format Standard 85 x 55 mm</span>
              </span>
            </div>

            {/* LIVE PREVIEW CONTAINER */}
            <div className="flex-1 bg-slate-900/95 p-4 sm:p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center min-h-[380px] overflow-hidden space-y-6">
              {/* RECTO CARD PREVIEW */}
              {(activeSide === 'recto' || activeSide === 'both') && (
                <div className="w-full max-w-[500px] aspect-[1.75/1] relative rounded-2xl p-3 sm:p-5 shadow-2xl border-2 overflow-hidden flex flex-col justify-between transition-all transform hover:scale-[1.01] max-w-full"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${
                      cardData.theme === 'royal-white'
                        ? '#ffffff, #f8fafc, #f1f5f9'
                        : cardData.theme === 'emerald-gold'
                        ? '#064e3b, #022c22, #011a14'
                        : cardData.theme === 'carbon-dark'
                        ? '#1e293b, #0f172a, #020617'
                        : cardData.theme === 'ruby-burgundy'
                        ? '#4c0519, #27030d, #140106'
                        : '#073587, #05235c, #031530'
                    })`,
                    borderColor:
                      cardData.theme === 'royal-white'
                        ? '#cbd5e1'
                        : cardData.theme === 'carbon-dark'
                        ? '#475569'
                        : '#f59e0b'
                  }}
                >
                  {/* Outer & Inner Luxury Border */}
                  <div className="absolute inset-2 rounded-xl border border-amber-400/30 pointer-events-none" />

                  {/* Top Bar: Company & Badge */}
                  <div className="flex items-start justify-between relative z-10">
                    <div>
                      <div
                        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        className={`text-xs sm:text-sm font-black tracking-wider uppercase ${
                          cardData.theme === 'royal-white' ? 'text-[#073587]' : 'text-amber-400'
                        }`}
                      >
                        {cardData.company || 'AFRICA WEB'}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400">
                        CARTE DE VISITE OFFICIELLE
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/20 text-[9px] font-mono font-bold text-amber-300 border border-amber-400/30">
                      <span>OFFICIAL CARD</span>
                    </div>
                  </div>

                  {/* Middle Section: Photo & Name & Profession */}
                  <div className="flex items-center gap-3 sm:gap-4 relative z-10 my-auto">
                    {/* Photo with Gold Frame */}
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-amber-400 shrink-0 bg-slate-800 shadow-md">
                      {cardData.photoUrl ? (
                        <img
                          src={cardData.photoUrl}
                          alt={cardData.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-black text-xl">
                          {cardData.fullName.charAt(0) || 'A'}
                        </div>
                      )}
                    </div>

                    {/* Name & Role */}
                    <div className="flex-1 min-w-0">
                      <h3
                        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        className={`text-base sm:text-lg font-black tracking-tight leading-tight truncate ${
                          cardData.theme === 'royal-white' ? 'text-slate-900' : 'text-white'
                        }`}
                      >
                        {cardData.fullName || 'Votre Nom & Prénom'}
                      </h3>
                      <p
                        className={`text-xs font-bold truncate mt-0.5 ${
                          cardData.theme === 'royal-white' ? 'text-[#073587]' : 'text-amber-300'
                        }`}
                      >
                        {cardData.profession || 'Votre Profession'}
                      </p>
                      {cardData.tagline && (
                        <p className="text-[10px] italic text-slate-400 truncate mt-0.5">
                          « {cardData.tagline} »
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bottom Section: Coordinates & Dynamic QR Code */}
                  <div className="flex items-end justify-between gap-3 relative z-10 pt-2 border-t border-white/10">
                    <div className="space-y-1 text-[10px] sm:text-[11px] font-bold">
                      <div className="flex items-center gap-1.5 text-white/90 truncate">
                        <Phone className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>{cardData.phone || '+229 00 00 00 00'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white/90 truncate">
                        <Mail className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate">{cardData.email || 'contact@example.com'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300 truncate">
                        <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>{cardData.city || 'Cotonou, Bénin'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-amber-300 truncate font-mono">
                        <Globe className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>{cardData.website || 'www.africa-web.com'}</span>
                      </div>
                    </div>

                    {/* QR Code */}
                    <div className="bg-white p-1 rounded-lg border border-amber-400/80 shadow-md shrink-0 flex flex-col items-center">
                      {qrCodeDataUrl ? (
                        <img src={qrCodeDataUrl} alt="QR Code vCard" className="w-14 h-14 sm:w-16 sm:h-16" />
                      ) : (
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-200 animate-pulse" />
                      )}
                      <span className="text-[8px] font-black text-[#073587] leading-none mt-0.5">
                        SCANNER
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* VERSO CARD PREVIEW */}
              {(activeSide === 'verso' || activeSide === 'both') && (
                <div className="w-full max-w-[500px] aspect-[1.75/1] relative rounded-2xl p-4 sm:p-6 shadow-2xl border-2 overflow-hidden flex flex-col justify-between items-center text-center transition-all transform hover:scale-[1.01] max-w-full"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${
                      cardData.theme === 'royal-white'
                        ? '#ffffff, #f8fafc, #f1f5f9'
                        : cardData.theme === 'emerald-gold'
                        ? '#064e3b, #022c22, #011a14'
                        : cardData.theme === 'carbon-dark'
                        ? '#1e293b, #0f172a, #020617'
                        : cardData.theme === 'ruby-burgundy'
                        ? '#4c0519, #27030d, #140106'
                        : '#073587, #05235c, #031530'
                    })`,
                    borderColor:
                      cardData.theme === 'royal-white'
                        ? '#cbd5e1'
                        : cardData.theme === 'carbon-dark'
                        ? '#475569'
                        : '#f59e0b'
                  }}
                >
                  {/* Outer & Inner Luxury Border */}
                  <div className="absolute inset-2 rounded-xl border border-amber-400/30 pointer-events-none" />

                  {/* Top: Brand Header */}
                  <div className="relative z-10 pt-1">
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block">
                      Réseau Professionnel & Numérique
                    </span>
                    <h2
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                      className={`text-lg sm:text-xl font-black uppercase tracking-wider mt-0.5 ${
                        cardData.theme === 'royal-white' ? 'text-[#073587]' : 'text-white'
                      }`}
                    >
                      {cardData.company || 'AFRICA WEB'}
                    </h2>
                  </div>

                  {/* Center: Large Scannable QR Code with Frame */}
                  <div className="relative z-10 bg-white p-2 rounded-xl border-2 border-amber-400 shadow-xl flex flex-col items-center">
                    {qrCodeDataUrl ? (
                      <img src={qrCodeDataUrl} alt="QR Code vCard" className="w-20 h-20 sm:w-24 sm:h-24" />
                    ) : (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-200 animate-pulse" />
                    )}
                    <span className="text-[9px] font-black text-[#073587] uppercase tracking-wide mt-1">
                      Scannez pour m'enregistrer
                    </span>
                  </div>

                  {/* Bottom: Slogan & Direct Web */}
                  <div className="relative z-10 pb-1">
                    <p className="text-[11px] font-bold text-slate-300 leading-snug">
                      « {cardData.tagline || 'Excellence, Présence en ligne & Solutions Numériques'} »
                    </p>
                    <div className="text-xs font-black text-amber-400 font-mono mt-1">
                      {cardData.website} · {cardData.phone}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ACTION BUTTONS (DOWNLOAD & SHARE SUITE) */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <span className="text-xs font-black uppercase text-slate-900 tracking-wider block">
                Téléchargement & Impression (Haute Résolution) :
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {/* 1. Download Recto */}
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => handleDownloadPNG('recto')}
                  className="py-2.5 px-3 bg-[#073587] hover:bg-[#05235c] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>Télécharger Recto (PNG HD)</span>
                </button>

                {/* 2. Download Verso */}
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => handleDownloadPNG('verso')}
                  className="py-2.5 px-3 bg-[#073587] hover:bg-[#05235c] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>Télécharger Verso (PNG HD)</span>
                </button>

                {/* 3. Download Full Pack (Both) */}
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={handleDownloadCombined}
                  className="py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Layers className="w-4 h-4 text-slate-950" />
                  <span>Pack Complet (Recto + Verso)</span>
                </button>

                {/* 4. Export vCard (.vcf) */}
                <button
                  type="button"
                  onClick={handleDownloadVCard}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Télécharger Contact vCard (.vcf)</span>
                </button>

                {/* 5. Print */}
                <button
                  type="button"
                  onClick={handlePrint}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-[#073587]" />
                  <span>Imprimer la Carte</span>
                </button>

                {/* 6. Share on WhatsApp */}
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white/20" />
                  <span>Partager sur WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Votre carte est générée directement dans votre navigateur en haute définition sans aucune inscription obligatoire.</span>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-800 hover:text-slate-950 underline cursor-pointer"
          >
            Fermer le générateur
          </button>
        </div>
      </div>
    </div>
  );
};

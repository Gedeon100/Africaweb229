import React, { useState, useEffect } from 'react';
import {
  X,
  BarChart3,
  Upload,
  Image as ImageIcon,
  Video,
  Plus,
  Trash2,
  Save,
  Check,
  RefreshCw,
  LogOut,
  Sliders,
  DollarSign,
  Smartphone,
  ExternalLink,
  Phone,
  Mail,
  Type,
  Palette,
  Layout,
  Eye,
  EyeOff,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  Lock,
  Key,
  GraduationCap,
  Edit3,
  User,
  BookOpen,
  CheckCircle2,
  Globe,
  Monitor,
  Play,
  Pause,
  RotateCcw,
  Share2,
  Copy,
  QrCode,
  Download,
  MessageCircle,
  Link2,
  Settings2
} from 'lucide-react';
import QRCode from 'qrcode';
import { useAgency, NavLinkItem } from '../context/AgencyContext';
import { PricingPackage, PricingOption } from '../data/agencyData';
import { compressImageFile, saveMediaBlob, deleteMediaBlob } from '../utils/mediaStorage';
import { parseUniversalVideoUrl, generateShareableVideoUrl } from '../utils/videoUtils';
import { sanitizeSlug, CustomLinkConfig } from '../utils/showcaseLink';

interface OwnerDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabKey =
  | 'mon-lien'
  | 'formations'
  | 'textes'
  | 'apropos'
  | 'media'
  | 'video'
  | 'produit'
  | 'header'
  | 'footer'
  | 'colors'
  | 'typography'
  | 'settings'
  | 'stats'
  | 'security';

export const OwnerDashboardModal: React.FC<OwnerDashboardModalProps> = ({ isOpen, onClose }) => {
  const {
    agencyInfo,
    pricingPackages,
    videoPresentation,
    analytics,
    siteTypography,
    siteColors,
    headerConfig,
    footerConfig,
    isOwnerLoggedIn,
    ownerEmail,
    logoutOwner,
    updateOwnerCredentials,
    updateAgencyInfo,
    updatePricingPackage,
    addPricingPackage,
    deletePricingPackage,
    updateVideoPresentation,
    deleteVideoPresentation,
    resetVideoPresentation,
    updateTypography,
    updateColors,
    updateHeaderConfig,
    toggleNavLinkVisibility,
    deleteNavLink,
    addNavLink,
    updateFooterConfig,
    simulateVisit,
    resetAnalytics,
    resetToDefaults,
    customLinkConfig,
    updateCustomLinkConfig,
    generatePersonalShareLink,
    clearCustomShowcase
  } = useAgency();

  const [activeTab, setActiveTab] = useState<TabKey>('mon-lien');
  const [toastMessage, setToastMessage] = useState<string>('');

  // Personal showcase link state
  const [personalShareUrl, setPersonalShareUrl] = useState<string>('');
  const [isGeneratingLink, setIsGeneratingLink] = useState<boolean>(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copiedPersonalLink, setCopiedPersonalLink] = useState<boolean>(false);

  // Link Personalization form state
  const [linkSlug, setLinkSlug] = useState<string>(customLinkConfig?.slug || 'samuel-pro');
  const [linkDisplayName, setLinkDisplayName] = useState<string>(customLinkConfig?.displayName || 'Samuel G. - Africa Web');
  const [linkCustomMessage, setLinkCustomMessage] = useState<string>(
    customLinkConfig?.customMessage ||
    "Bonjour ! Je suis Samuel d'Africa Web. Je vous invite à découvrir ma vitrine officielle en ligne : nos formations certifiées en vidéos IA et création web, nos tarifs et nos réalisations. Cliquez ici pour voir ma vitrine :"
  );
  const [linkFormat, setLinkFormat] = useState<'portable' | 'short'>(customLinkConfig?.linkFormat || 'portable');
  const [isSavingLinkConfig, setIsSavingLinkConfig] = useState<boolean>(false);

  const refreshPersonalLink = async (customOverrides?: Partial<CustomLinkConfig>) => {
    setIsGeneratingLink(true);
    try {
      const overrides: Partial<CustomLinkConfig> = {
        slug: sanitizeSlug(customOverrides?.slug ?? linkSlug),
        displayName: (customOverrides?.displayName ?? linkDisplayName).trim(),
        customMessage: (customOverrides?.customMessage ?? linkCustomMessage).trim(),
        linkFormat: customOverrides?.linkFormat ?? linkFormat
      };
      const url = await generatePersonalShareLink(overrides);
      setPersonalShareUrl(url);
      try {
        const qr = await QRCode.toDataURL(url, {
          width: 320,
          margin: 2,
          color: { dark: '#073587', light: '#ffffff' }
        });
        setQrCodeDataUrl(qr);
      } catch (qrErr) {
        console.warn('QR code generation error:', qrErr);
      }
    } catch (e) {
      console.error(e);
      showToast("Erreur lors de la génération du lien.");
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleSaveCustomLinkConfig = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingLinkConfig(true);
    try {
      const cleanedSlug = sanitizeSlug(linkSlug);
      setLinkSlug(cleanedSlug);
      const updatedConfig: CustomLinkConfig = {
        slug: cleanedSlug,
        displayName: linkDisplayName.trim() || 'Samuel G. - Africa Web',
        customMessage: linkCustomMessage.trim() || customLinkConfig.customMessage,
        linkFormat
      };
      updateCustomLinkConfig(updatedConfig);
      await refreshPersonalLink(updatedConfig);
      showToast("Personnalisation de votre lien enregistrée avec succès !");
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de l'enregistrement de la personnalisation.");
    } finally {
      setIsSavingLinkConfig(false);
    }
  };

  // Security Credentials state
  const [secEmail, setSecEmail] = useState(ownerEmail);
  const [secNewPassword, setSecNewPassword] = useState('');
  const [secConfirmPassword, setSecConfirmPassword] = useState('');
  const [showSecPassword, setShowSecPassword] = useState(false);
  const [secError, setSecError] = useState('');
  const [secSuccess, setSecSuccess] = useState('');

  // Delete & reset confirmation states
  const [deletePackageId, setDeletePackageId] = useState<string | null>(null);
  const [deleteNavConfirmId, setDeleteNavConfirmId] = useState<string | null>(null);
  const [resetConfirm, setResetConfirm] = useState<boolean>(false);
  const [deleteVideoConfirm, setDeleteVideoConfirm] = useState<boolean>(false);

  // Textes & Hero state
  const [heroHeadline, setHeroHeadline] = useState(agencyInfo.heroHeadline || '');
  const [heroSubtitle, setHeroSubtitle] = useState(agencyInfo.heroSubtitle || '');
  const [heroKicker, setHeroKicker] = useState(agencyInfo.heroKicker || '');
  const [agencyName, setAgencyName] = useState(agencyInfo.name || '');
  const [agencySlogan, setAgencySlogan] = useState(agencyInfo.slogan || '');
  const [agencyMotto, setAgencyMotto] = useState(agencyInfo.motto || '');

  // À Propos state
  const [aboutTitle, setAboutTitle] = useState(agencyInfo.aboutTitle || '');
  const [aboutText, setAboutText] = useState(agencyInfo.aboutText || '');
  const [responsableName, setResponsableName] = useState(agencyInfo.responsableName || '');
  const [responsableRole, setResponsableRole] = useState(agencyInfo.responsableRole || '');
  const [responsableBio, setResponsableBio] = useState(agencyInfo.responsableBio || '');

  // Media state
  const [logoPreview, setLogoPreview] = useState(agencyInfo.logoUrl);
  const [responsablePreview, setResponsablePreview] = useState(agencyInfo.responsablePhoto);
  const [productImagePreview, setProductImagePreview] = useState(agencyInfo.featuredProduct.image);

  // Video state
  const [videoTitle, setVideoTitle] = useState(videoPresentation.title);
  const [videoSubtitle, setVideoSubtitle] = useState(videoPresentation.subtitle);
  const [videoUrl, setVideoUrl] = useState(videoPresentation.videoUrl);
  const [videoVisible, setVideoVisible] = useState(videoPresentation.visible !== false);
  const [videoDuration, setVideoDuration] = useState(videoPresentation.duration || '02:45 min');

  // Featured Product state
  const [productTitle, setProductTitle] = useState(agencyInfo.featuredProduct.title);
  const [productSubtitle, setProductSubtitle] = useState(agencyInfo.featuredProduct.subtitle);
  const [productBadge, setProductBadge] = useState(agencyInfo.featuredProduct.badge);
  const [productLink, setProductLink] = useState(agencyInfo.featuredProduct.link);
  const [productVisible, setProductVisible] = useState(agencyInfo.featuredProduct.visible !== false);
  const [productHighlights, setProductHighlights] = useState(agencyInfo.featuredProduct.highlights.join('\n'));

  // Settings & Contacts state
  const [whatsappNum, setWhatsappNum] = useState(agencyInfo.whatsappNumber);
  const [whatsappDisplay, setWhatsappDisplay] = useState(agencyInfo.whatsappDisplay);
  const [emailAddr, setEmailAddr] = useState(agencyInfo.email);

  // Typography state
  const [tempFontFamily, setTempFontFamily] = useState(siteTypography.fontFamily);
  const [tempFontSize, setTempFontSize] = useState(siteTypography.fontSize);
  const [tempFontWeight, setTempFontWeight] = useState(siteTypography.fontWeight);

  const [tempTitleFontFamily, setTempTitleFontFamily] = useState(
    siteTypography.titleFontFamily || siteTypography.fontFamily || 'Arial, Helvetica, sans-serif'
  );
  const [tempTitleFontSize, setTempTitleFontSize] = useState(siteTypography.titleFontSize || 36);
  const [tempTitleFontWeight, setTempTitleFontWeight] = useState(siteTypography.titleFontWeight || '900');

  const [tempSubtitleFontFamily, setTempSubtitleFontFamily] = useState(
    siteTypography.subtitleFontFamily || siteTypography.fontFamily || 'Arial, Helvetica, sans-serif'
  );
  const [tempSubtitleFontSize, setTempSubtitleFontSize] = useState(siteTypography.subtitleFontSize || 16);
  const [tempSubtitleFontWeight, setTempSubtitleFontWeight] = useState(siteTypography.subtitleFontWeight || '600');

  const [tempPriceFontFamily, setTempPriceFontFamily] = useState(
    siteTypography.priceFontFamily || 'Arial, Helvetica, sans-serif'
  );
  const [tempPriceFontSize, setTempPriceFontSize] = useState(siteTypography.priceFontSize || 32);
  const [tempPriceFontWeight, setTempPriceFontWeight] = useState(siteTypography.priceFontWeight || '900');

  // Colors state
  const [tempPrimary, setTempPrimary] = useState(siteColors.primary);
  const [tempDark, setTempDark] = useState(siteColors.primaryDark);
  const [tempAccent, setTempAccent] = useState(siteColors.accent);
  const [tempBg, setTempBg] = useState(siteColors.bgColor);
  const [tempText, setTempText] = useState(siteColors.textColor);

  // Header state
  const [tempBrandTitle, setTempBrandTitle] = useState(headerConfig.brandTitle);
  const [tempBrandHighlight, setTempBrandHighlight] = useState(headerConfig.brandHighlight);
  const [tempBrandSubtitle, setTempBrandSubtitle] = useState(headerConfig.brandSubtitle);
  const [showWhatsAppBtn, setShowWhatsAppBtn] = useState(headerConfig.showWhatsAppBtn);
  const [showOrderBtn, setShowOrderBtn] = useState(headerConfig.showOrderBtn);
  const [newNavLabel, setNewNavLabel] = useState('');
  const [newNavHref, setNewNavHref] = useState('');

  // Footer state
  const [tempCopyright, setTempCopyright] = useState(footerConfig.copyrightText);
  const [showBrandBlock, setShowBrandBlock] = useState(footerConfig.showBrandBlock);
  const [showServicesBlock, setShowServicesBlock] = useState(footerConfig.showServicesBlock);
  const [showQuickLinksBlock, setShowQuickLinksBlock] = useState(footerConfig.showQuickLinksBlock);

  // Upload status
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  // Add new package state
  const [newPkgName, setNewPkgName] = useState('');
  const [newPkgPrice, setNewPkgPrice] = useState('');
  const [newPkgDesc, setNewPkgDesc] = useState('');
  const [newPkgTools, setNewPkgTools] = useState('');
  const [newPkgFeatures, setNewPkgFeatures] = useState('');

  // Synchronize local form inputs when modal is opened
  useEffect(() => {
    if (isOpen) {
      setHeroHeadline(agencyInfo.heroHeadline || '');
      setHeroSubtitle(agencyInfo.heroSubtitle || '');
      setHeroKicker(agencyInfo.heroKicker || '');
      setAgencyName(agencyInfo.name || '');
      setAgencySlogan(agencyInfo.slogan || '');
      setAgencyMotto(agencyInfo.motto || '');

      setAboutTitle(agencyInfo.aboutTitle || '');
      setAboutText(agencyInfo.aboutText || '');
      setResponsableName(agencyInfo.responsableName || '');
      setResponsableRole(agencyInfo.responsableRole || '');
      setResponsableBio(agencyInfo.responsableBio || '');

      setLogoPreview(agencyInfo.logoUrl);
      setResponsablePreview(agencyInfo.responsablePhoto);
      setProductImagePreview(agencyInfo.featuredProduct.image);

      setVideoTitle(videoPresentation.title);
      setVideoSubtitle(videoPresentation.subtitle);
      setVideoUrl(videoPresentation.videoUrl);
      setVideoVisible(videoPresentation.visible !== false);
      setVideoDuration(videoPresentation.duration || '02:45 min');

      setProductTitle(agencyInfo.featuredProduct.title);
      setProductSubtitle(agencyInfo.featuredProduct.subtitle);
      setProductBadge(agencyInfo.featuredProduct.badge);
      setProductLink(agencyInfo.featuredProduct.link);
      setProductVisible(agencyInfo.featuredProduct.visible !== false);
      setProductHighlights(agencyInfo.featuredProduct.highlights.join('\n'));

      setWhatsappNum(agencyInfo.whatsappNumber);
      setWhatsappDisplay(agencyInfo.whatsappDisplay);
      setEmailAddr(agencyInfo.email);

      setTempFontFamily(siteTypography.fontFamily);
      setTempFontSize(siteTypography.fontSize);
      setTempFontWeight(siteTypography.fontWeight);

      setTempTitleFontFamily(siteTypography.titleFontFamily || siteTypography.fontFamily || 'Arial, Helvetica, sans-serif');
      setTempTitleFontSize(siteTypography.titleFontSize || 36);
      setTempTitleFontWeight(siteTypography.titleFontWeight || '900');

      setTempSubtitleFontFamily(siteTypography.subtitleFontFamily || siteTypography.fontFamily || 'Arial, Helvetica, sans-serif');
      setTempSubtitleFontSize(siteTypography.subtitleFontSize || 16);
      setTempSubtitleFontWeight(siteTypography.subtitleFontWeight || '600');

      setTempPriceFontFamily(siteTypography.priceFontFamily || 'Arial, Helvetica, sans-serif');
      setTempPriceFontSize(siteTypography.priceFontSize || 32);
      setTempPriceFontWeight(siteTypography.priceFontWeight || '900');

      setTempPrimary(siteColors.primary);
      setTempDark(siteColors.primaryDark);
      setTempAccent(siteColors.accent);
      setTempBg(siteColors.bgColor);
      setTempText(siteColors.textColor);

      setTempBrandTitle(headerConfig.brandTitle);
      setTempBrandHighlight(headerConfig.brandHighlight);
      setTempBrandSubtitle(headerConfig.brandSubtitle);
      setShowWhatsAppBtn(headerConfig.showWhatsAppBtn);
      setShowOrderBtn(headerConfig.showOrderBtn);

      setTempCopyright(footerConfig.copyrightText);
      setShowBrandBlock(footerConfig.showBrandBlock);
      setShowServicesBlock(footerConfig.showServicesBlock);
      setShowQuickLinksBlock(footerConfig.showQuickLinksBlock);

      setSecEmail(ownerEmail);
      setSecNewPassword('');
      setSecConfirmPassword('');
      setSecError('');
      setSecSuccess('');

      // Sync custom link inputs
      if (customLinkConfig) {
        setLinkSlug(customLinkConfig.slug || 'samuel-pro');
        setLinkDisplayName(customLinkConfig.displayName || 'Samuel G. - Africa Web');
        setLinkCustomMessage(customLinkConfig.customMessage || '');
        setLinkFormat(customLinkConfig.linkFormat || 'portable');
      }

      // Auto-generate fresh personal showcase link
      refreshPersonalLink();
    }
  }, [isOpen, agencyInfo, videoPresentation, siteTypography, siteColors, headerConfig, footerConfig, ownerEmail, customLinkConfig]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Safe Image Upload with automatic canvas compression
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (dataUrl: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus("Traitement et optimisation de l'image...");
    try {
      const compressedDataUrl = await compressImageFile(file, 1200, 1200, 0.85);
      callback(compressedDataUrl);
      showToast("Photo importée et optimisée avec succès !");
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de l'import de l'image. Veuillez réessayer.");
    } finally {
      setIsUploading(false);
      setUploadStatus('');
      e.target.value = '';
    }
  };

  // Safe Video Upload with IndexedDB storage (Android & PC compatible)
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      showToast("Veuillez sélectionner un fichier vidéo valide (MP4, WebM, MOV, etc.).");
      return;
    }

    setIsUploading(true);
    setUploadStatus("Enregistrement du fichier vidéo en mémoire sécurisée...");
    try {
      await saveMediaBlob('presentation_video', file);
      const blobUrl = URL.createObjectURL(file);
      setVideoUrl(blobUrl);
      setVideoVisible(true);
      updateVideoPresentation({
        videoUrl: blobUrl,
        videoType: 'upload',
        visible: true
      });
      showToast("Nouvelle vidéo importée et enregistrée avec succès !");
    } catch (err) {
      console.error(err);
      showToast("Erreur lors du traitement de la vidéo.");
    } finally {
      setIsUploading(false);
      setUploadStatus('');
      e.target.value = '';
    }
  };

  // Delete Video Presentation
  const handleDeleteVideo = async () => {
    try {
      await deleteVideoPresentation();
      setVideoUrl('');
      setVideoVisible(false);
      setDeleteVideoConfirm(false);
      showToast("Vidéo supprimée avec succès ! La section a été masquée.");
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de la suppression de la vidéo.");
    }
  };

  // Reset Video to Default Official Presentation
  const handleResetVideoToDemo = async () => {
    try {
      await resetVideoPresentation();
      const defaultUrl = "/assets/aistudio/AfricaWeb_22ef340a.mp4";
      setVideoUrl(defaultUrl);
      setVideoTitle("Présentation Officielle d'Africa Web Agence Numérique");
      setVideoSubtitle("Découvrez notre expertise : sites vitrines pros, e-commerce, catalogues et formations d'élite.");
      setVideoDuration("00:50 min");
      setVideoVisible(true);
      showToast("Vidéo officielle Africa Web 2026 (avec voix & smartphone) restaurée avec succès !");
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de la réinitialisation de la vidéo.");
    }
  };

  // Apply Video URL
  const handleApplyVideoUrl = () => {
    if (!videoUrl.trim()) {
      showToast("Veuillez saisir une URL vidéo valide.");
      return;
    }
    setVideoVisible(true);
    updateVideoPresentation({
      videoUrl: videoUrl.trim(),
      visible: true
    });
    showToast("URL de la vidéo appliquée et enregistrée avec succès !");
  };

  // 1. Save Textes & Hero
  const handleSaveTextes = (e: React.FormEvent) => {
    e.preventDefault();
    updateAgencyInfo({
      name: agencyName.trim() || agencyInfo.name,
      slogan: agencySlogan.trim(),
      motto: agencyMotto.trim(),
      heroHeadline: heroHeadline.trim(),
      heroSubtitle: heroSubtitle.trim(),
      heroKicker: heroKicker.trim()
    });
    showToast("Textes principaux et Hero enregistrés !");
  };

  // 2. Save À Propos & Équipe
  const handleSaveAbout = (e: React.FormEvent) => {
    e.preventDefault();
    updateAgencyInfo({
      aboutTitle: aboutTitle.trim(),
      aboutText: aboutText.trim(),
      responsableName: responsableName.trim(),
      responsableRole: responsableRole.trim(),
      responsableBio: responsableBio.trim()
    });
    showToast("Section À Propos & Responsable enregistrée !");
  };

  // 3. Save Media
  const handleSaveMedia = () => {
    updateAgencyInfo({
      logoUrl: logoPreview,
      responsablePhoto: responsablePreview,
      featuredProduct: {
        ...agencyInfo.featuredProduct,
        image: productImagePreview
      }
    });
    showToast("Photos et logo enregistrés avec succès !");
  };

  // 4. Save Video
  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    updateVideoPresentation({
      title: videoTitle.trim(),
      subtitle: videoSubtitle.trim(),
      videoUrl: videoUrl.trim(),
      duration: videoDuration.trim(),
      visible: videoVisible
    });
    showToast("Configuration de la vidéo enregistrée !");
  };

  // 5. Save Featured Product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const highlightsArray = productHighlights
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    updateAgencyInfo({
      featuredProduct: {
        ...agencyInfo.featuredProduct,
        title: productTitle.trim(),
        subtitle: productSubtitle.trim(),
        badge: productBadge.trim(),
        link: productLink.trim(),
        visible: productVisible,
        image: productImagePreview,
        highlights: highlightsArray.length > 0 ? highlightsArray : agencyInfo.featuredProduct.highlights
      }
    });
    showToast("Produit vedette mis à jour avec succès !");
  };

  // 6. Save Typography
  const handleSaveTypography = () => {
    updateTypography({
      fontFamily: tempFontFamily,
      fontSize: tempFontSize,
      fontWeight: tempFontWeight,
      titleFontFamily: tempTitleFontFamily,
      titleFontSize: tempTitleFontSize,
      titleFontWeight: tempTitleFontWeight,
      subtitleFontFamily: tempSubtitleFontFamily,
      subtitleFontSize: tempSubtitleFontSize,
      subtitleFontWeight: tempSubtitleFontWeight,
      priceFontFamily: tempPriceFontFamily,
      priceFontSize: tempPriceFontSize,
      priceFontWeight: tempPriceFontWeight
    });
    showToast("Typographies (titres, sous-titres, corps, prix) enregistrées !");
  };

  // 7. Save Colors
  const handleSaveColors = () => {
    updateColors({
      primary: tempPrimary,
      primaryDark: tempDark,
      accent: tempAccent,
      bgColor: tempBg,
      textColor: tempText
    });
    showToast("Palette de couleurs du site enregistrée !");
  };

  const applyColorPreset = (preset: { primary: string; dark: string; accent: string; bg: string; text: string; name: string }) => {
    setTempPrimary(preset.primary);
    setTempDark(preset.dark);
    setTempAccent(preset.accent);
    setTempBg(preset.bg);
    setTempText(preset.text);
    updateColors({
      primary: preset.primary,
      primaryDark: preset.dark,
      accent: preset.accent,
      bgColor: preset.bg,
      textColor: preset.text
    });
    showToast(`Palette "${preset.name}" appliquée !`);
  };

  // 8. Save Header
  const handleSaveHeader = () => {
    updateHeaderConfig({
      brandTitle: tempBrandTitle.trim(),
      brandHighlight: tempBrandHighlight.trim(),
      brandSubtitle: tempBrandSubtitle.trim(),
      showWhatsAppBtn,
      showOrderBtn
    });
    showToast("Entête principale à ligne unique enregistrée !");
  };

  const handleAddNavLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNavLabel.trim() || !newNavHref.trim()) return;
    addNavLink({
      id: `nav-${Date.now()}`,
      label: newNavLabel.trim(),
      href: newNavHref.trim(),
      visible: true
    });
    setNewNavLabel('');
    setNewNavHref('');
    showToast("Nouvel onglet ajouté au menu !");
  };

  // 9. Save Footer
  const handleSaveFooter = () => {
    updateFooterConfig({
      copyrightText: tempCopyright.trim(),
      showBrandBlock,
      showServicesBlock,
      showQuickLinksBlock
    });
    showToast("Bas de page mis à jour !");
  };

  // 10. Save Contacts
  const handleSaveSettings = () => {
    const cleanNum = whatsappNum.replace(/\s+/g, '').replace('+', '');
    updateAgencyInfo({
      whatsappNumber: cleanNum,
      whatsappDisplay: whatsappDisplay.trim() || (cleanNum.startsWith('229') ? `+229 ${cleanNum.slice(3, 5)} ${cleanNum.slice(5, 7)} ${cleanNum.slice(7, 9)} ${cleanNum.slice(9, 11)}` : cleanNum),
      email: emailAddr.trim()
    });
    showToast("Coordonnées WhatsApp & Email enregistrées !");
  };

  // 11. Security Credentials
  const handleSaveSecurityCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setSecError('');
    setSecSuccess('');

    if (secNewPassword && secNewPassword !== secConfirmPassword) {
      setSecError('Le nouveau mot de passe et sa confirmation ne correspondent pas.');
      return;
    }

    if (secNewPassword && secNewPassword.length < 6) {
      setSecError('Le nouveau mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    const res = updateOwnerCredentials(secEmail, secNewPassword || undefined);
    if (!res.success) {
      setSecError(res.error || 'Erreur lors de la mise à jour des identifiants.');
    } else {
      setSecSuccess('Identifiants propriétaire mis à jour avec succès !');
      setSecNewPassword('');
      setSecConfirmPassword('');
      showToast("Identifiants confidentiels enregistrés !");
    }
  };

  // Add new package
  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkgName.trim() || !newPkgPrice.trim()) {
      showToast("Veuillez renseigner au moins le nom et le tarif.");
      return;
    }

    const newPkg: PricingPackage = {
      id: `formation-${Date.now()}`,
      name: newPkgName.trim(),
      badge: "Formation Certifiée",
      price: newPkgPrice.trim(),
      period: "accès complet",
      delay: "Accès immédiat",
      hosting: "Inclus",
      description: newPkgDesc.trim() || "Programme de formation pratique intensif.",
      tools: newPkgTools ? newPkgTools.split(',').map(s => s.trim()) : ["Outils Pro"],
      features: newPkgFeatures
        ? newPkgFeatures.split('\n').map(s => s.trim()).filter(s => s.length > 0)
        : ["Support dédié", "Accès à vie", "Pratique guidée"],
      buttonText: "S'inscrire à cette formation",
      whatsappMessage: `Bonjour Africa Web, je souhaite m'inscrire à la formation : ${newPkgName.trim()}`
    };

    addPricingPackage(newPkg);
    setNewPkgName('');
    setNewPkgPrice('');
    setNewPkgDesc('');
    setNewPkgTools('');
    setNewPkgFeatures('');
    showToast("Nouvelle formation ajoutée avec succès !");
  };

  const totalClicks = analytics.clicksWhatsApp + analytics.clicksEmail + analytics.clicksFeaturedProduct + analytics.clicksQuoteForm;
  const ctrRate = analytics.totalVisits > 0
    ? ((totalClicks / analytics.totalVisits) * 100).toFixed(1)
    : '0.0';

  // Compact Tabs definition
  const tabs: { id: TabKey; label: string; icon: React.ElementType }[] = [
    { id: 'mon-lien', label: 'Lien Personnel (Partage)', icon: Share2 },
    { id: 'formations', label: 'Formations & Tarifs', icon: GraduationCap },
    { id: 'video', label: 'Vidéo', icon: Video },
    { id: 'textes', label: 'Textes & Hero', icon: Edit3 },
    { id: 'apropos', label: 'À Propos & Équipe', icon: User },
    { id: 'media', label: 'Photos & Logo', icon: ImageIcon },
    { id: 'produit', label: 'Produit Vedette', icon: Sparkles },
    { id: 'header', label: 'Entête & Menu', icon: Layout },
    { id: 'footer', label: 'Bas de Page', icon: Layout },
    { id: 'colors', label: 'Couleurs', icon: Palette },
    { id: 'typography', label: 'Polices & Tailles', icon: Type },
    { id: 'settings', label: 'WhatsApp & Contact', icon: Phone },
    { id: 'stats', label: 'Statistiques', icon: BarChart3 },
    { id: 'security', label: 'Sécurité & Accès', icon: Key },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
      <div
        className="bg-white rounded-2xl max-w-5xl max-w-[calc(100vw-1rem)] w-full border border-slate-200 shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-4 right-4 z-50 bg-emerald-600 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Uploading Status Banner */}
        {isUploading && (
          <div className="absolute top-4 left-4 z-50 bg-amber-500 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>{uploadStatus || "Importation en cours..."}</span>
          </div>
        )}

        {/* Modal Top Header */}
        <div className="bg-[#05235c] text-white px-4 py-3 sm:px-6 sm:py-3.5 flex items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black tracking-tight flex items-center gap-2">
                <span>Panneau de Contrôle Propriétaire</span>
                <span className="hidden sm:inline-block text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full font-bold">
                  {ownerEmail}
                </span>
              </h2>
              <p className="text-[11px] text-slate-300 font-medium hidden sm:block">
                Modifiez tout sur votre plateforme : formations, textes, prix, photos, couleurs, vidéo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('mon-lien');
                refreshPersonalLink();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-xs cursor-pointer ring-1 ring-amber-300"
              title="Générer et copier votre lien de vitrine personnalisé"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-950" />
              <span className="hidden sm:inline">Mon Lien Personnel</span>
            </button>

            <button
              onClick={() => {
                logoutOwner();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all shadow-xs cursor-pointer"
              title="Se déconnecter"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Compact, Sleek Action Button Tabs Bar (Reduit et fluide) */}
        <div className="bg-slate-900 px-3 py-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === 'mon-lien') {
                      refreshPersonalLink();
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 font-black shadow-xs ring-1 ring-amber-300'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-750'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
          {/* TAB 0: MON LIEN PERSONNEL DE VITRINE & PERSONNALISATION */}
          {activeTab === 'mon-lien' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Hero Banner Card with Active Shareable Link */}
              <div className="bg-gradient-to-br from-[#073587] via-[#05235c] to-slate-950 text-white p-5 sm:p-6 rounded-2xl shadow-md space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
                      <Share2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                        <span>Lien Personnel de Votre Vitrine</span>
                        <span className="text-[10px] bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 px-2.5 py-0.5 rounded-full font-bold">
                          {linkSlug ? `/${linkSlug}` : 'Personnalisé'}
                        </span>
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-200 font-medium">
                        Partagez ce lien avec vos prospects : ils verront directement votre vitrine avec votre vidéo, vos tarifs et votre contact WhatsApp.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => refreshPersonalLink()}
                    disabled={isGeneratingLink}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingLink ? 'animate-spin' : ''}`} />
                    <span>{isGeneratingLink ? 'Génération...' : 'Actualiser le lien'}</span>
                  </button>
                </div>

                {/* The Share Link Box */}
                <div className="bg-slate-900/90 rounded-xl p-3 sm:p-4 border border-slate-700/80 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Votre lien de vitrine personnalisé :</span>
                    </span>
                    <span className="text-emerald-400 text-[11px] font-mono flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Prêt à envoyer
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      readOnly
                      value={personalShareUrl || "Génération du lien personnalisé en cours..."}
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                      className="flex-grow text-xs font-mono px-3.5 py-2.5 bg-slate-950 text-amber-300 border border-slate-700 rounded-xl outline-none select-all"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (personalShareUrl && navigator.clipboard) {
                          navigator.clipboard.writeText(personalShareUrl).then(() => {
                            setCopiedPersonalLink(true);
                            showToast("Lien personnel copié ! Vous pouvez le coller sur WhatsApp ou par SMS.");
                            setTimeout(() => setCopiedPersonalLink(false), 2500);
                          });
                        }
                      }}
                      className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl transition-colors inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      {copiedPersonalLink ? <Check className="w-4 h-4 text-emerald-900" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedPersonalLink ? 'Copié !' : 'Copier mon lien'}</span>
                    </button>
                  </div>

                  {/* Quick Action Buttons: WhatsApp & Test in New Tab */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`${linkCustomMessage.trim() || "Bonjour ! Voici le lien direct vers ma vitrine Africa Web :"}\n\n${personalShareUrl}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition-colors cursor-pointer shadow-xs"
                    >
                      <MessageCircle className="w-4 h-4 fill-white/20" />
                      <span>Envoyer sur WhatsApp avec mon message</span>
                    </a>

                    <a
                      href={personalShareUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer border border-slate-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Tester dans un nouvel onglet</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* SECTION: PERSONNALISER MON LIEN */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#073587] text-white flex items-center justify-center font-bold shrink-0">
                      <Settings2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900">
                        Personnaliser Mon Lien & Mon Message
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Définissez votre propre nom pour le lien (slug), votre titre et le message envoyé sur WhatsApp.
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    Modifiable à tout moment
                  </span>
                </div>

                <form onSubmit={handleSaveCustomLinkConfig} className="space-y-4">
                  {/* Champ 1: Identifiant personnalisé / Slug */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-800 uppercase">
                      1. Identifiant unique de votre lien (Slug / Nom court) :
                    </label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <div className="flex items-center bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-600 shrink-0">
                        <span>https://{typeof window !== 'undefined' ? window.location.host : 'africaweb.com'}/?v=</span>
                      </div>
                      <input
                        type="text"
                        value={linkSlug}
                        onChange={(e) => {
                          const val = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
                          setLinkSlug(val);
                        }}
                        onBlur={() => setLinkSlug(sanitizeSlug(linkSlug))}
                        placeholder="samuel-pro"
                        className="flex-grow text-xs font-mono font-bold px-3 py-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#073587] text-[#073587]"
                      />
                    </div>

                    {/* Suggestions rapides en 1 clic */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                      <span className="font-bold text-slate-500">Suggestions rapides :</span>
                      {['samuel', 'samuel-pro', 'africaweb-benin', 'expert-digital', 'kgm-services'].map((sug) => (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => {
                            setLinkSlug(sug);
                            refreshPersonalLink({ slug: sug });
                            showToast(`Identifiant "${sug}" appliqué !`);
                          }}
                          className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold cursor-pointer border transition-colors ${
                            linkSlug === sug
                              ? 'bg-[#073587] text-white border-[#073587]'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                          }`}
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Champ 2: Titre de la vitrine affiché */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                        2. Titre ou Nom d'accueil de votre vitrine :
                      </label>
                      <input
                        type="text"
                        value={linkDisplayName}
                        onChange={(e) => setLinkDisplayName(e.target.value)}
                        placeholder="Samuel G. - Africa Web"
                        className="w-full text-xs font-bold px-3 py-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#073587]"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">
                        Exemple : "Samuel G. - Africa Web" ou "Direction Clientèle"
                      </p>
                    </div>

                    {/* Champ 3: Format du lien */}
                    <div>
                      <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                        3. Format de partage du lien :
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <label
                          onClick={() => {
                            setLinkFormat('portable');
                            refreshPersonalLink({ linkFormat: 'portable' });
                          }}
                          className={`p-2.5 rounded-xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                            linkFormat === 'portable'
                              ? 'border-[#073587] bg-blue-50/70 text-[#073587]'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="linkFormat"
                              checked={linkFormat === 'portable'}
                              onChange={() => {}}
                              className="text-[#073587]"
                            />
                            <span className="text-xs font-black">Universel (Recommandé)</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1 leading-tight">
                            Porte votre nom & garantit l'affichage à 100% sur mobile
                          </p>
                        </label>

                        <label
                          onClick={() => {
                            setLinkFormat('short');
                            refreshPersonalLink({ linkFormat: 'short' });
                          }}
                          className={`p-2.5 rounded-xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                            linkFormat === 'short'
                              ? 'border-[#073587] bg-blue-50/70 text-[#073587]'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="linkFormat"
                              checked={linkFormat === 'short'}
                              onChange={() => {}}
                              className="text-[#073587]"
                            />
                            <span className="text-xs font-black">Ultra-Court Épuré</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1 leading-tight">
                            Format ?v={linkSlug || 'nom'} idéal pour cartes & affiches
                          </p>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Champ 4: Message WhatsApp personnalisé */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-black text-slate-800 uppercase">
                        4. Message d'invitation WhatsApp personnalisé :
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const def = "Bonjour ! Je suis Samuel d'Africa Web. Je vous invite à découvrir ma vitrine officielle en ligne : formations certifiées en vidéos IA et création web, nos tarifs et nos réalisations. Cliquez ici pour voir ma vitrine :";
                          setLinkCustomMessage(def);
                          showToast("Message par défaut rétabli.");
                        }}
                        className="text-[10px] text-[#073587] hover:underline font-bold cursor-pointer"
                      >
                        Rétablir le message par défaut
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={linkCustomMessage}
                      onChange={(e) => setLinkCustomMessage(e.target.value)}
                      placeholder="Tapez le message qui accompagnera votre lien sur WhatsApp..."
                      className="w-full text-xs font-medium p-3 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#073587] leading-relaxed"
                    />
                    <p className="text-[10px] text-slate-500">
                      Ce texte sera automatiquement inséré dans WhatsApp lorsque vous cliquerez sur le bouton "Partager sur WhatsApp".
                    </p>
                  </div>

                  {/* Bouton d'Enregistrement de la personnalisation */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-600">
                      Nom actif du lien : <strong className="text-[#073587] font-mono">/?v={linkSlug}</strong>
                    </p>

                    <button
                      type="submit"
                      disabled={isSavingLinkConfig}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#073587] hover:bg-[#05235c] text-white text-xs font-black rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSavingLinkConfig ? 'Enregistrement...' : 'Enregistrer la personnalisation de mon lien'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* QR Code and Content Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Column 1: QR Code Card */}
                <div className="md:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center flex flex-col items-center justify-between space-y-4">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 mb-1 flex items-center justify-center gap-2">
                      <QrCode className="w-4 h-4 text-[#073587]" />
                      <span>QR Code de Votre Vitrine Personnalisée</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium max-w-xs">
                      Ce QR Code mène directement vers votre vitrine <strong>/{linkSlug}</strong> avec toutes vos modifications.
                    </p>
                  </div>

                  {qrCodeDataUrl ? (
                    <div className="p-3 bg-white rounded-2xl border-2 border-slate-200 shadow-inner inline-block">
                      <img
                        src={qrCodeDataUrl}
                        alt="QR Code Vitrine Personnelle"
                        className="w-44 h-44 sm:w-52 sm:h-52 object-contain rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="w-44 h-44 bg-slate-100 rounded-xl flex items-center justify-center text-xs text-slate-400 animate-pulse">
                      Génération du QR Code...
                    </div>
                  )}

                  {qrCodeDataUrl && (
                    <a
                      href={qrCodeDataUrl}
                      download={`qrcode-vitrine-${linkSlug || 'africa-web'}.png`}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                    >
                      <Download className="w-4 h-4" />
                      <span>Télécharger le QR Code PNG ({linkSlug})</span>
                    </a>
                  )}
                </div>

                {/* Column 2: What is included in this personal showcase */}
                <div className="md:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
                  <h4 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Récapitulatif de votre vitrine personnalisée</span>
                  </h4>

                  <div className="space-y-2.5 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-500 uppercase text-[10px]">Identifiant & Titre :</span>
                        <span className="font-mono text-[10px] bg-blue-100 text-[#073587] font-bold px-2 py-0.5 rounded">
                          ?v={linkSlug}
                        </span>
                      </div>
                      <p className="font-black text-slate-900">{linkDisplayName || agencyName || agencyInfo.name}</p>
                      <p className="text-slate-600 text-[11px] line-clamp-2">{heroHeadline || agencyInfo.heroHeadline}</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-500 uppercase text-[10px]">Vidéo active incluse :</span>
                      <div className="flex items-center justify-between">
                        <p className="font-black text-[#073587] truncate">{videoTitle || videoPresentation.title}</p>
                        <span className="text-[10px] bg-blue-100 text-[#073587] font-bold px-2 py-0.5 rounded-full shrink-0">
                          {videoDuration || videoPresentation.duration || '50s'}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[10px] font-mono truncate">{videoUrl || videoPresentation.videoUrl}</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-500 uppercase text-[10px]">Numéro WhatsApp connecté :</span>
                      <p className="font-bold text-emerald-700">
                        {whatsappDisplay || agencyInfo.whatsappDisplay} (Les demandes arrivent directement sur votre WhatsApp)
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-500 uppercase text-[10px]">Formations & Tarifs :</span>
                      <p className="font-bold text-slate-900">{pricingPackages.length} formations enregistrées avec vos tarifs et options</p>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500 font-medium">Vous venez de modifier un tarif ou la vidéo ?</span>
                    <button
                      type="button"
                      onClick={() => refreshPersonalLink()}
                      className="text-[#073587] hover:underline font-black text-xs cursor-pointer flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Régénérer mon lien maintenant →</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: FORMATIONS & TARIFS */}
          {activeTab === 'formations' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Gérer les 5 Formations Officielles & Tarifs
                    </h3>
                    <p className="text-xs text-slate-600 font-semibold">
                      Modifiez directement les intitulés, prix (10 000f, 15 000f, 5 000f, 25 000f/15 000f, 20 000f), sous-options et outils.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {pricingPackages.map((pkg, index) => (
                    <div key={pkg.id} className="p-4 rounded-xl border-2 border-slate-200 bg-slate-50/50 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                        <span className="text-xs font-black text-[#073587] uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-[#073587] text-white flex items-center justify-center text-[11px]">
                            {index + 1}
                          </span>
                          <span>{pkg.name}</span>
                        </span>

                        <div className="flex items-center gap-2">
                          <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={pkg.popular || false}
                              onChange={(e) => updatePricingPackage(pkg.id, { popular: e.target.checked })}
                              className="rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                            />
                            <span>Mettre en avant</span>
                          </label>

                          {deletePackageId === pkg.id ? (
                            <div className="flex items-center gap-1.5 bg-red-100 p-1 rounded-lg border border-red-300 text-xs">
                              <span className="text-red-700 font-bold">Confirmer ?</span>
                              <button
                                onClick={() => {
                                  deletePricingPackage(pkg.id);
                                  setDeletePackageId(null);
                                  showToast("Formation supprimée.");
                                }}
                                className="px-2 py-0.5 bg-red-600 text-white rounded font-black hover:bg-red-700"
                              >
                                Oui
                              </button>
                              <button
                                onClick={() => setDeletePackageId(null)}
                                className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded font-bold"
                              >
                                Non
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeletePackageId(pkg.id)}
                              className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                              title="Supprimer cette formation"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-6">
                          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                            Titre de la formation
                          </label>
                          <input
                            type="text"
                            value={pkg.name}
                            onChange={(e) => updatePricingPackage(pkg.id, { name: e.target.value })}
                            className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#073587] outline-none"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                            Prix affiché
                          </label>
                          <input
                            type="text"
                            value={pkg.price}
                            onChange={(e) => updatePricingPackage(pkg.id, { price: e.target.value })}
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                            className="w-full text-sm font-black px-3 py-2 bg-white border border-slate-300 rounded-lg text-amber-700 focus:ring-2 focus:ring-[#073587] outline-none"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                            Badge
                          </label>
                          <input
                            type="text"
                            value={pkg.badge || ''}
                            onChange={(e) => updatePricingPackage(pkg.id, { badge: e.target.value })}
                            placeholder="ex: Recommandé"
                            className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#073587] outline-none"
                          />
                        </div>

                        <div className="sm:col-span-12">
                          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                            Description synthétique
                          </label>
                          <textarea
                            rows={2}
                            value={pkg.description}
                            onChange={(e) => updatePricingPackage(pkg.id, { description: e.target.value })}
                            className="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#073587] outline-none"
                          />
                        </div>

                        {/* Sub-options if available (e.g. Service 4 Hostinger 25k vs Sans hébergement 15k) */}
                        {pkg.options && pkg.options.length > 0 && (
                          <div className="sm:col-span-12 p-3 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
                            <span className="text-[11px] font-black text-amber-900 uppercase">
                              Sous-Options de tarification (ex: avec ou sans hébergement) :
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {pkg.options.map((opt, optIdx) => (
                                <div key={opt.id} className="p-2 bg-white rounded-lg border border-amber-200 space-y-1">
                                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                                    <span>Option {optIdx + 1}</span>
                                    <input
                                      type="text"
                                      value={opt.price}
                                      onChange={(e) => {
                                        const updatedOpts = [...pkg.options!];
                                        updatedOpts[optIdx] = { ...updatedOpts[optIdx], price: e.target.value };
                                        updatePricingPackage(pkg.id, { options: updatedOpts });
                                      }}
                                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                                      className="w-24 text-right text-xs font-black text-amber-700 px-1.5 py-0.5 border border-slate-300 rounded"
                                    />
                                  </div>
                                  <input
                                    type="text"
                                    value={opt.label || opt.name || ''}
                                    onChange={(e) => {
                                      const updatedOpts = [...pkg.options!];
                                      updatedOpts[optIdx] = {
                                        ...updatedOpts[optIdx],
                                        label: e.target.value,
                                        name: e.target.value
                                      };
                                      updatePricingPackage(pkg.id, { options: updatedOpts });
                                    }}
                                    className="w-full text-[11px] font-semibold px-2 py-1 border border-slate-300 rounded"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add new package form */}
                <div className="mt-6 pt-5 border-t border-slate-200">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-[#073587]" />
                    <span>Ajouter une nouvelle formation ou un service sur mesure</span>
                  </h4>

                  <form onSubmit={handleCreatePackage} className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="sm:col-span-6">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Nom de la formation</label>
                      <input
                        type="text"
                        value={newPkgName}
                        onChange={(e) => setNewPkgName(e.target.value)}
                        placeholder="ex: Formation Automatisation WhatsApp"
                        className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Tarif (FCFA)</label>
                      <input
                        type="text"
                        value={newPkgPrice}
                        onChange={(e) => setNewPkgPrice(e.target.value)}
                        placeholder="ex: 20 000 FCFA"
                        className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none font-mono"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Outils utilisés</label>
                      <input
                        type="text"
                        value={newPkgTools}
                        onChange={(e) => setNewPkgTools(e.target.value)}
                        placeholder="ex: Make, ChatGPT"
                        className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                      />
                    </div>
                    <div className="sm:col-span-12">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Description</label>
                      <input
                        type="text"
                        value={newPkgDesc}
                        onChange={(e) => setNewPkgDesc(e.target.value)}
                        placeholder="Description synthétique des compétences acquises"
                        className="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                      />
                    </div>
                    <div className="sm:col-span-12 flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black text-white bg-[#073587] hover:bg-[#05235c] rounded-lg transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Créer la formation</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TEXTES & HERO */}
          {activeTab === 'textes' && (
            <div className="space-y-6">
              <form onSubmit={handleSaveTextes} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-slate-900">
                    Textes Principaux, Slogans & Section Hero
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold">
                    Modifiez le titre d'accroche de la page d'accueil, les sous-titres et slogans.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                      Nom de l'agence
                    </label>
                    <input
                      type="text"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#073587] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                      Surtitre d'accroche (Kicker)
                    </label>
                    <input
                      type="text"
                      value={heroKicker}
                      onChange={(e) => setHeroKicker(e.target.value)}
                      placeholder="Académie & Agence Numérique · Formations Pratiques"
                      className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#073587] outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                      Titre principal du Hero (H1)
                    </label>
                    <textarea
                      rows={2}
                      value={heroHeadline}
                      onChange={(e) => setHeroHeadline(e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#073587] outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                      Sous-titre explicatif du Hero
                    </label>
                    <textarea
                      rows={3}
                      value={heroSubtitle}
                      onChange={(e) => setHeroSubtitle(e.target.value)}
                      className="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#073587] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                      Slogan court
                    </label>
                    <input
                      type="text"
                      value={agencySlogan}
                      onChange={(e) => setAgencySlogan(e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#073587] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                      Devise (Motto)
                    </label>
                    <input
                      type="text"
                      value={agencyMotto}
                      onChange={(e) => setAgencyMotto(e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#073587] outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black text-white bg-[#073587] hover:bg-[#05235c] rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Enregistrer les textes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: À PROPOS & ÉQUIPE */}
          {activeTab === 'apropos' && (
            <div className="space-y-6">
              <form onSubmit={handleSaveAbout} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-slate-900">
                    Section À Propos & Responsable Clientèle
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold">
                    Personnalisez les coordonnées du fondateur/responsable, son rôle et la présentation de l'agence.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                      Nom du Responsable
                    </label>
                    <input
                      type="text"
                      value={responsableName}
                      onChange={(e) => setResponsableName(e.target.value)}
                      placeholder="ex: Samuel G."
                      className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#073587] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                      Rôle / Fonction
                    </label>
                    <input
                      type="text"
                      value={responsableRole}
                      onChange={(e) => setResponsableRole(e.target.value)}
                      placeholder="ex: Direction & Service Clientèle"
                      className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#073587] outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                      Engagement & Bio du Responsable
                    </label>
                    <input
                      type="text"
                      value={responsableBio}
                      onChange={(e) => setResponsableBio(e.target.value)}
                      placeholder="Votre interlocuteur dédié pour le cadrage et le suivi de vos formations..."
                      className="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#073587] outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                      Titre de la section À Propos
                    </label>
                    <input
                      type="text"
                      value={aboutTitle}
                      onChange={(e) => setAboutTitle(e.target.value)}
                      placeholder="Un partenaire humain et dévoué à votre réussite en ligne."
                      className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#073587] outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                      Texte de mission et vision
                    </label>
                    <textarea
                      rows={4}
                      value={aboutText}
                      onChange={(e) => setAboutText(e.target.value)}
                      className="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#073587] outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black text-white bg-[#073587] hover:bg-[#05235c] rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Enregistrer la section À Propos</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: PHOTOS & LOGO */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Gestion des Photos & du Logo
                    </h3>
                    <p className="text-xs text-slate-600 font-semibold">
                      Importez directement depuis votre appareil (Android, iPhone ou PC) ou collez un lien d'image.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveMedia}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Sauvegarder les images</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Logo Card */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                    <span className="text-xs font-black text-slate-900 uppercase">1. Logo Africa Web</span>
                    <div className="h-32 bg-white rounded-lg border border-slate-300 p-2 flex items-center justify-center overflow-hidden">
                      <img src={logoPreview} alt="Logo" className="max-h-full max-w-full object-contain" />
                    </div>
                    <label className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#073587] text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-[#05235c] transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Changer le logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, setLogoPreview)}
                      />
                    </label>
                    <input
                      type="text"
                      value={logoPreview}
                      onChange={(e) => setLogoPreview(e.target.value)}
                      placeholder="Ou URL directe du logo"
                      className="w-full text-[11px] font-mono px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg outline-none"
                    />
                  </div>

                  {/* Photo Responsable Card */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                    <span className="text-xs font-black text-slate-900 uppercase">2. Photo du Responsable</span>
                    <div className="h-32 bg-white rounded-lg border border-slate-300 p-2 flex items-center justify-center overflow-hidden">
                      <img src={responsablePreview} alt="Responsable" className="max-h-full max-w-full object-contain" />
                    </div>
                    <label className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#073587] text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-[#05235c] transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Changer la photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, setResponsablePreview)}
                      />
                    </label>
                    <input
                      type="text"
                      value={responsablePreview}
                      onChange={(e) => setResponsablePreview(e.target.value)}
                      placeholder="Ou URL directe de la photo"
                      className="w-full text-[11px] font-mono px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg outline-none"
                    />
                  </div>

                  {/* Photo Produit Card */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                    <span className="text-xs font-black text-slate-900 uppercase">3. Photo Produit Vedette</span>
                    <div className="h-32 bg-white rounded-lg border border-slate-300 p-2 flex items-center justify-center overflow-hidden">
                      <img src={productImagePreview} alt="Produit" className="max-h-full max-w-full object-contain" />
                    </div>
                    <label className="flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-600 text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-amber-700 transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Changer l'image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, setProductImagePreview)}
                      />
                    </label>
                    <input
                      type="text"
                      value={productImagePreview}
                      onChange={(e) => setProductImagePreview(e.target.value)}
                      placeholder="Ou URL directe du produit"
                      className="w-full text-[11px] font-mono px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: VIDÉO DE PRÉSENTATION (ANDROID & ORDINATEUR) */}
          {activeTab === 'video' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                {/* Header & Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-slate-900">
                        Vidéo de Présentation (Android & Ordinateur)
                      </h3>
                      {videoUrl && videoVisible ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Active sur le site
                        </span>
                      ) : videoUrl && !videoVisible ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <EyeOff className="w-3 h-3 text-amber-600" />
                          Masquée aux visiteurs
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          Aucune vidéo (supprimée)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 font-medium mt-1">
                      Remplacez, testez ou supprimez facilement la vidéo de présentation visible sur ordinateurs et téléphones Android.
                    </p>
                  </div>

                  {/* Quick Visibility Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold transition-colors">
                    <input
                      type="checkbox"
                      checked={videoVisible}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setVideoVisible(checked);
                        updateVideoPresentation({ visible: checked });
                        showToast(checked ? "Section vidéo rendue visible sur le site !" : "Section vidéo masquée sur le site !");
                      }}
                      className="rounded text-[#073587] w-4 h-4 cursor-pointer"
                    />
                    <span>{videoVisible ? 'Section visible sur le site' : 'Section masquée'}</span>
                  </label>
                </div>

                {/* Live Preview Player inside Owner Space */}
                <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800 text-white space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-300 px-1">
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className={`w-2 h-2 rounded-full ${videoUrl ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                      <span>Aperçu de la vidéo active (Test de lecture)</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Smartphone className="w-3.5 h-3.5" />
                      <Monitor className="w-3.5 h-3.5" />
                      <span>Compatible Android & PC</span>
                    </div>
                  </div>

                  {/* Video Player Display */}
                  <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center border border-slate-800">
                    {(() => {
                      const parsed = parseUniversalVideoUrl(videoUrl);
                      if (parsed.isIframe && parsed.embedUrl) {
                        return (
                          <iframe
                            src={parsed.embedUrl}
                            title="Aperçu vidéo"
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                            allowFullScreen
                          />
                        );
                      }
                      if (!parsed.isIframe && parsed.streamUrl) {
                        return (
                          <video
                            src={parsed.streamUrl}
                            controls
                            playsInline
                            // @ts-ignore
                            webkit-playsinline="true"
                            className="w-full h-full object-contain"
                            preload="metadata"
                          />
                        );
                      }
                      return (
                        <div className="text-center p-6 text-slate-400 space-y-2">
                          <Video className="w-10 h-10 mx-auto text-slate-600 mb-1" />
                          <p className="text-xs font-bold text-slate-300">Aucune vidéo active</p>
                          <p className="text-[11px] text-slate-500">
                            Sélectionnez une option ci-dessous pour téléverser un fichier MP4 ou saisir un lien
                          </p>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Source details & Share link button */}
                  {videoUrl && (
                    <div className="text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2 px-1 pt-1 border-t border-slate-800">
                      <div className="flex items-center gap-2 max-w-md truncate">
                        <span className="text-amber-400 font-bold text-[10px]">
                          {parseUniversalVideoUrl(videoUrl).label}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const shareUrl = generateShareableVideoUrl(videoUrl);
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(shareUrl).then(() => {
                              showToast("Lien public copié ! Partagez-le sur WhatsApp : la vidéo sera lue sur tout Android et PC.");
                            });
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-white rounded-md text-[10px] font-bold transition-colors cursor-pointer"
                        title="Copier le lien public direct pour WhatsApp ou les réseaux"
                      >
                        <Share2 className="w-3 h-3 text-amber-400" />
                        <span>Copier le lien de partage</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Replacement and Deletion Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card 1: Remplacer par un fichier depuis l'appareil */}
                  <div className="p-4 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/60 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#073587] text-white flex items-center justify-center shrink-0">
                        <Upload className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900">
                          Remplacer par un fichier vidéo
                        </h4>
                        <p className="text-[11px] text-slate-600">
                          Depuis votre téléphone Android ou ordinateur
                        </p>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Sélectionnez un fichier <strong>MP4, WebM ou MOV</strong>. Il sera sauvegardé dans la mémoire de votre navigateur et jouable immédiatement.
                    </p>
                    <label className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#073587] hover:bg-[#05235c] text-white text-xs font-black rounded-xl cursor-pointer transition-colors shadow-xs">
                      <Upload className="w-4 h-4" />
                      <span>{videoUrl ? 'Remplacer par une nouvelle vidéo' : 'Importer une vidéo'}</span>
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={handleVideoUpload}
                      />
                    </label>
                  </div>

                  {/* Card 2: Supprimer la vidéo ou Restaurer la démo */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900">
                          Supprimer ou Réinitialiser
                        </h4>
                        <p className="text-[11px] text-slate-600">
                          Gestion de la présence de la vidéo
                        </p>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Supprimez le fichier vidéo pour retirer la présentation, ou restaurez la vidéo officielle de test d'Africa Web.
                    </p>

                    <div className="flex flex-col gap-2 pt-1">
                      {/* Delete video button with prompt */}
                      {!deleteVideoConfirm ? (
                        <button
                          type="button"
                          onClick={() => setDeleteVideoConfirm(true)}
                          disabled={!videoUrl}
                          className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-black text-rose-700 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Supprimer la vidéo</span>
                        </button>
                      ) : (
                        <div className="p-3 bg-rose-100/90 border border-rose-300 rounded-xl space-y-2 text-xs animate-in fade-in">
                          <p className="text-rose-950 font-bold leading-tight">
                            Êtes-vous sûr de vouloir supprimer cette vidéo ? La vidéo sera effacée et la section masquée aux visiteurs.
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={handleDeleteVideo}
                              className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-lg transition-colors cursor-pointer text-xs"
                            >
                              Oui, supprimer
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteVideoConfirm(false)}
                              className="flex-1 py-1.5 bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 font-bold rounded-lg transition-colors cursor-pointer text-xs"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Reset to demo */}
                      <button
                        type="button"
                        onClick={handleResetVideoToDemo}
                        className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                        <span>Restaurer la vidéo officielle du site (Garantie Netlify)</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Option 3: Remplacer par URL web, YouTube ou Google Drive */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">
                        Remplacer par un lien web universel (YouTube, Google Drive, MP4, Dropbox)
                      </h4>
                      <p className="text-[11px] text-slate-600">
                        Collez l'adresse d'une vidéo YouTube, d'un fichier <strong>Google Drive</strong>, Dropbox ou un lien direct MP4.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <input
                      type="text"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... ou https://drive.google.com/file/d/... ou https://.../video.mp4"
                      className="flex-grow text-xs font-mono px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#073587]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyVideoUrl}
                      className="px-4 py-2 bg-[#073587] hover:bg-[#05235c] text-white text-xs font-black rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-xs"
                    >
                      Appliquer ce lien
                    </button>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
                    <span className="font-bold text-slate-500">Raccourcis :</span>
                    <button
                      type="button"
                      onClick={() => {
                        const url = '/assets/aistudio/AfricaWeb_22ef340a.mp4';
                        setVideoUrl(url);
                        setVideoTitle("Présentation Vidéo Officielle Africa Web 2026");
                        setVideoSubtitle("Sites vitrines pros, e-commerce, catalogues et formations d'élite.");
                        setVideoDuration("00:50 min");
                        updateVideoPresentation({
                          videoUrl: url,
                          title: "Présentation Vidéo Officielle Africa Web 2026",
                          subtitle: "Sites vitrines pros, e-commerce, catalogues et formations d'élite.",
                          duration: "00:50 min",
                          visible: true
                        });
                        showToast("Nouvelle Vidéo Officielle 2026 (avec voix & smartphone) appliquée !");
                      }}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-lg cursor-pointer shadow-xs border border-emerald-700 flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>Vidéo Officielle 2026 avec Voix & Démo (Recommandé)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setVideoUrl('/videos/africaweb-presentation.mp4');
                        setVideoDuration("00:12 min");
                        updateVideoPresentation({ videoUrl: '/videos/africaweb-presentation.mp4', duration: '00:12 min', visible: true });
                        showToast("Vidéo courte synthétique (12s) appliquée !");
                      }}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded cursor-pointer border border-slate-200"
                    >
                      Vidéo Courte (12s)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
                        updateVideoPresentation({ videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', visible: true });
                        showToast("Lien YouTube d'exemple appliqué !");
                      }}
                      className="px-2 py-0.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded cursor-pointer border border-red-200"
                    >
                      Exemple YouTube
                    </button>
                  </div>
                </div>

                {/* Paramètres Textes & Durée */}
                <form onSubmit={handleSaveVideo} className="pt-3 border-t border-slate-100 space-y-4">
                  <h4 className="text-xs font-black text-slate-800 uppercase">
                    Titres et informations de la présentation
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                        Titre de la vidéo
                      </label>
                      <input
                        type="text"
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#073587]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                        Sous-titre descriptif
                      </label>
                      <input
                        type="text"
                        value={videoSubtitle}
                        onChange={(e) => setVideoSubtitle(e.target.value)}
                        className="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#073587]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                        Durée affichée (ex: 02:45 min)
                      </label>
                      <input
                        type="text"
                        value={videoDuration}
                        onChange={(e) => setVideoDuration(e.target.value)}
                        placeholder="02:45 min"
                        className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#073587]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black text-white bg-[#073587] hover:bg-[#05235c] rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Enregistrer la configuration vidéo</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 6: PRODUIT VEDETTE */}
          {activeTab === 'produit' && (
            <div className="space-y-6">
              <form onSubmit={handleSaveProduct} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Section Produit Vedette (Guide Culinaire ou Produit Numérique)
                    </h3>
                    <p className="text-xs text-slate-600 font-semibold">
                      Personnalisez le titre, le badge promo, le lien de commande ou activez/désactivez la section.
                    </p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold">
                    <input
                      type="checkbox"
                      checked={productVisible}
                      onChange={(e) => setProductVisible(e.target.checked)}
                      className="rounded text-amber-600"
                    />
                    <span>{productVisible ? 'Section visible sur le site' : 'Section masquée'}</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                      Titre du produit
                    </label>
                    <input
                      type="text"
                      value={productTitle}
                      onChange={(e) => setProductTitle(e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                      Badge Promotionnel
                    </label>
                    <input
                      type="text"
                      value={productBadge}
                      onChange={(e) => setProductBadge(e.target.value)}
                      placeholder="ex: -70% DE RÉDUCTION"
                      className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                      Sous-titre
                    </label>
                    <input
                      type="text"
                      value={productSubtitle}
                      onChange={(e) => setProductSubtitle(e.target.value)}
                      className="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                      Lien de redirection (Page de commande / Vente)
                    </label>
                    <input
                      type="text"
                      value={productLink}
                      onChange={(e) => setProductLink(e.target.value)}
                      placeholder="https://..."
                      className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none text-[#073587] font-bold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                      Points forts (Un point par ligne)
                    </label>
                    <textarea
                      rows={4}
                      value={productHighlights}
                      onChange={(e) => setProductHighlights(e.target.value)}
                      className="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Enregistrer le produit vedette</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 7: ENTÊTE & MENU (Strictement 1 seule ligne) */}
          {activeTab === 'header' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-slate-900">
                    Configuration de l'Entête Principale (Ligne Unique)
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold">
                    Tout reste parfaitement aligné sur la même ligne (Logo + Liens + Boutons).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                      Nom Marque
                    </label>
                    <input
                      type="text"
                      value={tempBrandTitle}
                      onChange={(e) => setTempBrandTitle(e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                      Mot Mis en Valeur
                    </label>
                    <input
                      type="text"
                      value={tempBrandHighlight}
                      onChange={(e) => setTempBrandHighlight(e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none text-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                      Sous-titre Marque
                    </label>
                    <input
                      type="text"
                      value={tempBrandSubtitle}
                      onChange={(e) => setTempBrandSubtitle(e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={showWhatsAppBtn}
                      onChange={(e) => setShowWhatsAppBtn(e.target.checked)}
                      className="rounded text-emerald-600"
                    />
                    <span>Bouton WhatsApp visible dans l'entête</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={showOrderBtn}
                      onChange={(e) => setShowOrderBtn(e.target.checked)}
                      className="rounded text-[#073587]"
                    />
                    <span>Bouton d'action Formations visible</span>
                  </label>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleSaveHeader}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-black text-white bg-[#073587] hover:bg-[#05235c] rounded-xl transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Enregistrer la marque de l'entête</span>
                  </button>
                </div>

                {/* Nav Links Management */}
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3">
                    Liens de navigation actifs dans l'entête :
                  </h4>

                  <div className="space-y-2">
                    {headerConfig.navLinks.map((link) => (
                      <div key={link.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{link.label}</span>
                          <span className="text-[10px] font-mono text-slate-500">({link.href})</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleNavLinkVisibility(link.id)}
                            className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${
                              link.visible
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}
                          >
                            {link.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            <span>{link.visible ? 'Visible' : 'Masqué'}</span>
                          </button>

                          {deleteNavConfirmId === link.id ? (
                            <div className="flex items-center gap-1 bg-red-100 p-1 rounded-lg">
                              <button
                                onClick={() => {
                                  deleteNavLink(link.id);
                                  setDeleteNavConfirmId(null);
                                }}
                                className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-black"
                              >
                                Supprimer
                              </button>
                              <button
                                onClick={() => setDeleteNavConfirmId(null)}
                                className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px]"
                              >
                                Annuler
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteNavConfirmId(link.id)}
                              className="p-1 text-slate-400 hover:text-red-600"
                              title="Supprimer ce lien"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Nav Link */}
                  <form onSubmit={handleAddNavLink} className="mt-3 flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={newNavLabel}
                      onChange={(e) => setNewNavLabel(e.target.value)}
                      placeholder="Nom de l'onglet (ex: Blog)"
                      className="text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none flex-1 min-w-[140px]"
                    />
                    <input
                      type="text"
                      value={newNavHref}
                      onChange={(e) => setNewNavHref(e.target.value)}
                      placeholder="Lien (ex: #tarifs)"
                      className="text-xs font-mono px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none flex-1 min-w-[140px]"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black text-white bg-[#073587] hover:bg-[#05235c] rounded-lg transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: BAS DE PAGE (FOOTER) */}
          {activeTab === 'footer' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-slate-900">
                    Configuration du Bas de Page (Pied de Page)
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold">
                    Le bouton du compte propriétaire reste discrètement accessible dans le coin inférieur du bas de page.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                    Texte de Copyright officiel
                  </label>
                  <input
                    type="text"
                    value={tempCopyright}
                    onChange={(e) => setTempCopyright(e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={showBrandBlock}
                      onChange={(e) => setShowBrandBlock(e.target.checked)}
                      className="rounded text-[#073587]"
                    />
                    <span>Afficher le bloc de présentation et mission</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={showServicesBlock}
                      onChange={(e) => setShowServicesBlock(e.target.checked)}
                      className="rounded text-[#073587]"
                    />
                    <span>Afficher le bloc des 4 Formations</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={showQuickLinksBlock}
                      onChange={(e) => setShowQuickLinksBlock(e.target.checked)}
                      className="rounded text-[#073587]"
                    />
                    <span>Afficher le bloc Liens Rapides & Espace Propriétaire</span>
                  </label>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleSaveFooter}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black text-white bg-[#073587] hover:bg-[#05235c] rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Enregistrer le bas de page</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: COULEURS DU SITE */}
          {activeTab === 'colors' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Personnalisation des Couleurs du Site
                    </h3>
                    <p className="text-xs text-slate-600 font-semibold">
                      Chaque nuance est appliquée instantanément en temps réel sur toute l'interface.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveColors}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Sauvegarder les couleurs</span>
                  </button>
                </div>

                {/* Presets */}
                <div className="space-y-2">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Palettes Harmonieuses Prêtes à l'Emploi :
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { name: 'Bleu Royal & Or', primary: '#073587', dark: '#05235c', accent: '#f59e0b', bg: '#ffffff', text: '#0f172a' },
                      { name: 'Nuit Ébène & Ambre', primary: '#0f172a', dark: '#020617', accent: '#d97706', bg: '#fafaf9', text: '#1c1917' },
                      { name: 'Émeraude Croissance', primary: '#047857', dark: '#064e3b', accent: '#fbbf24', bg: '#ffffff', text: '#064e3b' },
                      { name: 'Indigo Haute Tech', primary: '#4338ca', dark: '#312e81', accent: '#38bdf8', bg: '#ffffff', text: '#0f172a' },
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => applyColorPreset(preset)}
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-400 bg-white text-left transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: preset.primary }} />
                          <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: preset.accent }} />
                          <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: preset.bg }} />
                        </div>
                        <span className="text-xs font-bold text-slate-800 group-hover:text-[#073587] block">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Manual Pickers */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <label className="text-xs font-black text-slate-900 block">Couleur Principale</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={tempPrimary}
                        onChange={(e) => setTempPrimary(e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-slate-300"
                      />
                      <input
                        type="text"
                        value={tempPrimary}
                        onChange={(e) => setTempPrimary(e.target.value)}
                        className="w-full text-xs font-mono font-bold px-2 py-1.5 bg-white border border-slate-300 rounded outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <label className="text-xs font-black text-slate-900 block">Couleur Sombre / Entête</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={tempDark}
                        onChange={(e) => setTempDark(e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-slate-300"
                      />
                      <input
                        type="text"
                        value={tempDark}
                        onChange={(e) => setTempDark(e.target.value)}
                        className="w-full text-xs font-mono font-bold px-2 py-1.5 bg-white border border-slate-300 rounded outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <label className="text-xs font-black text-slate-900 block">Couleur Accent / Or</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={tempAccent}
                        onChange={(e) => setTempAccent(e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-slate-300"
                      />
                      <input
                        type="text"
                        value={tempAccent}
                        onChange={(e) => setTempAccent(e.target.value)}
                        className="w-full text-xs font-mono font-bold px-2 py-1.5 bg-white border border-slate-300 rounded outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <label className="text-xs font-black text-slate-900 block">Arrière-Plan du Site</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={tempBg}
                        onChange={(e) => setTempBg(e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-slate-300"
                      />
                      <input
                        type="text"
                        value={tempBg}
                        onChange={(e) => setTempBg(e.target.value)}
                        className="w-full text-xs font-mono font-bold px-2 py-1.5 bg-white border border-slate-300 rounded outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <label className="text-xs font-black text-slate-900 block">Texte Principal</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={tempText}
                        onChange={(e) => setTempText(e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-slate-300"
                      />
                      <input
                        type="text"
                        value={tempText}
                        onChange={(e) => setTempText(e.target.value)}
                        className="w-full text-xs font-mono font-bold px-2 py-1.5 bg-white border border-slate-300 rounded outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: POLICES & TAILLES (TITRES, SOUS-TITRES, TEXTES, PRIX) */}
          {activeTab === 'typography' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Gestion Précise des Écritures & Polices du Site
                    </h3>
                    <p className="text-xs text-slate-600 font-semibold">
                      Personnalisez individuellement la police, la taille et la graisse des Titres, des Sous-titres, du Corps de texte et des Prix.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveTypography}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black text-white bg-[#073587] hover:bg-[#05235c] rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Sauvegarder toutes les écritures</span>
                  </button>
                </div>

                {/* 1. Titres Principaux (H1, H2) */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-[#073587] tracking-wider flex items-center gap-2">
                      <Type className="w-4 h-4" />
                      <span>1. Titres Principaux (H1, H2, En-têtes)</span>
                    </span>
                    <span className="text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Taille active : {tempTitleFontSize}px
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Police des Titres
                      </label>
                      <select
                        value={tempTitleFontFamily}
                        onChange={(e) => setTempTitleFontFamily(e.target.value)}
                        className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                      >
                        <option value="Arial, Helvetica, sans-serif">Arial / Helvetica (Classique & Clair)</option>
                        <option value="Inter, system-ui, sans-serif">Inter (Moderne & Net)</option>
                        <option value="system-ui, -apple-system, sans-serif">System UI (Android / iOS)</option>
                        <option value="'Segoe UI', Roboto, sans-serif">Segoe UI / Roboto</option>
                        <option value="Montserrat, sans-serif">Montserrat (Impactant)</option>
                        <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                        <option value="Impact, sans-serif">Impact (Très Puissant)</option>
                        <option value="Georgia, serif">Georgia (Élégant)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Taille des Titres ({tempTitleFontSize}px)
                      </label>
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="range"
                          min={20}
                          max={56}
                          value={tempTitleFontSize}
                          onChange={(e) => setTempTitleFontSize(Number(e.target.value))}
                          className="flex-1 accent-[#073587]"
                        />
                        <span className="text-xs font-bold text-slate-800 w-10 text-right">{tempTitleFontSize}px</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Graisse des Titres
                      </label>
                      <select
                        value={tempTitleFontWeight}
                        onChange={(e) => setTempTitleFontWeight(e.target.value)}
                        className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                      >
                        <option value="600">Semi-Gras (600)</option>
                        <option value="700">Gras (700)</option>
                        <option value="800">Extra-Gras (800)</option>
                        <option value="900">Black / Ultra (900) - Recommandé</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Sous-titres & Accroches */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-amber-700 tracking-wider flex items-center gap-2">
                      <Type className="w-4 h-4" />
                      <span>2. Sous-titres & Accroches</span>
                    </span>
                    <span className="text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Taille active : {tempSubtitleFontSize}px
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Police des Sous-titres
                      </label>
                      <select
                        value={tempSubtitleFontFamily}
                        onChange={(e) => setTempSubtitleFontFamily(e.target.value)}
                        className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                      >
                        <option value="Arial, Helvetica, sans-serif">Arial / Helvetica</option>
                        <option value="Inter, system-ui, sans-serif">Inter</option>
                        <option value="system-ui, -apple-system, sans-serif">System UI (Android / iOS)</option>
                        <option value="'Segoe UI', Roboto, sans-serif">Segoe UI / Roboto</option>
                        <option value="Georgia, serif">Georgia</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Taille ({tempSubtitleFontSize}px)
                      </label>
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="range"
                          min={12}
                          max={26}
                          value={tempSubtitleFontSize}
                          onChange={(e) => setTempSubtitleFontSize(Number(e.target.value))}
                          className="flex-1 accent-amber-500"
                        />
                        <span className="text-xs font-bold text-slate-800 w-10 text-right">{tempSubtitleFontSize}px</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Graisse
                      </label>
                      <select
                        value={tempSubtitleFontWeight}
                        onChange={(e) => setTempSubtitleFontWeight(e.target.value)}
                        className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                      >
                        <option value="400">Normal (400)</option>
                        <option value="600">Semi-Gras (600) - Recommandé</option>
                        <option value="700">Gras (700)</option>
                        <option value="800">Extra-Gras (800)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. Textes Généraux & Paragraphes */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-2">
                      <Type className="w-4 h-4" />
                      <span>3. Textes Généraux & Paragraphes (Corps de page)</span>
                    </span>
                    <span className="text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Taille active : {tempFontSize}px
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Police du Corps de texte
                      </label>
                      <select
                        value={tempFontFamily}
                        onChange={(e) => setTempFontFamily(e.target.value)}
                        className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                      >
                        <option value="Arial, Helvetica, sans-serif">Arial / Helvetica (Standard)</option>
                        <option value="Inter, system-ui, sans-serif">Inter (Moderne & Net)</option>
                        <option value="system-ui, -apple-system, sans-serif">System UI (Android / iOS)</option>
                        <option value="'Segoe UI', Roboto, sans-serif">Segoe UI / Roboto</option>
                        <option value="Georgia, serif">Georgia (Serif)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Taille du texte ({tempFontSize}px)
                      </label>
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="range"
                          min={14}
                          max={24}
                          value={tempFontSize}
                          onChange={(e) => setTempFontSize(Number(e.target.value))}
                          className="flex-1 accent-slate-800"
                        />
                        <span className="text-xs font-bold text-slate-800 w-10 text-right">{tempFontSize}px</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Graisse du texte
                      </label>
                      <select
                        value={tempFontWeight}
                        onChange={(e) => setTempFontWeight(e.target.value)}
                        className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                      >
                        <option value="400">Normal (400)</option>
                        <option value="600">Semi-Gras (600)</option>
                        <option value="700">Gras - Recommandé (700)</option>
                        <option value="800">Extra-Gras (800)</option>
                        <option value="900">Black / Ultra (900)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 4. Prix & Tarifs (Arial gras lisible) */}
                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-emerald-800 tracking-wider flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <span>4. Prix & Tarifs des Formations (Ex: 10 000f, 25 000f)</span>
                    </span>
                    <span className="text-[11px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-300">
                      Taille active : {tempPriceFontSize}px
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Police des Prix (Arial Recommandé)
                      </label>
                      <select
                        value={tempPriceFontFamily}
                        onChange={(e) => setTempPriceFontFamily(e.target.value)}
                        className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                      >
                        <option value="Arial, Helvetica, sans-serif">Arial (Haute Visibilité & Recommandé)</option>
                        <option value="Inter, system-ui, sans-serif">Inter</option>
                        <option value="system-ui, -apple-system, sans-serif">System UI</option>
                        <option value="'Segoe UI', Roboto, sans-serif">Segoe UI / Roboto</option>
                        <option value="Impact, sans-serif">Impact</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Taille des Prix ({tempPriceFontSize}px)
                      </label>
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="range"
                          min={20}
                          max={50}
                          value={tempPriceFontSize}
                          onChange={(e) => setTempPriceFontSize(Number(e.target.value))}
                          className="flex-1 accent-emerald-600"
                        />
                        <span className="text-xs font-bold text-emerald-900 w-10 text-right">{tempPriceFontSize}px</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Graisse des Prix
                      </label>
                      <select
                        value={tempPriceFontWeight}
                        onChange={(e) => setTempPriceFontWeight(e.target.value)}
                        className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                      >
                        <option value="700">Gras (700)</option>
                        <option value="800">Extra-Gras (800)</option>
                        <option value="900">Black / Ultra (900) - Recommandé</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Aperçu en direct multi-niveaux */}
                <div className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Aperçu en Direct selon vos Réglages</span>
                    </span>
                    <span className="text-[11px] text-slate-400">Mise à jour en temps réel</span>
                  </div>

                  <div className="space-y-3">
                    {/* Live Title */}
                    <div
                      style={{
                        fontFamily: tempTitleFontFamily,
                        fontSize: `${tempTitleFontSize}px`,
                        fontWeight: tempTitleFontWeight
                      }}
                      className="text-white leading-tight"
                    >
                      Formation en Création d'Agent IA pour Entreprises
                    </div>

                    {/* Live Subtitle */}
                    <div
                      style={{
                        fontFamily: tempSubtitleFontFamily,
                        fontSize: `${tempSubtitleFontSize}px`,
                        fontWeight: tempSubtitleFontWeight
                      }}
                      className="text-amber-300 leading-snug"
                    >
                      Automatisez vos ventes, support client 24h/7j et prospection avec n8n, Flowise et WhatsApp API
                    </div>

                    {/* Live Body */}
                    <p
                      style={{
                        fontFamily: tempFontFamily,
                        fontSize: `${tempFontSize}px`,
                        fontWeight: tempFontWeight
                      }}
                      className="text-slate-300 leading-relaxed"
                    >
                      Africa Web accompagne les professionnels et créateurs africains avec des programmes pratiques intensifs sans prérequis techniques.
                    </p>

                    {/* Live Price */}
                    <div className="pt-2 flex items-baseline gap-2">
                      <span className="text-xs font-bold text-slate-400 uppercase">Tarif :</span>
                      <span
                        style={{
                          fontFamily: tempPriceFontFamily,
                          fontSize: `${tempPriceFontSize}px`,
                          fontWeight: tempPriceFontWeight
                        }}
                        className="text-amber-400 leading-none"
                      >
                        20 000 FCFA
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: WHATSAPP & CONTACTS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-slate-900">
                    Coordonnées de Contact Direct & Numéro WhatsApp
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold">
                    Tous les boutons de commande et le bouton flottant s'adresseront immédiatement à ce numéro.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                      Numéro WhatsApp (Format sans +)
                    </label>
                    <input
                      type="text"
                      value={whatsappNum}
                      onChange={(e) => setWhatsappNum(e.target.value)}
                      placeholder="229XXXXXXXX"
                      className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono outline-none"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">Exemple Bénin : 229XXXXXXXX</span>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                      Affichage du numéro (Lisible par les clients)
                    </label>
                    <input
                      type="text"
                      value={whatsappDisplay}
                      onChange={(e) => setWhatsappDisplay(e.target.value)}
                      placeholder="+229 XX XX XX XX"
                      className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                      Adresse Email Officielle
                    </label>
                    <input
                      type="email"
                      value={emailAddr}
                      onChange={(e) => setEmailAddr(e.target.value)}
                      placeholder="contact@africa-web.com"
                      className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Enregistrer les coordonnées</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: STATISTIQUES */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Visites Totales</span>
                  <span className="text-2xl font-black text-slate-900 font-mono">{analytics.totalVisits.toLocaleString()}</span>
                  <span className="text-[10px] text-emerald-600 font-bold block mt-1">+14% ce mois</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Visiteurs Uniques</span>
                  <span className="text-2xl font-black text-slate-900 font-mono">{analytics.uniqueVisitors.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-500 font-bold block mt-1">Android & PC</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Taux de Clic (CTR)</span>
                  <span className="text-2xl font-black text-amber-600 font-mono">{ctrRate}%</span>
                  <span className="text-[10px] text-slate-500 font-bold block mt-1">{totalClicks} interactions</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Contacts WhatsApp</span>
                  <span className="text-2xl font-black text-emerald-600 font-mono">{analytics.clicksWhatsApp}</span>
                  <span className="text-[10px] text-emerald-700 font-bold block mt-1">Conversions directes</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 uppercase">Visites par Pays :</h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={simulateVisit}
                      className="px-3 py-1 bg-blue-50 text-[#073587] text-xs font-bold rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      + Simuler 1 visite
                    </button>
                    <button
                      onClick={resetAnalytics}
                      className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      Réinitialiser
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(analytics.countryVisits).map(([country, visits]) => (
                    <div key={country} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-800">{country}</span>
                      <span className="text-slate-900 font-mono">{visits}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 13: SÉCURITÉ & ACCÈS (Strictement confidentiel) */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <form onSubmit={handleSaveSecurityCredentials} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>Identifiants Confidentiels du Propriétaire</span>
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold">
                    Vos identifiants ne sont jamais visibles par vos clients. Vous pouvez les modifier en toute sécurité ici.
                  </p>
                </div>

                {secError && (
                  <div className="p-3 bg-red-50 text-red-800 rounded-xl text-xs font-bold border border-red-200 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{secError}</span>
                  </div>
                )}

                {secSuccess && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{secSuccess}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                      Email Propriétaire (Identifiant de connexion)
                    </label>
                    <input
                      type="email"
                      value={secEmail}
                      onChange={(e) => setSecEmail(e.target.value)}
                      required
                      className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                      Nouveau Mot de Passe (Optionnel)
                    </label>
                    <div className="relative">
                      <input
                        type={showSecPassword ? 'text' : 'password'}
                        value={secNewPassword}
                        onChange={(e) => setSecNewPassword(e.target.value)}
                        placeholder="Laisser vide pour ne pas changer"
                        className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none pr-9"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecPassword(!showSecPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showSecPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                      Confirmer le Nouveau Mot de Passe
                    </label>
                    <input
                      type={showSecPassword ? 'text' : 'password'}
                      value={secConfirmPassword}
                      onChange={(e) => setSecConfirmPassword(e.target.value)}
                      placeholder="Répétez le mot de passe"
                      className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  {resetConfirm ? (
                    <div className="flex items-center gap-2 bg-red-50 p-2 rounded-xl border border-red-200">
                      <span className="text-xs text-red-700 font-bold">Réinitialiser toute la plateforme ?</span>
                      <button
                        type="button"
                        onClick={resetToDefaults}
                        className="px-2.5 py-1 bg-red-600 text-white text-xs font-black rounded-lg hover:bg-red-700"
                      >
                        Oui, tout effacer
                      </button>
                      <button
                        type="button"
                        onClick={() => setResetConfirm(false)}
                        className="px-2.5 py-1 bg-slate-200 text-slate-800 text-xs font-bold rounded-lg"
                      >
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setResetConfirm(true)}
                      className="text-xs text-red-600 hover:text-red-700 font-bold underline cursor-pointer"
                    >
                      Réinitialiser la configuration d'usine
                    </button>
                  )}

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black text-white bg-[#073587] hover:bg-[#05235c] rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Mettre à jour mes accès</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

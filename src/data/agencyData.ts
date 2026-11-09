export interface PricingOption {
  id: string;
  label: string;
  name?: string;
  price: string;
  note?: string;
  whatsappMessage?: string;
}

export interface PricingPackage {
  id: string;
  name: string;
  price: string;
  priceNote?: string;
  badge?: string;
  description: string;
  delay: string;
  popular?: boolean;
  hosting: string;
  tools?: string[];
  features: string[];
  options?: PricingOption[];
  whatsappMessage: string;
  buttonText?: string;
  period?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'vitrine' | 'ecommerce' | 'webinaire';
  categoryLabel: string;
  client: string;
  domain?: string;
  domainBadge?: string;
  image?: string;
  externalLink?: string;
  outcome: string;
  description: string;
  technologies: string[];
  hosting?: string;
  layoutFormat: 'alibaba-b2b' | 'cinetpay-fintech' | 'facebook-social' | 'amazon-jumia' | 'culinary-funnel' | 'blueprint-corporate' | 'modern-store' | 'dark-academy' | 'fresh-market' | 'executive-law';
  heroSlogan: string;
  accentColorName: string;
  colorTheme: {
    primary: string;
    primaryDark: string;
    accent: string;
    lightBg: string;
    border: string;
    badgeBg: string;
    badgeText: string;
  };
}

export interface TestimonialItem {
  id: string;
  author: string;
  role: string;
  company: string;
  location: string;
  content: string;
  rating: number;
  projectType: string;
}

export const AGENCY_INFO = {
  name: "Africa Web",
  brandSubtitle: "Agence Numérique",
  slogan: "Votre partenaire pour une présence en ligne réussie !",
  motto: "Innovons ensemble pour une Afrique connectée et prospère !",
  email: "kgmservices229@gmail.com",
  whatsappNumber: "2290168546237",
  whatsappDisplay: "+229 01 68 54 62 37",
  logoUrl: "/assets/aistudio/AfricaWeb_bd0cd59c.png",
  responsablePhoto: "/assets/aistudio/Capture_d__cran_2026-11-04_225610_f0c2edc0.png",
  featuredProduct: {
    title: "Le Guide Ultime des 150+ Recettes Béninoises & Africaines",
    subtitle: "Formation & Recueil Culinaire d'Exception",
    badge: "-80% de Réduction Immédiate",
    image: "/assets/aistudio/IMG-20260807-WA0001_87ce40ff.jpg",
    link: "https://kgmservice.mychariow.com/recette-africaines",
    highlights: [
      "150+ Recettes traditionnelles béninoises & africaines authentiques",
      "Techniques de cuisson pas-à-pas illustrées et vidéos explicatives",
      "Ingrédients locaux faciles à trouver sur les marchés",
      "Guide complet du débutant au professionnel de la restauration",
      "Paiements 100% sécurisés : MTN Moov Orange Airtel Wave & Visa"
    ]
  }
};

export const PRICING_PACKAGES: PricingPackage[] = [
  {
    id: "video-ia",
    name: "1. Formation Vidéo Publicitaire & Pro avec l'IA",
    price: "10 000 FCFA",
    priceNote: "Google Flow, Arena IA & Studio de Création",
    description: "Apprenez à concevoir des vidéos publicitaires captivantes et des spots professionnels à fort taux de conversion grâce à Google Flow et Arena IA.",
    delay: "Accès direct + Pratique sur cas réels",
    popular: false,
    hosting: "Google Flow · Arena IA · Voix Off & Scénarios IA",
    features: [
      "Maîtrise complète de Google Flow pour la génération vidéo cinématique",
      "Génération et animation de scènes publicitaires avec Arena IA",
      "Écriture de scripts et prompts persuasifs adaptés au marché africain",
      "Création de voix off réalistes avec intonations humaines professionnelles",
      "Montage dynamique, synchronisation audio et sous-titres animés viraux",
      "Formats adaptés pour TikTok, Instagram Reels, Facebook Ads & YouTube",
      "Bibliothèque de prompts vidéo exclusifs pour booster vos conversions",
      "Support d'aide et réponses directes à vos questions sur WhatsApp"
    ],
    whatsappMessage: "Bonjour Africa Web, je souhaite m'inscrire à la Formation en création de vidéo publicitaire et professionnelle avec l'IA (Google Flow, Arena IA) à 10 000 FCFA."
  },
  {
    id: "produit-digital",
    name: "2. Formation Produit Digital Professionnel",
    price: "15 000 FCFA",
    priceNote: "De l'idée à la vente automatisée en Afrique",
    description: "Concevez vos propres produits numériques rentables (e-books, templates, guides, formations) et mettez en place un système de vente automatique 24h/24.",
    delay: "Programme complet + Tunnels de vente offerts",
    popular: true,
    hosting: "Packaging Digital · Tunnels & Mobile Money",
    features: [
      "Méthode pour identifier des idées de produits digitaux à forte demande",
      "Rédaction et mise en page d'e-books et guides pratiques professionnels",
      "Création de mockups 3D et packagings numériques irrésistibles",
      "Mise en place de tunnels de vente automatisés (capture, commande, remerciement)",
      "Intégration des paiements Mobile Money (MTN, Moov, Wave, Orange) & Cartes",
      "Livraison 100% automatique du produit au client dès paiement confirmé",
      "Stratégies pour vendre sans budget publicitaire sur WhatsApp et Facebook",
      "Modèles de tunnels prêts à l'emploi et fichiers sources inclus"
    ],
    whatsappMessage: "Bonjour Africa Web, je souhaite m'inscrire à la Formation en création de produit digital professionnel à 15 000 FCFA."
  },
  {
    id: "images-publicitaires",
    name: "3. Formation Création des Images Publicitaires",
    price: "5 000 FCFA",
    priceNote: "Visuels percutants · Zéro compétence requise",
    description: "Créez des visuels publicitaires percutants et des affiches promotionnelles magnifiques avec l'intelligence artificielle pour vos réseaux sociaux et vos ventes.",
    delay: "Accessible immédiatement sur Android, iPhone & PC",
    popular: false,
    hosting: "IA Générative d'images & Design Express",
    features: [
      "Création d'affiches publicitaires qui captivent l'attention et vendent",
      "Génération d'images de produits ultra-réalistes grâce à l'IA",
      "Détourage automatique, suppression de fond et mise en scène pro",
      "Bannières optimisées pour les statuts WhatsApp, Facebook et Instagram",
      "Règles d'or des contrastes, typographies vendeuses et composition",
      "Formules de prompts visuels pour générer exactement ce que vous voulez",
      "Mise en pratique immédiate sur vos propres produits ou services",
      "Pack de modèles d'affiches et ressources graphiques offertes"
    ],
    whatsappMessage: "Bonjour Africa Web, je souhaite m'inscrire à la Formation en Création des images publicitaires à 5 000 FCFA."
  },
  {
    id: "site-web-pro",
    name: "4. Formation Création de Site Web Pro Sans Code",
    price: "25 000 FCFA",
    priceNote: "25 000 F avec hébergement · 15 000 F sans hébergement",
    description: "Concevez des sites vitrines d'entreprise, boutiques en ligne e-commerce ou marketplaces complètes sans coder. Apprenez à les héberger gratuitement ou sur Hostinger.",
    delay: "Projets réels guidés pas-à-pas + Fichiers offerts",
    popular: true,
    hosting: "Hébergement Hostinger avec Domaine OU Gratuit",
    options: [
      {
        id: "avec-hebergement",
        label: "Avec Hébergement Hostinger",
        price: "25 000 FCFA",
        note: "Hébergement Hostinger complet, nom de domaine dédié, certificat SSL & adresses e-mails pros inclus",
        whatsappMessage: "Bonjour Africa Web, je souhaite m'inscrire à la Formation en création de site web pro AVEC hébergement Hostinger à 25 000 FCFA."
      },
      {
        id: "sans-hebergement",
        label: "Sans Hébergement",
        price: "15 000 FCFA",
        note: "Méthode complète de déploiement et hébergement 100% GRATUIT sans aucun frais mensuel",
        whatsappMessage: "Bonjour Africa Web, je souhaite m'inscrire à la Formation en création de site web pro SANS hébergement à 15 000 FCFA."
      }
    ],
    features: [
      "Création de sites vitrines d'entreprise modernes, élégants et responsives",
      "Conception de boutiques e-commerce complètes avec panier et gestion des stocks",
      "Mise en place de plateformes marketplaces sans écrire une seule ligne de code",
      "Option Hébergement 100% GRATUIT : déploiement cloud sans abonnement",
      "Option Hostinger Pro : configuration domaine, certificat SSL et e-mails pro",
      "Boutons de commande directe WhatsApp et formulaires de devis connectés",
      "Intégration des paiements Mobile Money et cartes bancaires",
      "Accompagnement personnalisé pour mettre votre premier site en ligne"
    ],
    whatsappMessage: "Bonjour Africa Web, je souhaite m'inscrire à la Formation en création de site web pro sans code (25 000 FCFA avec hébergement / 15 000 FCFA sans hébergement)."
  },
  {
    id: "agent-ia-entreprise",
    name: "5. Comment créer un agent IA pour les entreprises",
    price: "20 000 FCFA",
    priceNote: "Automatisation, Support Client 24/7 & Prospection IA",
    description: "Apprenez à concevoir, paramétrer et déployer des agents IA autonomes et assistants intelligents capables de gérer le support client, qualifier les prospects et automatiser les ventes pour les entreprises.",
    delay: "Accès direct + Templates d'agents IA prêts à déployer",
    popular: true,
    hosting: "n8n · Botpress · Flowise · WhatsApp API & OpenAI/Gemini",
    features: [
      "Architecture complète d'un agent IA d'entreprise et cas d'usage réels",
      "Création d'agents conversationnels intelligents formés sur les données de l'entreprise",
      "Connexion directe de l'agent IA à WhatsApp Business pour répondre aux clients 24h/24",
      "Automatisation de la qualification de prospects et prise de rendez-vous automatique",
      "Intégration d'outils no-code puissants : n8n, Make, Botpress et Flowise",
      "Connexion aux bases de données, CRM et feuilles Google Sheets en temps réel",
      "Méthode pour vendre ce service aux entreprises locales entre 150 000 F et 500 000 F",
      "Templates complets de workflows et prompts d'agents IA fournis clé en main"
    ],
    whatsappMessage: "Bonjour Africa Web, je souhaite m'inscrire à la Formation : Comment créer un agent IA pour les entreprises à 20 000 FCFA."
  }
];

export const PORTFOLIO_PROJECTS: ProjectItem[] = [
  {
    id: "afribaba-trade",
    title: "AfriBABA Global B2B Marketplace",
    category: "ecommerce",
    categoryLabel: "Marketplace B2B & Grossistes (Inspiré d'Alibaba)",
    client: "AfriBABA Group Panafricain",
    domain: "www.afribaba-trade.com",
    domainBadge: "B2B Gold Supplier",
    outcome: "140 000+ commandes de gros traitées · 18 pays connectés",
    description: "Grande plateforme de négoce et de gros inspirée d'Alibaba : annuaire d'usines et grossistes certifiés, demandes de cotation (RFQ), commandes groupées avec prix dégressifs et protection acheteurs.",
    technologies: ["Marketplace B2B", "Catalogue Grossistes", "Demandes RFQ", "Paiement Sécurisé"],
    hosting: "Serveur Cloud Multi-Régions Haute Capacité",
    layoutFormat: "alibaba-b2b",
    heroSlogan: "Le premier hub de commerce de gros et d'approvisionnement en Afrique",
    accentColorName: "Orange Alibaba & Or Industriel",
    colorTheme: {
      primary: "#ff6000",
      primaryDark: "#e05300",
      accent: "#f59e0b",
      lightBg: "#f5f5f7",
      border: "#fed7aa",
      badgeBg: "#fff7ed",
      badgeText: "#c2410c"
    }
  },
  {
    id: "payafrik-gateway",
    title: "PayAfrik Payment Gateway & Checkout",
    category: "vitrine",
    categoryLabel: "Passerelle Fintech & API (Inspiré de CinetPay)",
    client: "PayAfrik Technologies S.A.",
    domain: "payafrik.io",
    domainBadge: "API Uptime 99.99%",
    outcome: "+4.8 Millions de transactions Mobile Money traitées sans faille",
    description: "Infrastructure fintech moderne inspirée de CinetPay : simulateur de checkout Mobile Money (MTN, Moov, Orange, Wave, Visa), documentation SDK développeurs, tableau de bord marchand et webhooks en direct.",
    technologies: ["Passerelle API", "Mobile Money SDK", "Chiffrement PCI-DSS", "Webhooks"],
    hosting: "Architecture Fintech Sécurisée & Redondante",
    layoutFormat: "cinetpay-fintech",
    heroSlogan: "L'infrastructure de paiement unifiée pour toute l'Afrique",
    accentColorName: "Bleu Nuit Fintech & Cyan Électrique",
    colorTheme: {
      primary: "#00d2ff",
      primaryDark: "#070f26",
      accent: "#10b981",
      lightBg: "#0b193d",
      border: "#1e3a8a",
      badgeBg: "#0f275c",
      badgeText: "#38bdf8"
    }
  },
  {
    id: "africonnect-social",
    title: "AfriConnect Social & Hub Communautaire",
    category: "webinaire",
    categoryLabel: "Réseau Social & Communauté (Inspiré de Facebook)",
    client: "AfriConnect Media Network",
    domain: "m.africonnect.net",
    domainBadge: "Communauté Vérifiée",
    outcome: "350 000+ membres actifs et 12 000 groupes professionnels",
    description: "Plateforme communautaire inspirée de Facebook : fil d'actualités temps réel, stories vidéo, boîte de publication interactive, modules de réactions et partages, groupes sectoriels et profils vérifiés.",
    technologies: ["Fil d'actualité temps réel", "Stories Vidéo", "Espaces Communautaires", "Messagerie"],
    hosting: "Plateforme Sociale Haute Scalabilité",
    layoutFormat: "facebook-social",
    heroSlogan: "Connectez-vous aux opportunités, talents et leaders du continent",
    accentColorName: "Bleu Royal Facebook & Blanc Épuré",
    colorTheme: {
      primary: "#1877f2",
      primaryDark: "#0d65d9",
      accent: "#42b72a",
      lightBg: "#f0f2f5",
      border: "#cbd5e1",
      badgeBg: "#e7f3ff",
      badgeText: "#1877f2"
    }
  },
  {
    id: "superdeal-express",
    title: "SuperDeal Africa Mega Store",
    category: "ecommerce",
    categoryLabel: "Grand Magasin E-commerce (Inspiré d'Amazon & Jumia)",
    client: "SuperDeal Logistics Africa",
    domain: "superdeal.africa",
    domainBadge: "Livraison 24h Express",
    outcome: "Plus de 18 000 références livrées avec succès à domicile",
    description: "Grand magasin de vente au détail inspiré d'Amazon et Jumia : ventes flash chronométrées, avis et notations clients 5 étoiles, panier d'achat persistant et système de livraison express en Afrique de l'Ouest.",
    technologies: ["Catalogue Mega-Store", "Ventes Flash", "Calculateur d'expédition", "Mobile Money"],
    hosting: "Cloud E-commerce Haute Disponibilité",
    layoutFormat: "amazon-jumia",
    heroSlogan: "Des millions de produits au meilleur prix avec livraison express",
    accentColorName: "Noir Amazon & Ambre Vente Flash",
    colorTheme: {
      primary: "#131921",
      primaryDark: "#0f1111",
      accent: "#f68b1e",
      lightBg: "#ffffff",
      border: "#e2e8f0",
      badgeBg: "#fef3c7",
      badgeText: "#b45309"
    }
  },
  {
    id: "recettes-guide",
    title: "Le Guide Ultime des 150+ Recettes Béninoises & Africaines",
    category: "ecommerce",
    categoryLabel: "Page de Vente & Tunnel Culinaire (Produit Vedette)",
    client: "KGM Services Culinaire",
    image: "/assets/aistudio/IMG-20260807-WA0001_87ce40ff.jpg",
    domain: "kgmservice.mychariow.com/recette-africaines",
    domainBadge: "Page Officielle Auteur",
    externalLink: "https://kgmservice.mychariow.com/recette-africaines",
    outcome: "+2 400 exemplaires vendus · Taux de conversion de 8.4%",
    description: "Page de vente à fort taux de conversion aux couleurs épicées et chaleureuses de la gastronomie africaine : présentation 3D du livre, réduction immédiate de -80%, preuve sociale et encaissement sécurisé Mobile Money et Visa.",
    technologies: ["Tunnel de Vente", "Chariow Checkout", "Paiements Sécurisés", "Mobile Money"],
    hosting: "Page de Vente Haute Conversion Sécurisée",
    layoutFormat: "culinary-funnel",
    heroSlogan: "La richesse culinaire africaine à portée de clic",
    accentColorName: "Rouge Épices & Ambre Terroir",
    colorTheme: {
      primary: "#b91c1c",
      primaryDark: "#7f1d1d",
      accent: "#f59e0b",
      lightBg: "#fffbeb",
      border: "#fde68a",
      badgeBg: "#fef3c7",
      badgeText: "#991b1b"
    }
  },
  {
    id: "afrikbat-corporate",
    title: "Cabinet AfrikBât Ingénierie & BTP",
    category: "vitrine",
    categoryLabel: "Site Vitrine Corporate BTP & Architecture",
    client: "Cabinet AfrikBât S.A.R.L - Cotonou",
    domain: "cabinet-afrikbat.com",
    domainBadge: "Certifié Ordre BTP",
    outcome: "+180% de consultations et demandes de chantiers en 60 jours",
    description: "Format corporate architectural aux tons bleu acier et anthracite : portfolio de chantiers en haute résolution, spécifications de plans d'ingénierie et formulaire de demande de devis express.",
    technologies: ["Design Institutionnel", "Portfolio Chantiers", "Plans d'ingénierie", "Formulaire Devis"],
    hosting: "Portail Institutionnel avec Nom de Domaine .com",
    layoutFormat: "blueprint-corporate",
    heroSlogan: "Bâtir l'Afrique moderne avec rigueur, innovation et excellence",
    accentColorName: "Bleu Acier & Anthracite Métallique",
    colorTheme: {
      primary: "#0f172a",
      primaryDark: "#020617",
      accent: "#0284c7",
      lightBg: "#f8fafc",
      border: "#cbd5e1",
      badgeBg: "#e0f2fe",
      badgeText: "#0369a1"
    }
  }
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "test-1",
    author: "M. Kodjo Lawson",
    role: "Directeur Général",
    company: "Cabinet Bâtisseurs d'Avenir",
    location: "Cotonou, Bénin",
    content: "Africa Web a configuré notre site vitrine professionnel avec notre nom de domaine, nos emails d'entreprise et un rendu digne des grands cabinets internationaux !",
    rating: 5,
    projectType: "Site Internet Vitrine Entreprise"
  },
  {
    id: "test-2",
    author: "Mme Aminata Diallo",
    role: "Fondatrice",
    company: "AfroChic Boutique",
    location: "Abidjan, Côte d'Ivoire",
    content: "L'équipe a conçu notre boutique en ligne avec les paiements Orange Money, Wave et MTN. Le design est ultra moderne et les pages se chargent en un éclair sur les téléphones de nos clientes.",
    rating: 5,
    projectType: "Boutique E-commerce & Marketplace"
  },
  {
    id: "test-3",
    author: "Dr. Eric Dossou",
    role: "Conférencier & Formateur",
    company: "Afrique Emergence",
    location: "Porto-Novo, Bénin",
    content: "La plateforme webinaire à 250 000 F m'a permis d'automatiser entièrement mes formations. Mes 600 élèves suivent leurs cours en vidéo sans aucun temps de chargement.",
    rating: 5,
    projectType: "Plateforme Webinaire & Cours"
  },
  {
    id: "test-4",
    author: "Sèna Agboton",
    role: "Auteure & Créatrice",
    company: "KGM Saveurs",
    location: "Cotonou / Diaspora",
    content: "Notre guide des 150+ recettes béninoises est devenu un best-seller grâce à la page de vente créée par Africa Web. Le design donne confiance et les paiements Mobile Money et Visa fonctionnent sans accroc.",
    rating: 5,
    projectType: "Tunnel Produit Numérique"
  }
];

export function getWhatsAppUrl(customText?: string, phoneNumber?: string): string {
  const defaultText = "Bonjour Africa Web, je visite votre site internet et je souhaite des informations pour créer mon projet web.";
  const text = encodeURIComponent(customText || defaultText);
  let rawPhone = phoneNumber;
  if (!rawPhone && typeof window !== 'undefined') {
    try {
      const savedInfo = localStorage.getItem('africa_web_cms_info');
      if (savedInfo) {
        const parsed = JSON.parse(savedInfo);
        if (parsed?.whatsappNumber) rawPhone = parsed.whatsappNumber;
      }
    } catch {
      // fallback
    }
  }
  const cleanNumber = (rawPhone || AGENCY_INFO.whatsappNumber).replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanNumber}?text=${text}`;
}

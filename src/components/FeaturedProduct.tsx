import React from 'react';
import { ExternalLink, ShoppingBag, ShieldCheck, Star, Sparkles, Check } from 'lucide-react';
import { useAgency } from '../context/AgencyContext';

export const FeaturedProduct: React.FC = () => {
  const { agencyInfo, trackClick } = useAgency();
  const product = agencyInfo.featuredProduct;

  const handleClickProduct = () => {
    trackClick('product');
  };

  if (product && product.visible === false) {
    return null;
  }

  return (
    <section id="produit-vedette" className="py-16 bg-gradient-to-b from-amber-50/40 via-white to-white border-b border-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-3 py-1 rounded-md mb-2 border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Produit Vedette & Réalisation E-Commerce</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Découvrez notre réalisation e-commerce en action
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-700 font-semibold">
            Voici un exemple concret de page de vente et de produit numérique conçu et optimisé par Africa Web. Cliquez sur le produit pour accéder directement à la page de commande.
          </p>
        </div>

        {/* Featured Product Showcase Card */}
        <div className="bg-white rounded-2xl border-2 border-amber-200 shadow-md hover:shadow-xl transition-all overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 items-center">
            {/* Left: Clickable 3D Product Box Image */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <a
                href={product.link}
                onClick={handleClickProduct}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block w-full max-w-sm rounded-xl overflow-hidden border-2 border-amber-200/80 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-b from-amber-900/5 to-amber-900/10 cursor-pointer"
                title="Cliquez ici pour accéder à la page de vente officielle"
              >
                <div className="relative aspect-[3/4] flex items-center justify-center p-3">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain rounded-lg transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Hover Overlay informing user of direct link */}
                  <div className="absolute inset-0 bg-[#073587]/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center text-white backdrop-blur-[2px]">
                    <ShoppingBag className="w-12 h-12 mb-3 text-amber-400" />
                    <span className="text-base font-bold">Voir la page de vente</span>
                    <span className="text-xs text-amber-200 mt-1 flex items-center gap-1 font-semibold">
                      <span>Redirection immédiate</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Badge Discount Tag */}
                <div className="absolute top-4 right-4 bg-red-600 text-white font-black text-xs px-3 py-1.5 rounded-md shadow-md uppercase tracking-wider animate-pulse">
                  {product.badge}
                </div>
              </a>

              <p className="mt-3 text-xs text-slate-700 font-bold text-center flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
                <span>Cliquez sur l'image pour ouvrir la page de vente</span>
              </p>
            </div>

            {/* Right: Product Details, Offer, & Direct Purchase Action */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                  <span className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </span>
                  <span>4.9/5 · Best-Seller Culinaire Panafricain</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                  <a
                    href={product.link}
                    onClick={handleClickProduct}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#073587] transition-colors"
                  >
                    {product.title}
                  </a>
                </h3>

                <p className="text-sm font-bold text-amber-800">
                  {product.subtitle} · Élaboré avec passion & rigueur
                </p>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed font-semibold">
                Ce guide d'exception rassemble les secrets culinaires des meilleures recettes béninoises et ouest-africaines. Un véritable programme de formation culinaire accessible à tous, doté d'un tunnel de vente à fort taux de conversion conçu par <strong>Africa Web</strong>.
              </p>

              {/* Bullet points of product features */}
              <div className="space-y-2 pt-1 font-semibold">
                {product.highlights.map((point, index) => (
                  <div key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 font-bold" />
                    </div>
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              {/* Payment Partners strip */}
              <div className="pt-3 pb-1 border-t border-slate-100">
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Modes de paiement acceptés sur la page de vente :
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-800">
                  <span className="px-2.5 py-1 bg-slate-100 rounded border border-slate-200">MTN Mobile Money</span>
                  <span className="px-2.5 py-1 bg-slate-100 rounded border border-slate-200">Moov Money</span>
                  <span className="px-2.5 py-1 bg-slate-100 rounded border border-slate-200">Orange Money</span>
                  <span className="px-2.5 py-1 bg-slate-100 rounded border border-slate-200">Wave</span>
                  <span className="px-2.5 py-1 bg-slate-100 rounded border border-slate-200">Visa / Mastercard</span>
                </div>
              </div>

              {/* Direct Purchase Button (Visible and prominent on Android) */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href={product.link}
                  onClick={handleClickProduct}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Acheter ce produit sur la page de vente</span>
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>

                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Accès instantané après paiement</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

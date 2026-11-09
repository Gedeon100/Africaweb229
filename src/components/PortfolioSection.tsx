import React, { useState } from 'react';
import { ExternalLink, Eye, ArrowUpRight, CheckCircle2, ShoppingBag, Layers, Laptop, Video, Smartphone, Globe, ShieldCheck } from 'lucide-react';
import { useAgency } from '../context/AgencyContext';
import { ProjectItem } from '../data/agencyData';

interface PortfolioSectionProps {
  onSelectProject: (project: ProjectItem) => void;
  onOpenSimulator: (project: ProjectItem) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onSelectProject, onOpenSimulator }) => {
  const { portfolioProjects } = useAgency();
  const [activeFilter, setActiveFilter] = useState<'all' | 'vitrine' | 'ecommerce' | 'webinaire'>('all');

  const filteredProjects = activeFilter === 'all'
    ? portfolioProjects
    : portfolioProjects.filter(p => p.category === activeFilter);

  const filterTabs = [
    { id: 'all', label: 'Tous les exemplaires', icon: Layers },
    { id: 'vitrine', label: 'Sites Vitrines & Fintech', icon: Laptop },
    { id: 'ecommerce', label: 'Boutiques & Marketplaces', icon: ShoppingBag },
    { id: 'webinaire', label: 'Réseaux & Communautés', icon: Video },
  ] as const;

  return (
    <section id="realisations" className="py-20 bg-white border-b border-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#073587] mb-2">
            <span>Preuves & Projets Réalisés</span>
            <span aria-hidden="true" className="text-amber-500">·</span>
            <span>Inspirés des Géants du Web (Alibaba, CinetPay, Facebook)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Exemplaires de sites web professionnels déjà réalisés
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-700 font-bold">
            Chaque site possède sa propre identité visuelle, son arrière-plan dédié, sa disposition de nom de domaine personnalisée et une structure inspirée des standards internationaux. Cliquez sur <strong>« Tester & Voir en direct »</strong> pour naviguer dans chaque univers.
          </p>
        </div>

        {/* Interactive Segmented Filter Control */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-xl max-w-fit mb-10 border border-slate-200">
          {filterTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#073587] shadow-xs'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-500' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Projects Grid with Distinct Backgrounds, Domains & Formats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const hasExternal = Boolean(project.externalLink);
            const theme = project.colorTheme || {
              primary: '#073587',
              primaryDark: '#05235c',
              accent: '#f59e0b',
              lightBg: '#ffffff',
              border: '#cbd5e1',
              badgeBg: '#f1f5f9',
              badgeText: '#0f172a'
            };

            const isDarkProject = project.id === 'payafrik-gateway';

            return (
              <div
                key={project.id}
                className="group rounded-2xl border-2 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                style={{
                  backgroundColor: theme.lightBg,
                  borderColor: theme.border
                }}
              >
                {/* Visual Header / Custom Browser Mockup Representation */}
                <div
                  className="relative aspect-[16/10] overflow-hidden border-b-2"
                  style={{ backgroundColor: theme.primaryDark, borderColor: theme.border }}
                >
                  {/* Browser simulated top bar with custom domain disposition */}
                  <div
                    className="absolute top-0 left-0 right-0 z-10 px-3 py-1.5 flex items-center justify-between text-[11px] text-white/80 border-b"
                    style={{ backgroundColor: theme.primaryDark, borderColor: 'rgba(255,255,255,0.1)' }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-400" />
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>

                    <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/40 border border-white/10 font-mono text-[10px] text-white/90 truncate max-w-[190px]">
                      <span className="text-emerald-400">🔒</span>
                      <span className="truncate">{project.domain || (project.externalLink ? project.externalLink.replace('https://', '') : `${project.id}.africa-web.com`)}</span>
                    </div>

                    <span className="text-[9px] font-bold text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/40">
                      LIVE
                    </span>
                  </div>

                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pt-6"
                    />
                  ) : (
                    /* Distinct Simulated HTML Format with project's own colors & style */
                    <div
                      className="w-full h-full flex flex-col justify-between p-4 pt-8 text-white"
                      style={{
                        background: `linear-gradient(135deg, ${theme.primaryDark} 0%, ${theme.primary} 70%, ${theme.accent} 100%)`
                      }}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-1.5">
                          <span
                            className="text-[9px] uppercase font-mono tracking-wider px-2 py-0.5 rounded font-black"
                            style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
                          >
                            {project.categoryLabel}
                          </span>
                          {project.domainBadge && (
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                              {project.domainBadge}
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-black line-clamp-1 mt-1">
                          {project.title}
                        </h4>
                        <p className="text-[11px] text-white/80 line-clamp-2 font-bold">
                          "{project.heroSlogan || project.description}"
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/20">
                        <span className="text-white/90 font-bold truncate max-w-[160px]">{project.client}</span>
                        <span className="text-emerald-300 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Plateforme Active</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Category Pill Tag with distinct project color */}
                  <div
                    className="absolute bottom-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs border"
                    style={{ backgroundColor: '#ffffff', color: theme.primary, borderColor: theme.border }}
                  >
                    {project.categoryLabel}
                  </div>

                  {/* Hover Actions: Simulator & External URL */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4 backdrop-blur-[2px]"
                    style={{ backgroundColor: `${theme.primaryDark}cc` }}
                  >
                    <button
                      onClick={() => onOpenSimulator(project)}
                      className="w-full max-w-[210px] py-2 px-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-[#073587]" />
                      <span>Tester & Voir en direct</span>
                    </button>

                    {hasExternal && (
                      <a
                        href={project.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full max-w-[210px] py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Ouvrir l'URL officielle</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Content Details (Adapts smoothly to light or dark background) */}
                <div className={`p-6 flex-1 flex flex-col justify-between ${isDarkProject ? 'text-white' : 'text-slate-900'}`}>
                  <div>
                    {/* Visual Domain Disposition & Badge Bar */}
                    <div className="p-2.5 rounded-xl border mb-3 flex items-center justify-between gap-2 text-xs font-bold shadow-2xs"
                      style={{
                        backgroundColor: isDarkProject ? '#0d1f4d' : '#ffffff',
                        borderColor: theme.border
                      }}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <Globe className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                        <span className="font-mono text-xs font-black truncate" style={{ color: isDarkProject ? '#38bdf8' : '#073587' }}>
                          {project.domain || `${project.id}.com`}
                        </span>
                      </div>
                      {project.domainBadge && (
                        <span
                          className="text-[10px] font-black uppercase px-2 py-0.5 rounded border shrink-0"
                          style={{
                            backgroundColor: theme.badgeBg,
                            color: theme.badgeText,
                            borderColor: theme.border
                          }}
                        >
                          {project.domainBadge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className={`font-bold truncate max-w-[170px] ${isDarkProject ? 'text-slate-300' : 'text-slate-600'}`}>
                        Client : {project.client}
                      </span>
                      <span
                        className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border"
                        style={{ backgroundColor: theme.badgeBg, color: theme.badgeText, borderColor: theme.border }}
                      >
                        {project.accentColorName || "Thème Pro"}
                      </span>
                    </div>

                    <h3
                      className="text-base font-black transition-colors leading-snug mb-2"
                      style={{ color: isDarkProject ? '#ffffff' : theme.primaryDark }}
                    >
                      {project.title}
                    </h3>

                    <p className={`text-xs line-clamp-3 leading-relaxed mb-4 font-bold ${isDarkProject ? 'text-slate-300' : 'text-slate-700'}`}>
                      {project.description}
                    </p>

                    {/* Measured Business Outcome */}
                    <div
                      className="p-3 rounded-xl border mb-4"
                      style={{
                        backgroundColor: isDarkProject ? '#052e16' : '#ecfdf5',
                        borderColor: isDarkProject ? '#10b981' : '#a7f3d0'
                      }}
                    >
                      <span className={`text-[11px] font-bold block ${isDarkProject ? 'text-emerald-300' : 'text-emerald-900'}`}>
                        Impact & Résultat mesuré :
                      </span>
                      <span className={`text-xs font-black ${isDarkProject ? 'text-emerald-200' : 'text-emerald-800'}`}>
                        {project.outcome}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div>
                    <div className="pt-3 border-t flex items-center justify-between gap-2" style={{ borderColor: theme.border }}>
                      <button
                        onClick={() => onOpenSimulator(project)}
                        className="text-xs font-black flex items-center gap-1.5 py-1.5 cursor-pointer hover:underline"
                        style={{ color: isDarkProject ? '#38bdf8' : theme.primary }}
                      >
                        <Smartphone className="w-4 h-4 text-emerald-500" />
                        <span>Tester & Naviguer sur le site</span>
                      </button>

                      {hasExternal && (
                        <a
                          href={project.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1 font-mono"
                        >
                          <span>Lien direct</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

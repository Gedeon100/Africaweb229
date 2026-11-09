import React from 'react';
import { X, ExternalLink, CheckCircle2, MessageCircle, ArrowRight } from 'lucide-react';
import { ProjectItem, getWhatsAppUrl } from '../data/agencyData';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onOrderSimilar: (projectName: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onOrderSimilar }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full border-2 border-slate-200 shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-[11px] font-semibold text-[#073587] uppercase tracking-wider block">
              {project.categoryLabel}
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              {project.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {project.image && (
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 max-h-72 flex items-center justify-center">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-contain max-h-72"
              />
            </div>
          )}

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
              Présentation du projet
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1">
              Impact & Résultat Obtenu
            </h4>
            <p className="text-sm font-semibold text-emerald-800">
              {project.outcome}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Technologies & Modules déployés
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 rounded-md border border-slate-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          {project.externalLink ? (
            <a
              href={project.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Voir la page officielle en direct</span>
            </a>
          ) : (
            <span className="text-xs text-slate-500">
              Client : <strong>{project.client}</strong>
            </span>
          )}

          <div className="flex items-center gap-2">
            <a
              href={getWhatsAppUrl(`Bonjour Africa Web, j'ai vu votre réalisation "${project.title}" et je souhaite créer un projet similaire.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-white/20" />
              <span>Commander un projet similaire</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

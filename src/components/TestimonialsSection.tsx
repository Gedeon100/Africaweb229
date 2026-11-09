import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { TESTIMONIALS } from '../data/agencyData';

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="temoignages" className="py-20 bg-slate-50/70 border-b border-slate-200/80 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#073587] mb-2">
            <span>Satisfaction Client</span>
            <span aria-hidden="true" className="text-amber-500">·</span>
            <span>Avis & Retours d'Expérience</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Ce que disent nos clients partenaires
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Découvrez comment Africa Web aide entrepreneurs, PME et formateurs à développer leur chiffre d'affaires et asseoir leur autorité.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between"
            >
              <div>
                {/* Header with stars & project tag */}
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>

                  <span className="text-xs font-semibold text-[#073587] bg-blue-50 px-2.5 py-1 rounded-md">
                    {item.projectType}
                  </span>
                </div>

                {/* Quote text */}
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic mb-6">
                  "{item.content}"
                </p>
              </div>

              {/* Author attribution with verified badge */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{item.author}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  </h4>
                  <p className="text-xs text-slate-500">
                    {item.role} · <span className="font-medium text-slate-700">{item.company}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {item.location}
                  </p>
                </div>

                <Quote className="w-8 h-8 text-slate-200 shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

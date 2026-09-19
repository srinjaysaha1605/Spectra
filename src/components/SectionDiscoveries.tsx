import React from 'react';
import { SpectraReport, DiscoveryItem } from '../types/spectra';
import { Compass, Eye } from 'lucide-react';

interface SectionDiscoveriesProps {
  report: SpectraReport;
}

export const SectionDiscoveries: React.FC<SectionDiscoveriesProps> = ({ report }) => {
  const discoveries = report?.discoveries || [];
  console.log('[SECTION DATA] DiscoveriesSection received:', discoveries);

  return (
    <div className="w-full space-y-8 py-6 px-2">
      {/* Header */}
      <div className="space-y-2 border-b border-white/10 pb-6">
        <h1 className="font-display text-2xl sm:text-3xl text-white tracking-wide font-normal">
          Discoveries
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-light tracking-wider">
          Automated structural findings and significant statistical anomalies extracted by SPECTRA.
        </p>
      </div>

      {discoveries && discoveries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {discoveries.map((discovery: DiscoveryItem | any, idx: number) => {
            const discId = discovery?.id ?? `disc-${idx}`;
            return (
              <div
                key={discId}
                className="bg-zinc-950 border border-white/10 p-6 rounded-2xl hover:border-[#c8a962]/40 hover:bg-zinc-900/40 transition-all duration-300 space-y-3 group shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-[#c8a962] shrink-0 group-hover:border-[#c8a962]/50 transition-colors shadow-sm">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg text-white font-normal group-hover:text-[#c8a962] transition-colors">
                        {discovery.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light pl-12">
                  {discovery.description}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-zinc-950 border border-white/10 rounded-2xl p-12 text-center space-y-3">
          <Eye className="w-8 h-8 text-zinc-600 mx-auto" />
          <p className="text-sm font-medium text-white font-mono">No explicit discoveries flagged</p>
          <p className="text-xs text-zinc-500 max-w-md mx-auto font-light">
            The dataset topology appears homogeneous without critical extreme correlations or missingness flags.
          </p>
        </div>
      )}
    </div>
  );
};

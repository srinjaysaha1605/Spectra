import React, { useState } from 'react';
import { SpectraReport, CorrelationPair } from '../types/spectra';
import { ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';

interface SectionRelationshipsProps {
  report: SpectraReport;
}

export const SectionRelationships: React.FC<SectionRelationshipsProps> = ({ report }) => {
  const relationships = report?.relationships || {};
  console.log('[SECTION DATA] FeatureRelationshipsSection received:', relationships);

  const strongCorrelations: CorrelationPair[] =
    relationships.strong_correlations || relationships.correlations || [];
  const topPairs = relationships.top_pairs || strongCorrelations;
  const [filterThreshold, setFilterThreshold] = useState<number>(0.2);

  const safeThreshold = typeof filterThreshold === 'number' && !isNaN(filterThreshold) ? filterThreshold : 0.2;

  const filteredCorrelations = strongCorrelations.filter((c) => {
    const val = typeof c.correlation === 'number' ? c.correlation : (typeof c.score === 'number' ? c.score : 0);
    return Math.abs(val) >= safeThreshold;
  });

  return (
    <div className="w-full space-y-8 py-6 px-2">
      {/* Header */}
      <div className="space-y-2 border-b border-white/10 pb-6">
        <h1 className="font-display text-2xl sm:text-3xl text-white tracking-wide font-normal">
          Feature Relationships
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-light tracking-wider">
          Multivariate linear dependence and cross-feature alignment scores.
        </p>
      </div>

      {/* Top Pairs Summary */}
      {topPairs && topPairs.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-[0.2em] text-[#c8a962] font-mono font-medium">
            Strongest Feature Pair Alignments
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topPairs.slice(0, 6).map((pair: any, idx: number) => {
              const rawScore = pair?.score ?? pair?.correlation ?? 0;
              const scoreVal = typeof rawScore === 'number' ? rawScore : 0;
              return (
                <div
                  key={`top-${pair?.feature_a}-${pair?.feature_b}-${idx}`}
                  className="bg-zinc-950 border border-white/10 p-4 rounded-xl flex items-center justify-between hover:border-[#c8a962]/40 transition-all duration-300 shadow-md"
                >
                  <div className="space-y-1 pr-2">
                    <div className="flex items-center gap-2 text-xs font-mono text-white">
                      <span>{pair.feature_a}</span>
                      <span className="text-[#c8a962]">↔</span>
                      <span>{pair.feature_b}</span>
                    </div>
                    {pair.description && (
                      <p className="text-[11px] text-zinc-400 font-light line-clamp-1">
                        {pair.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-sm text-[#c8a962] font-semibold">
                      {scoreVal.toFixed(3)}
                    </span>
                    <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-mono">
                      Score
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Correlation Matrix */}
      <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-xs uppercase tracking-[0.2em] text-white font-mono font-medium flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#c8a962]" />
            <span>Correlation Matrix</span>
          </h3>

          <span className="text-[11px] text-zinc-500 font-mono">
            Pearson r [-1 to +1]
          </span>
        </div>

        {relationships.correlation_matrix &&
        Object.keys(relationships.correlation_matrix).length > 0 ? (
          <div className="overflow-x-auto flex justify-start md:justify-center w-full no-scrollbar touch-pan-x">
            <div
              className="grid gap-px min-w-max my-2"
              style={{
                gridTemplateColumns: `120px repeat(${
                  Object.keys(relationships.correlation_matrix).length
                }, 80px)`,
              }}
            >
              {/* Empty corner */}
              <div className="h-20" />

              {/* Column labels */}
              {Object.keys(relationships.correlation_matrix).map((feature) => (
                <div
                  key={`col-${feature}`}
                  className="h-20 flex items-end justify-center pb-2 px-1"
                >
                  <span
                    className="text-[10px] text-zinc-400 font-mono whitespace-nowrap"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                  >
                    {feature}
                  </span>
                </div>
              ))}

              {/* Rows */}
              {Object.entries(relationships.correlation_matrix).map(
                ([rowFeature, rowValues]) => (
                  <React.Fragment key={`row-${rowFeature}`}>
                    {/* Row label */}
                    <div className="h-20 flex items-center justify-end pr-4">
                      <span className="text-[10px] text-zinc-400 font-mono whitespace-nowrap">
                        {rowFeature}
                      </span>
                    </div>

                    {/* Correlation cells */}
                    {Object.keys(relationships.correlation_matrix!).map(
                      (columnFeature) => {
                        const value = rowValues[columnFeature] ?? 0;

                        const intensity = Math.min(Math.abs(value), 1);

                        const background =
                          value >= 0
                            ? `rgba(200, 169, 98, ${0.08 + intensity * 0.65})`
                            : `rgba(161, 161, 170, ${0.08 + intensity * 0.65})`;

                        return (
                          <div
                            key={`${rowFeature}-${columnFeature}`}
                            className="h-20 flex items-center justify-center border border-white/5 transition-all hover:border-white/30 hover:z-10"
                            style={{ backgroundColor: background }}
                            title={`${rowFeature} × ${columnFeature}: ${value.toFixed(3)}`}
                          >
                            <span
                              className={`text-[11px] font-mono font-semibold ${
                                value >= 0 ? 'text-[#c8a962]' : 'text-zinc-300'
                              }`}
                            >
                              {value.toFixed(2)}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </React.Fragment>
                )
              )}
            </div>
          </div>
        ) : (
          <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-8 text-center">
            <p className="text-xs text-zinc-500 font-mono">
              Correlation matrix unavailable for this dataset.
            </p>
          </div>
        )}
      </div>

      {/* Filterable Pairwise Correlations List */}
      <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <h3 className="text-xs uppercase tracking-[0.2em] text-white font-mono font-medium">
            Pairwise Correlations (|r| ≥ {safeThreshold.toFixed(2)})
          </h3>

          <div className="flex items-center gap-3 text-xs font-mono text-zinc-300">
            <span>Threshold:</span>
            <input
              type="range"
              min="0"
              max="0.8"
              step="0.05"
              value={filterThreshold}
              onChange={(e) => setFilterThreshold(parseFloat(e.target.value))}
              className="accent-[#c8a962] cursor-pointer"
            />
            <span className="w-8 text-right text-[#c8a962] font-semibold">
              {safeThreshold.toFixed(2)}
            </span>
          </div>
        </div>

        {filteredCorrelations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCorrelations.map((item: CorrelationPair, idx: number) => {
              const rawVal = item.correlation ?? item.score ?? 0;
              const corrVal = typeof rawVal === 'number' ? rawVal : 0;
              const isPositive = corrVal >= 0;
              return (
                <div
                  key={`corr-${item?.feature_a}-${item?.feature_b}-${idx}`}
                  className="bg-zinc-900 border border-white/10 p-4 rounded-xl flex items-center justify-between hover:border-[#c8a962]/40 transition-colors shadow-sm"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 text-xs font-mono text-white">
                      <span>{item.feature_a}</span>
                      <span className="text-zinc-500">&</span>
                      <span>{item.feature_b}</span>
                    </div>
                    {item.description && (
                      <p className="text-[11px] text-zinc-400 font-light">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isPositive ? (
                      <ArrowUpRight className="w-4 h-4 text-[#c8a962]" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-zinc-400" />
                    )}
                    <span className="font-mono text-xs font-semibold text-white">
                      {isPositive ? `+${corrVal.toFixed(3)}` : corrVal.toFixed(3)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-zinc-500 italic py-6 text-center font-mono">
            {strongCorrelations.length === 0
              ? 'No strong correlations reported by the API.'
              : `No correlations meet the selected threshold |r| ≥ ${safeThreshold.toFixed(2)}.`}
          </p>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { SpectraReport, FeatureImportance } from '../types/spectra';
import { BarChart3 } from 'lucide-react';

interface SectionPredictiveProps {
  report: SpectraReport;
}

export const SectionPredictive: React.FC<SectionPredictiveProps> = ({ report }) => {
  const predictiveSignal = Array.isArray(report?.predictive_signal)
    ? report.predictive_signal
    : [];

  console.log('[SECTION DATA] PredictiveImportanceSection received:', predictiveSignal);

  return (
    <div className="w-full space-y-8 py-6 px-2">
      {/* Header */}
      <div className="space-y-2 border-b border-white/10 pb-6">
        <h1 className="font-display text-2xl sm:text-3xl text-white tracking-wide font-normal">
          Predictive Feature Importance
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-light tracking-wider">
          Normalized feature importance vectors and predictive signal attribution rankings.
        </p>
      </div>

      {/* Feature Importances List & Horizontal Bar Visualization */}
      {predictiveSignal && predictiveSignal.length > 0 ? (
        <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-white font-mono font-medium flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#c8a962]" />
              <span>Feature Signal Attribution Rankings</span>
            </h3>
            <span className="text-[11px] text-zinc-500 font-mono">
              Normalized Weights [0.0 - 1.0]
            </span>
          </div>

          <div className="space-y-4">
            {predictiveSignal.map((item: FeatureImportance, idx: number) => {
              const featName = typeof item?.feature === 'string' ? item.feature : `Feature ${idx + 1}`;
              const importanceVal = typeof item?.importance === 'number' ? item.importance : 0;
              const pct = (importanceVal * 100).toFixed(1);

              return (
                <div key={`pred-${featName}-${idx}`} className="space-y-1.5 font-mono">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[#c8a962] font-semibold w-5 text-right">
                        #{idx + 1}
                      </span>
                      <span className="text-white font-medium">{featName}</span>
                    </div>
                    <span className="text-[#c8a962] font-semibold">
                      {importanceVal.toFixed(4)} ({pct}%)
                    </span>
                  </div>

                  <div className="h-3 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-[#c8a962] to-white transition-all duration-700"
                      style={{ width: `${Math.max(2, importanceVal * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-zinc-950 border border-white/10 rounded-2xl p-12 text-center text-xs text-zinc-500 font-mono">
          No predictive feature importances reported by the API.
        </div>
      )}
    </div>
  );
};

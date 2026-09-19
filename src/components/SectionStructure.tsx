import React from 'react';
import { SpectraReport } from '../types/spectra';
import { Layers } from 'lucide-react';

interface SectionStructureProps {
  report: SpectraReport;
}

export const SectionStructure: React.FC<SectionStructureProps> = ({ report }) => {
  const pca = report?.structure?.pca || report?.structure || {};
  console.log('[SECTION DATA] SectionStructure received PCA:', pca);

  const explainedRatio = Array.isArray(pca.explained_variance_ratio) ? pca.explained_variance_ratio : [];
  const cumulativeRatio = Array.isArray(pca.cumulative_variance) ? pca.cumulative_variance : [];

  const pc1_variance =
    typeof pca.pc1_variance === 'number'
      ? pca.pc1_variance
      : explainedRatio[0] ?? 0;

  const pc2_variance =
    typeof pca.pc2_variance === 'number'
      ? pca.pc2_variance
      : explainedRatio[1] ?? 0;

  const total_variance =
    typeof pca.total_variance === 'number'
      ? pca.total_variance
      : cumulativeRatio.length > 0
      ? cumulativeRatio[cumulativeRatio.length - 1]
      : pc1_variance + pc2_variance;

  const components =
    typeof pca.components === 'number'
      ? pca.components
      : typeof pca.n_components === 'number'
      ? pca.n_components
      : explainedRatio.length > 0
      ? explainedRatio.length
      : 2;

  const pc1Pct = (pc1_variance * 100).toFixed(2);
  const pc2Pct = (pc2_variance * 100).toFixed(2);
  const totalPct = (total_variance * 100).toFixed(2);

  return (
    <div className="w-full space-y-8 py-6 px-2">
      {/* Header */}
      <div className="space-y-2 border-b border-white/10 pb-6">
        <h1 className="font-display text-2xl sm:text-3xl text-white tracking-wide font-normal">
          PCA / Dimensional Structure
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-light tracking-wider">
          Principal component decomposition and variance retention proportions.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-950 border border-white/10 p-5 rounded-2xl space-y-2 hover:border-[#c8a962]/40 transition-all duration-300 shadow-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-widest font-mono">Components</span>
            <Layers className="w-4 h-4 text-[#c8a962]" />
          </div>
          <p className="font-display text-2xl sm:text-3xl text-white">
            {components}
          </p>
          <p className="text-[11px] text-zinc-500 font-light">Principal Axes</p>
        </div>

        <div className="bg-zinc-950 border border-white/10 p-5 rounded-2xl space-y-2 hover:border-[#c8a962]/40 transition-all duration-300 shadow-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-widest font-mono">PC1 Variance</span>
          </div>
          <p className="font-display text-2xl sm:text-3xl text-[#c8a962]">
            {pc1Pct}%
          </p>
          <p className="text-[11px] text-zinc-500 font-light">Primary Variance Axis</p>
        </div>

        <div className="bg-zinc-950 border border-white/10 p-5 rounded-2xl space-y-2 hover:border-[#c8a962]/40 transition-all duration-300 shadow-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-widest font-mono">PC2 Variance</span>
          </div>
          <p className="font-display text-2xl sm:text-3xl text-[#c8a962]">
            {pc2Pct}%
          </p>
          <p className="text-[11px] text-zinc-500 font-light">Secondary Variance Axis</p>
        </div>

        <div className="bg-zinc-950 border border-white/10 p-5 rounded-2xl space-y-2 hover:border-[#c8a962]/40 transition-all duration-300 shadow-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-widest font-mono">Total Retained</span>
          </div>
          <p className="font-display text-2xl sm:text-3xl text-white">
            {totalPct}%
          </p>
          <p className="text-[11px] text-zinc-500 font-light">Cumulative Subspace Variance</p>
        </div>
      </div>

      {/* Variance Bar Charts */}
      <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
        <h3 className="text-xs uppercase tracking-[0.2em] text-white font-mono font-medium">
          Retained Variance Ratios
        </h3>

        <div className="space-y-4 font-mono">
          {/* PC1 */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-300">Principal Component 1 (PC1)</span>
              <span className="text-[#c8a962] font-semibold">{pc1Pct}%</span>
            </div>
            <div className="h-3 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-[#c8a962] to-white transition-all duration-700"
                style={{ width: `${Math.max(2, pc1_variance * 100)}%` }}
              />
            </div>
          </div>

          {/* PC2 */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-300">Principal Component 2 (PC2)</span>
              <span className="text-[#c8a962] font-semibold">{pc2Pct}%</span>
            </div>
            <div className="h-3 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-[#c8a962]/70 transition-all duration-700"
                style={{ width: `${Math.max(2, total_variance > 0 ? (pc2_variance / total_variance) * 100 : pc2_variance * 100)}%` }}
              />
            </div>
          </div>

          {/* Total Cumulative */}
          <div className="pt-2 border-t border-white/10 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white font-semibold">Cumulative Retained Variance</span>
              <span className="text-white font-semibold">{totalPct}%</span>
            </div>
            <div className="h-3 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-white transition-all duration-700"
                style={{ width: `${Math.max(2, total_variance * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

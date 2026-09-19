import React from 'react';
import { SpectraReport } from '../types/spectra';
import { Database, Hash, Columns, AlertTriangle, Table } from 'lucide-react';

interface SectionOverviewProps {
  report: SpectraReport;
  fileName: string;
}

export const SectionOverview: React.FC<SectionOverviewProps> = ({ report, fileName }) => {
  const dataset = report?.dataset || {};
  console.log('[SECTION DATA] DatasetOverviewSection received:', dataset);
  const rows = dataset.rows ?? 0;
  const columns = dataset.columns ?? dataset.cols ?? 0;
  const numerical_columns = dataset.numerical_columns ?? dataset.numerical_cols ?? [];
  const categorical_columns = dataset.categorical_columns ?? dataset.categorical_cols ?? [];
  const missing_values_count = dataset.missing_values_count ?? {};
  const summary_stats = dataset.summary_stats ?? {};

  return (
    <div className="w-full space-y-8 py-6 px-2">
      {/* Header */}
      <div className="space-y-2 border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-white tracking-wide font-normal">
            Dataset Overview
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light tracking-wider mt-1">
            Structural topology and summary metrics for <span className="text-[#c8a962] font-mono">{fileName}</span>
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-[#c8a962]" />
          <span>Live Analysis</span>
        </div>
      </div>

      {/* Top Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-950 border border-white/10 p-5 rounded-2xl space-y-2 hover:border-[#c8a962]/40 transition-all duration-300">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-widest font-mono">Records</span>
            <Database className="w-4 h-4 text-[#c8a962]" />
          </div>
          <p className="font-display text-2xl sm:text-3xl text-white">
            {rows.toLocaleString()}
          </p>
          <p className="text-[11px] text-zinc-500 font-light">Total rows analyzed</p>
        </div>

        <div className="bg-zinc-950 border border-white/10 p-5 rounded-2xl space-y-2 hover:border-[#c8a962]/40 transition-all duration-300">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-widest font-mono">Dimensions</span>
            <Columns className="w-4 h-4 text-[#c8a962]" />
          </div>
          <p className="font-display text-2xl sm:text-3xl text-white">
            {columns}
          </p>
          <p className="text-[11px] text-zinc-500 font-light">Feature attributes</p>
        </div>

        <div className="bg-zinc-950 border border-white/10 p-5 rounded-2xl space-y-2 hover:border-[#c8a962]/40 transition-all duration-300">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-widest font-mono">Numerical</span>
            <Hash className="w-4 h-4 text-[#c8a962]" />
          </div>
          <p className="font-display text-2xl sm:text-3xl text-[#c8a962]">
            {numerical_columns.length}
          </p>
          <p className="text-[11px] text-zinc-500 font-light">Quantitative columns</p>
        </div>

        <div className="bg-zinc-950 border border-white/10 p-5 rounded-2xl space-y-2 hover:border-[#c8a962]/40 transition-all duration-300">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-widest font-mono">Categorical</span>
            <Table className="w-4 h-4 text-[#c8a962]" />
          </div>
          <p className="font-display text-2xl sm:text-3xl text-white">
            {categorical_columns.length}
          </p>
          <p className="text-[11px] text-zinc-500 font-light">Discrete features</p>
        </div>
      </div>

      {/* Feature Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Numerical Columns */}
        <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 space-y-3">
          <h3 className="text-xs uppercase tracking-[0.2em] text-[#c8a962] font-mono font-medium flex items-center justify-between">
            <span>Numerical Features ({numerical_columns.length})</span>
          </h3>
          {numerical_columns.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {numerical_columns.map((col: any, idx: number) => {
                const colName = typeof col === 'string' ? col : (col?.name || String(col));
                return (
                  <span
                    key={`num-${colName}-${idx}`}
                    className="px-3 py-1 rounded-md bg-zinc-900 border border-white/10 text-xs text-zinc-200 font-mono"
                  >
                    {colName}
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-zinc-500 italic">No numerical columns detected.</p>
          )}
        </div>

        {/* Categorical Columns */}
        <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 space-y-3">
          <h3 className="text-xs uppercase tracking-[0.2em] text-[#c8a962] font-mono font-medium flex items-center justify-between">
            <span>Categorical Features ({categorical_columns.length})</span>
          </h3>
          {categorical_columns.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {categorical_columns.map((col: any, idx: number) => {
                const colName = typeof col === 'string' ? col : (col?.name || String(col));
                return (
                  <span
                    key={`cat-${colName}-${idx}`}
                    className="px-3 py-1 rounded-md bg-zinc-900 border border-white/10 text-xs text-zinc-200 font-mono"
                  >
                    {colName}
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-zinc-500 italic">No categorical columns detected.</p>
          )}
        </div>
      </div>

      {/* Missing Values breakdown if present */}
      {missing_values_count && Object.keys(missing_values_count).length > 0 && (
        <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs uppercase tracking-[0.2em] text-zinc-300 font-mono font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#c8a962]" />
            <span>Missing Value Integrity</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Object.entries(missing_values_count).map(([col, missingCount], idx) => {
              const countNum = Number(missingCount);
              return (
                <div
                  key={`miss-${col}-${idx}`}
                  className="bg-zinc-900 border border-white/10 p-3.5 rounded-xl text-xs flex justify-between items-center"
                >
                  <span className="font-mono text-zinc-300 truncate max-w-[100px]">{col}</span>
                  <span className={`font-mono ${countNum > 0 ? 'text-[#c8a962]' : 'text-zinc-500'}`}>
                    {countNum} missing
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary Statistics Table */}
      {summary_stats && Object.keys(summary_stats).length > 0 && (
        <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 space-y-4 overflow-hidden shadow-xl">
          <h3 className="text-xs uppercase tracking-[0.2em] text-white font-mono font-medium">
            Quantitative Summary Statistics
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 uppercase tracking-widest text-[10px]">
                  <th className="py-3 px-3">Feature</th>
                  <th className="py-3 px-3">Mean</th>
                  <th className="py-3 px-3">Std Dev</th>
                  <th className="py-3 px-3">Min</th>
                  <th className="py-3 px-3">25% (Q1)</th>
                  <th className="py-3 px-3">Median</th>
                  <th className="py-3 px-3">75% (Q3)</th>
                  <th className="py-3 px-3">Max</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-zinc-300">
                {Object.entries(summary_stats).map(([col, s]) => {
                  const stats = s as { mean?: number; std?: number; min?: number; max?: number; median?: number; q25?: number; q75?: number };
                  return (
                    <tr key={col} className="hover:bg-zinc-900/60 transition-colors">
                      <td className="py-3 px-3 font-semibold text-white">{col}</td>
                      <td className="py-3 px-3 text-zinc-300">{stats.mean ?? '—'}</td>
                      <td className="py-3 px-3 text-zinc-300">{stats.std ?? '—'}</td>
                      <td className="py-3 px-3 text-zinc-300">{stats.min ?? '—'}</td>
                      <td className="py-3 px-3 text-zinc-300">{stats.q25 ?? '—'}</td>
                      <td className="py-3 px-3 text-[#c8a962] font-semibold">{stats.median ?? '—'}</td>
                      <td className="py-3 px-3 text-zinc-300">{stats.q75 ?? '—'}</td>
                      <td className="py-3 px-3 text-zinc-300">{stats.max ?? '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

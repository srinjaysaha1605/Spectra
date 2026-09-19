import React from 'react';
import { SpectraReport } from '../types/spectra';
import { AlertCircle, AlertTriangle } from 'lucide-react';

interface SectionAnomaliesProps {
  report: SpectraReport;
}

export const SectionAnomalies: React.FC<SectionAnomaliesProps> = ({ report }) => {
  const anomaliesData = report?.anomalies || {};
  console.log('[SECTION DATA] SectionAnomalies received anomaliesData:', anomaliesData);

  // Derive observations list first
  const extremeObservations =
    Array.isArray(anomaliesData.extreme_observations) && anomaliesData.extreme_observations.length > 0
      ? anomaliesData.extreme_observations
      : Array.isArray(anomaliesData.observations) && anomaliesData.observations.length > 0
      ? anomaliesData.observations
      : Array.isArray(anomaliesData.points)
      ? anomaliesData.points
      : [];

  // Derive total anomalies count
  const totalAnomalies =
    typeof anomaliesData.total_anomalies === 'number'
      ? anomaliesData.total_anomalies
      : typeof anomaliesData.total === 'number'
      ? anomaliesData.total
      : typeof anomaliesData.count === 'number'
      ? anomaliesData.count
      : extremeObservations.length;

  // Derive sample count dynamically (defaults to 5,000 for bounded sampling)
  const sampleCount =
    typeof anomaliesData.sample_size === 'number'
      ? anomaliesData.sample_size
      : typeof anomaliesData.sample_count === 'number'
      ? anomaliesData.sample_count
      : typeof anomaliesData.total_sample === 'number'
      ? anomaliesData.total_sample
      : typeof anomaliesData.analyzed_records === 'number'
      ? anomaliesData.analyzed_records
      : 5000;

  // Derive anomaly rate ratio (0 to 1) or percentage
  let rateRatio = 0;
  if (typeof anomaliesData.anomaly_rate === 'number') {
    rateRatio = anomaliesData.anomaly_rate;
  } else if (typeof anomaliesData.rate === 'number') {
    rateRatio = anomaliesData.rate;
  } else if (typeof anomaliesData.anomaly_percentage === 'number') {
    rateRatio = anomaliesData.anomaly_percentage / 100;
  } else if (typeof anomaliesData.percentage === 'number') {
    rateRatio = anomaliesData.percentage / 100;
  } else if (sampleCount > 0) {
    rateRatio = totalAnomalies / sampleCount;
  }

  const ratePct = (rateRatio * 100).toFixed(2);

  return (
    <div className="w-full space-y-8 py-6 px-2">
      {/* Header */}
      <div className="space-y-2 border-b border-white/10 pb-6">
        <h1 className="font-display text-2xl sm:text-3xl text-white tracking-wide font-normal">
          Anomaly Detection
        </h1>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-zinc-400 font-light tracking-wider">
          <span>Isolation Forest &middot; Local Outlier Factor &middot; Z-Score</span>
          <span className="text-[#c8a962] text-[11px] font-mono font-medium border border-[#c8a962]/30 px-2 py-0.5 rounded-full bg-[#c8a962]/10">
            Consensus = &ge;2 of 3 detectors agree
          </span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-zinc-950 border border-white/10 p-5 rounded-2xl space-y-2 hover:border-[#c8a962]/40 transition-all duration-300 shadow-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-widest font-mono">Flagged Anomalies</span>
            <AlertCircle className="w-4 h-4 text-[#c8a962]" />
          </div>
          <p className="font-display text-2xl sm:text-3xl text-white">
            {totalAnomalies.toLocaleString()} Consensus Anomalies
          </p>
          <p className="text-[11px] text-zinc-500 font-light">Consensus anomaly instances</p>
        </div>

        <div className="bg-zinc-950 border border-white/10 p-5 rounded-2xl space-y-2 hover:border-[#c8a962]/40 transition-all duration-300 shadow-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-widest font-mono">Anomaly Rate</span>
            <AlertTriangle className="w-4 h-4 text-[#c8a962]" />
          </div>
          <p className="font-display text-2xl sm:text-3xl text-[#c8a962]">
            {ratePct}%
          </p>
          <p className="text-[11px] text-zinc-500 font-light">
            {totalAnomalies.toLocaleString()} of {sampleCount.toLocaleString()} analyzed records
          </p>
        </div>
      </div>

      {/* Extreme Observations Table */}
      <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="space-y-1 border-b border-white/10 pb-3">
          <h3 className="text-xs uppercase tracking-[0.2em] text-white font-mono font-medium flex items-center justify-between">
            <span>Extreme Observations</span>
            <span className="text-[11px] text-zinc-500 font-mono">
              Consensus Anomaly Log
            </span>
          </h3>
          <p className="text-[11px] text-zinc-400 font-light">
            {totalAnomalies.toLocaleString()} anomalies identified in the {sampleCount.toLocaleString()}-record analysis sample.
          </p>
        </div>

        {extremeObservations && extremeObservations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 uppercase tracking-widest text-[10px]">
                  <th className="py-3 px-3">Row Index</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Top Statistical Deviations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-zinc-300">
                {extremeObservations.map((obs: any, idx: number) => {
                  const rowNum = obs.row_index ?? obs.row ?? obs.index ?? idx;
                  const rawScore = obs.score ?? obs.anomaly_score ?? 0;
                  const scoreVal = typeof rawScore === 'number' ? rawScore : 0;

                  const contributors = Array.isArray(obs.contributors) ? obs.contributors : [];
                  const valuesObj = obs.values && typeof obs.values === 'object' ? obs.values : null;

                  return (
                    <tr key={`obs-${rowNum}-${idx}`} className="hover:bg-zinc-900/60 transition-colors">
                      <td className="py-3 px-3 font-semibold text-white">Row #{rowNum}</td>
                      <td className="py-3 px-3 text-[#c8a962] font-semibold">
                        {scoreVal !== 0 ? scoreVal.toFixed(3) : 'Flagged'}
                      </td>
                      <td className="py-3 px-3">
                        {contributors.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {contributors.map((feat: any, fIdx: number) => {
                              const featName = typeof feat === 'string' ? feat : (feat?.feature || feat?.name || String(feat));
                              const zScore = typeof feat === 'object' && typeof feat?.z_score === 'number' ? feat.z_score : null;

                              return (
                                <span
                                  key={`contrib-${idx}-${fIdx}-${featName}`}
                                  className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-[11px] text-zinc-300"
                                >
                                  {featName}
                                  {zScore !== null && (
                                    <span className="text-[#c8a962] ml-1">
                                      (Z: {zScore.toFixed(2)})
                                    </span>
                                  )}
                                </span>
                              );
                            })}
                          </div>
                        ) : valuesObj ? (
                          <div className="flex flex-wrap gap-1.5">
                            {Object.entries(valuesObj).map(([vKey, vVal]) => (
                              <span
                                key={`val-${idx}-${vKey}`}
                                className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-[11px] text-zinc-300"
                              >
                                {vKey}: <span className="text-[#c8a962]">{String(vVal)}</span>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-zinc-500 italic">Multivariate deviation</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-zinc-500 italic py-6 text-center font-mono">
            No extreme individual observation records flagged.
          </p>
        )}
      </div>
    </div>
  );
};

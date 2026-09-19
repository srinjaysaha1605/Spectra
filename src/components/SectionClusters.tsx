import React from 'react';
import { SpectraReport } from '../types/spectra';
import { Network, PieChart } from 'lucide-react';

interface SectionClustersProps {
  report: SpectraReport;
}

export const SectionClusters: React.FC<SectionClustersProps> = ({ report }) => {
  const clustersData = report?.clusters || report?.structure?.clusters || {};
  console.log('[SECTION DATA] SectionClusters received clustersData:', clustersData);

  // Derive optimal K
  let bestK =
    clustersData.best_k ??
    clustersData.n_clusters ??
    clustersData.num_clusters ??
    clustersData.recommended_k ??
    clustersData.k ??
    0;

  if (!bestK && Array.isArray(clustersData.cluster_summaries) && clustersData.cluster_summaries.length > 0) {
    bestK = clustersData.cluster_summaries.length;
  }

  // Derive Silhouette Score / Metric
  const silhouetteScore =
    typeof clustersData.best_silhouette_score === 'number'
      ? clustersData.best_silhouette_score
      : typeof clustersData.silhouette_score === 'number'
      ? clustersData.silhouette_score
      : typeof clustersData.best_silhouette === 'number'
      ? clustersData.best_silhouette
      : typeof clustersData.silhouette === 'number'
      ? clustersData.silhouette
      : typeof clustersData.inertia === 'number'
      ? clustersData.inertia
      : 0;

  // Derive Cluster Distribution
  let clusterDistribution: Record<string, number> = {};

  if (clustersData.cluster_distribution && Object.keys(clustersData.cluster_distribution).length > 0) {
    clusterDistribution = clustersData.cluster_distribution;
  } else if (clustersData.distribution && Object.keys(clustersData.distribution).length > 0) {
    clusterDistribution = clustersData.distribution;
  } else if (Array.isArray(clustersData.cluster_summaries) && clustersData.cluster_summaries.length > 0) {
    clustersData.cluster_summaries.forEach((summary, idx) => {
      const cId = summary.cluster_id ?? summary.id ?? idx;
      clusterDistribution[String(cId)] = summary.count;
    });
  } else if (Array.isArray(clustersData.points) && clustersData.points.length > 0) {
    clustersData.points.forEach((pt) => {
      const cId = pt.cluster ?? pt.cluster_id ?? 0;
      clusterDistribution[String(cId)] = (clusterDistribution[String(cId)] || 0) + 1;
    });
  }

  // Derive Silhouette Curve / Evaluation scores
  let silhouetteScores: Record<string, number> = {};

  if (clustersData.silhouette_scores && Object.keys(clustersData.silhouette_scores).length > 0) {
    silhouetteScores = clustersData.silhouette_scores;
  } else if (Array.isArray(clustersData.cluster_scores) && clustersData.cluster_scores.length > 0) {
    clustersData.cluster_scores.forEach((cs) => {
      if (typeof cs.k === 'number' && typeof cs.silhouette === 'number') {
        silhouetteScores[String(cs.k)] = cs.silhouette;
      }
    });
  }

  const totalPoints = Object.values(clusterDistribution).reduce((acc: number, val: number) => {
    const v = typeof val === 'number' ? val : 0;
    return acc + v;
  }, 0);

  return (
    <div className="w-full space-y-8 py-6 px-2">
      {/* Header */}
      <div className="space-y-2 border-b border-white/10 pb-6">
        <h1 className="font-display text-2xl sm:text-3xl text-white tracking-wide font-normal">
          Cluster Analysis
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-light tracking-wider">
          Unsupervised cluster partition metrics and Silhouette coefficient optimization.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-zinc-950 border border-white/10 p-5 rounded-2xl space-y-2 hover:border-[#c8a962]/40 transition-all duration-300 shadow-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-widest font-mono">Optimal K</span>
            <Network className="w-4 h-4 text-[#c8a962]" />
          </div>
          <p className="font-display text-2xl sm:text-3xl text-white">
            {bestK > 0 ? `${bestK} Clusters` : 'Not Formed'}
          </p>
          <p className="text-[11px] text-zinc-500 font-light">Best partition count</p>
        </div>

        <div className="bg-zinc-950 border border-white/10 p-5 rounded-2xl space-y-2 hover:border-[#c8a962]/40 transition-all duration-300 shadow-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-widest font-mono">
              {typeof clustersData.inertia === 'number' && !clustersData.best_silhouette_score ? 'Cluster Inertia' : 'Silhouette Score'}
            </span>
          </div>
          <p className="font-display text-2xl sm:text-3xl text-[#c8a962]">
            {silhouetteScore !== 0 ? silhouetteScore.toFixed(3) : 'N/A'}
          </p>
          <p className="text-[11px] text-zinc-500 font-light">
            {typeof clustersData.inertia === 'number' && !clustersData.best_silhouette_score ? 'Sum of squared distances' : 'Separation quality [-1 to +1]'}
          </p>
        </div>

        <div className="bg-zinc-950 border border-white/10 p-5 rounded-2xl space-y-2 hover:border-[#c8a962]/40 transition-all duration-300 shadow-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-widest font-mono">Clustered Records</span>
          </div>
          <p className="font-display text-2xl sm:text-3xl text-white">
            {totalPoints.toLocaleString()}
          </p>
          <p className="text-[11px] text-zinc-500 font-light">Assigned data points</p>
        </div>
      </div>

      {/* Cluster Population Distribution */}
      {Object.keys(clusterDistribution).length > 0 ? (
        <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-white font-mono font-medium flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#c8a962]" />
              <span>Cluster Population Breakdown</span>
            </h3>
            <span className="text-[11px] text-zinc-500 font-mono">
              Total Points: {totalPoints}
            </span>
          </div>

          <div className="space-y-4">
            {Object.entries(clusterDistribution).map(([cId, countRaw], idx) => {
              const count = typeof countRaw === 'number' ? countRaw : 0;
              const pct = totalPoints > 0 ? ((count / totalPoints) * 100).toFixed(1) : '0';

              return (
                <div key={`bar-${String(cId)}-${idx}`} className="space-y-1.5 font-mono">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white font-medium">Cluster #{cId}</span>
                    <span className="text-[#c8a962]">
                      {count.toLocaleString()} rows ({pct}%)
                    </span>
                  </div>

                  <div className="h-2.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-[#c8a962] transition-all duration-700"
                      style={{
                        width: `${Math.max(2, totalPoints > 0 ? (count / totalPoints) * 100 : 0)}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Individual Cluster Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-4 border-t border-white/10">
            {Object.entries(clusterDistribution).map(([cId, countRaw], idx) => {
              const count = typeof countRaw === 'number' ? countRaw : 0;
              const pct = totalPoints > 0 ? ((count / totalPoints) * 100).toFixed(1) : '0';

              return (
                <div
                  key={`card-${String(cId)}-${idx}`}
                  className="bg-zinc-900 border border-white/10 p-4 rounded-xl space-y-1"
                >
                  <p className="text-xs font-mono font-medium text-white">Cluster #{cId}</p>
                  <p className="text-lg font-mono text-[#c8a962] font-semibold">{count} samples</p>
                  <p className="text-[11px] text-zinc-400 font-light">{pct}% of analyzed sample</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-zinc-950 border border-white/10 rounded-2xl p-8 text-center text-zinc-500 font-mono text-xs">
          No cluster population partition records found in dataset report.
        </div>
      )}

      {/* Silhouette Scores Across Candidate K values */}
      {Object.keys(silhouetteScores).length > 0 && (
        <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-xs uppercase tracking-[0.2em] text-[#c8a962] font-mono font-medium">
            Candidate K Evaluation (Silhouette Curves)
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Object.entries(silhouetteScores).map(([kVal, scoreRaw], idx) => {
              const score = typeof scoreRaw === 'number' ? scoreRaw : 0;
              const isBest = String(kVal) === String(bestK);

              return (
                <div
                  key={`kscore-${kVal}-${idx}`}
                  className={`p-3.5 rounded-xl border text-xs font-mono transition-colors ${
                    isBest
                      ? 'bg-zinc-900 border-[#c8a962] text-white shadow-[0_0_15px_rgba(200,169,98,0.2)]'
                      : 'bg-zinc-950 border-white/10 text-zinc-400'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">K = {kVal}</span>
                    {isBest && (
                      <span className="text-[9px] uppercase tracking-widest text-[#c8a962] font-bold">
                        Best
                      </span>
                    )}
                  </div>
                  <p className={`text-base font-semibold ${isBest ? 'text-[#c8a962]' : 'text-zinc-200'}`}>
                    {score.toFixed(3)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

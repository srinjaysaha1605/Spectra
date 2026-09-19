export interface DatasetOverview {
  rows: number;
  cols?: number;
  columns?: number;
  feature_names?: string[];
  column_names?: string[];
  numerical_cols?: string[];
  numerical_columns?: string[];
  categorical_cols?: string[];
  categorical_columns?: string[];
  missing_values_count?: Record<string, number>;
  summary_stats?: Record<string, {
    mean?: number;
    std?: number;
    min?: number;
    max?: number;
    median?: number;
    q25?: number;
    q75?: number;
  }>;
}

export interface DiscoveryItem {
  id: string;
  title: string;
  insight?: string;
  description?: string;
  significance: 'high' | 'medium' | 'low' | string;
  type?: string;
  metric?: string;
}

export interface CorrelationPair {
  feature_a: string;
  feature_b: string;
  correlation?: number;
  score?: number;
  description?: string;
}

export interface FeatureRelationships {
  correlations?: CorrelationPair[];
  strong_correlations?: CorrelationPair[];
  top_correlations?: CorrelationPair[];
  mutual_information?: Array<{
    feature_a?: string;
    feature_b?: string;
    feature?: string;
    target?: string;
    score?: number;
    mutual_info?: number;
    description?: string;
  }>;
  top_pairs?: Array<{
    feature_a: string;
    feature_b: string;
    score: number;
    description?: string;
  }>;
  correlation_matrix?: Record<string, Record<string, number>>;
}

export interface PcaData {
  components?: number;
  n_components?: number;
  pc1_variance?: number;
  pc2_variance?: number;
  total_variance?: number;
  explained_variance_ratio?: number[];
  cumulative_variance?: number[];
  loadings?: Record<string, Record<string, number>>;
  pca_points?: any[];
}

export interface ClusterScore {
  k: number;
  silhouette: number;
}

export interface ClusterData {
  num_clusters?: number;
  best_k?: number;
  n_clusters?: number;
  recommended_k?: number;
  k?: number;
  best_silhouette?: number;
  best_silhouette_score?: number;
  silhouette_score?: number;
  inertia?: number;
  cluster_scores?: ClusterScore[];
  silhouette_scores?: Record<string, number>;
  distribution?: Record<string, number>;
  cluster_distribution?: Record<string, number>;
  cluster_summaries?: Array<{
    cluster_id?: number;
    id?: number;
    count: number;
    percentage?: number;
    center?: Record<string, number>;
  }>;
  points?: any[];
  target_ari?: number;
}

export interface PcaStructure {
  pca?: PcaData;
  clusters?: ClusterData;
  explained_variance_ratio?: number[];
  cumulative_variance?: number[];
  loadings?: Record<string, Record<string, number>>;
  pca_points?: any[];
}

export interface AnomalyObservation {
  row?: number;
  row_index?: number;
  index?: number;
  score?: number;
  anomaly_score?: number;
  is_anomaly?: boolean;
  methods_agreeing?: number;
  contributors?: any[];
  values?: Record<string, number>;
}

export interface AnomalySummary {
  isolation_forest?: number;
  local_outlier_factor?: number;
  extreme_z_score?: number;
  consensus?: number;
}

export interface AnomalyDetection {
  summary?: AnomalySummary;
  total?: number;
  total_anomalies?: number;
  count?: number;
  rate?: number;
  anomaly_rate?: number;
  anomaly_percentage?: number;
  percentage?: number;
  observations?: AnomalyObservation[];
  extreme_observations?: AnomalyObservation[];
  points?: AnomalyObservation[];
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export type PredictiveSignal = FeatureImportance[] | null;

export interface SpectraReport {
  dataset: DatasetOverview;
  discoveries: DiscoveryItem[];
  relationships: FeatureRelationships;
  structure: PcaStructure;
  clusters?: ClusterData;
  anomalies: AnomalyDetection;
  predictive_signal?: PredictiveSignal;
}

export type SectionKey =
  | 'upload'
  | 'overview'
  | 'discoveries'
  | 'relationships'
  | 'structure'
  | 'clusters'
  | 'anomalies'
  | 'predictive';

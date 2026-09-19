"""
SPECTRA Local Engine - FastAPI Backend
Run with:
    pip install fastapi uvicorn pandas numpy scikit-learn openpyxl
    uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
"""

import io
import math
from typing import Optional
from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np

try:
    from sklearn.decomposition import PCA
    from sklearn.preprocessing import StandardScaler
    from sklearn.ensemble import IsolationForest, RandomForestClassifier, RandomForestRegressor
    from sklearn.cluster import KMeans
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False

app = FastAPI(title="SPECTRA Engine", description="Intelligent Dataset Exploration Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "engine": "SPECTRA v1.0"}

@app.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    target_column: Optional[str] = Form(None)
):
    contents = await file.read()
    filename = file.filename.lower()

    try:
        if filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(contents))
        elif filename.endswith((".xls", ".xlsx")):
            df = pd.read_excel(io.BytesIO(contents))
        else:
            df = pd.read_csv(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse file: {str(e)}")

    if df.empty:
        raise HTTPException(status_code=400, detail="Uploaded dataset is empty")

    rows, cols = df.shape
    column_names = list(df.columns)
    
    num_cols = list(df.select_dtypes(include=[np.number]).columns)
    cat_cols = [c for c in column_names if c not in num_cols]

    missing_counts = {str(col): int(df[col].isna().sum()) for col in column_names}

    summary_stats = {}
    for col in num_cols:
        series = df[col].dropna()
        if not series.empty:
            summary_stats[col] = {
                "mean": float(round(series.mean(), 4)),
                "std": float(round(series.std(), 4)) if len(series) > 1 else 0.0,
                "min": float(round(series.min(), 4)),
                "max": float(round(series.max(), 4)),
                "median": float(round(series.median(), 4)),
                "q25": float(round(series.quantile(0.25), 4)),
                "q75": float(round(series.quantile(0.75), 4)),
            }

    # Clean numeric data for ML
    df_num = df[num_cols].fillna(df[num_cols].median()) if num_cols else pd.DataFrame()

    # 1. Discoveries
    discoveries = []
    disc_id = 1

    # Missing value discovery
    tot_missing = sum(missing_counts.values())
    if tot_missing > 0:
        pct = round((tot_missing / (rows * cols)) * 100, 1)
        discoveries.append({
            "id": f"disc-{disc_id}",
            "title": "Data Incompleteness Detected",
            "description": f"Found {tot_missing} missing cells across dataset ({pct}% missing rate).",
            "significance": "high" if pct > 10 else "medium",
            "type": "missing"
        })
        disc_id += 1

    # Correlation matrix
    correlations_list = []
    top_pairs = []
    if len(num_cols) >= 2 and not df_num.empty:
        corr_matrix = df_num.corr()
        for i in range(len(num_cols)):
            for j in range(i + 1, len(num_cols)):
                c_val = corr_matrix.iloc[i, j]
                if not math.isnan(c_val):
                    c_round = float(round(c_val, 4))
                    col_a, col_b = num_cols[i], num_cols[j]
                    correlations_list.append({
                        "feature_a": col_a,
                        "feature_b": col_b,
                        "correlation": c_round
                    })
                    if abs(c_round) >= 0.6:
                        top_pairs.append({
                            "feature_a": col_a,
                            "feature_b": col_b,
                            "score": abs(c_round),
                            "description": f"{'Strong positive' if c_round > 0 else 'Strong inverse'} linear association ({c_round})."
                        })
                        if len(discoveries) < 6 and abs(c_round) >= 0.75:
                            discoveries.append({
                                "id": f"disc-{disc_id}",
                                "title": f"Strong Alignment: {col_a} & {col_b}",
                                "description": f"High linear correlation coefficient of {c_round}.",
                                "significance": "high",
                                "type": "correlation"
                            })
                            disc_id += 1

    top_pairs.sort(key=lambda x: x["score"], reverse=True)

    # 2. PCA & Structure
    pca_exp_var = []
    pca_pts = []
    loadings_dict = {}

    if SKLEARN_AVAILABLE and len(num_cols) >= 2 and len(df_num) >= 3:
        try:
            scaler = StandardScaler()
            scaled_data = scaler.fit_transform(df_num)

            pca = PCA(n_components=min(len(num_cols), 5))
            pca_res = pca.fit_transform(scaled_data)

            pca_exp_var = [float(round(v, 4)) for v in pca.explained_variance_ratio_]

            # Sample up to 200 points for visualization speed
            sample_size = min(200, len(pca_res))
            indices = np.random.choice(len(pca_res), size=sample_size, replace=False) if len(pca_res) > 200 else range(len(pca_res))
            
            for idx in indices:
                pca_pts.append({
                    "x": float(round(pca_res[idx, 0], 4)),
                    "y": float(round(pca_res[idx, 1], 4)),
                    "label": f"Row {idx + 1}"
                })

            for idx, col in enumerate(num_cols):
                loadings_dict[col] = {
                    "pc1": float(round(pca.components_[0, idx], 4)),
                    "pc2": float(round(pca.components_[1, idx], 4)) if pca.components_.shape[0] > 1 else 0.0
                }

            if sum(pca_exp_var[:2]) > 0.6:
                discoveries.append({
                    "id": f"disc-{disc_id}",
                    "title": "High Dimensional Variance Compression",
                    "description": f"First two Principal Components preserve {round(sum(pca_exp_var[:2])*100, 1)}% of total variance.",
                    "significance": "high",
                    "type": "structure"
                })
                disc_id += 1
        except Exception:
            pass

    # 3. Cluster Analysis
    cluster_data = {"num_clusters": 0, "clusters": []}
    if SKLEARN_AVAILABLE and len(pca_pts) >= 10:
        try:
            pts_array = np.array([[p["x"], p["y"]] for p in pca_pts])
            k = min(3, len(pts_array))
            kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
            cluster_labels = kmeans.fit_predict(pts_array)

            for i, p in enumerate(pca_pts):
                p["cluster"] = int(cluster_labels[i])

            clusters_list = []
            for c_id in range(k):
                cnt = int(np.sum(cluster_labels == c_id))
                pct = float(round((cnt / len(cluster_labels)) * 100, 1))
                clusters_list.append({
                    "cluster_id": c_id,
                    "count": cnt,
                    "percentage": pct,
                    "label": f"Cluster {chr(65 + c_id)}"
                })

            cluster_data = {
                "num_clusters": k,
                "clusters": clusters_list
            }

            discoveries.append({
                "id": f"disc-{disc_id}",
                "title": f"Natural Spatial Partitioning ({k} Clusters)",
                "description": f"Data points naturally partition into {k} cohesive topological clusters.",
                "significance": "medium",
                "type": "cluster"
            })
            disc_id += 1
        except Exception:
            pass

    # 4. Anomaly Detection
    anomalies_res = {"count": 0, "anomaly_rate": 0.0, "top_anomalies": []}
    if SKLEARN_AVAILABLE and len(df_num) >= 10:
        try:
            iso = IsolationForest(contamination=0.05, random_state=42)
            preds = iso.fit_predict(df_num)
            scores = -iso.score_samples(df_num)

            anom_indices = np.where(preds == -1)[0]
            anom_count = len(anom_indices)
            anom_rate = float(round(anom_count / len(df_num), 4))

            top_anom_items = []
            # Sort by anomaly score descending
            sorted_anom_idx = sorted(anom_indices, key=lambda idx: scores[idx], reverse=True)[:10]
            
            for idx in sorted_anom_idx:
                kf = {}
                for col in num_cols[:4]:
                    kf[col] = float(round(df_num.iloc[idx][col], 2))
                top_anom_items.append({
                    "row_index": int(idx),
                    "score": float(round(scores[idx], 4)),
                    "key_features": kf
                })

            anomalies_res = {
                "count": anom_count,
                "anomaly_rate": anom_rate,
                "top_anomalies": top_anom_items
            }

            if anom_count > 0:
                discoveries.append({
                    "id": f"disc-{disc_id}",
                    "title": f"Structural Anomalies Detected ({anom_count} records)",
                    "description": f"Isolation Forest flagged {anom_count} rows ({round(anom_rate*100, 1)}%) as multivariate outliers.",
                    "significance": "high" if anom_rate > 0.05 else "medium",
                    "type": "outlier"
                })
                disc_id += 1
        except Exception:
            pass

    # 5. Predictive Feature Importance
    feature_importances = []
    model_perf = {}
    target_used = target_column if (target_column and target_column in column_names) else None

    if SKLEARN_AVAILABLE and target_used and target_used in column_names and len(num_cols) >= 2:
        try:
            X_cols = [c for c in num_cols if c != target_used]
            if X_cols:
                X = df_num[X_cols]
                y = df[target_used].fillna(df[target_used].mode()[0] if not df[target_used].empty else 0)

                is_classification = df[target_used].nunique() <= 10 or str(df[target_used].dtype) == 'object'
                
                if is_classification:
                    model = RandomForestClassifier(n_estimators=50, random_state=42)
                else:
                    model = RandomForestRegressor(n_estimators=50, random_state=42)
                
                model.fit(X, y)
                imps = model.feature_importances_

                for col, imp in zip(X_cols, imps):
                    feature_importances.append({
                        "feature": col,
                        "importance": float(round(imp, 4))
                    })
                feature_importances.sort(key=lambda x: x["importance"], reverse=True)

                model_perf["target"] = target_used
                model_perf["type"] = "Classification" if is_classification else "Regression"
                model_perf["estimator"] = "Random Forest"
        except Exception:
            pass

    # Fallback feature importances by variance / centrality if no target
    if not feature_importances and num_cols:
        variances = df_num.var()
        tot_var = sum(variances) if sum(variances) > 0 else 1.0
        for col in num_cols:
            imp = float(round(variances[col] / tot_var, 4))
            feature_importances.append({
                "feature": col,
                "importance": imp
            })
        feature_importances.sort(key=lambda x: x["importance"], reverse=True)

    # Return canonical SPECTRA JSON
    return {
        "dataset": {
            "rows": rows,
            "cols": cols,
            "columns": cols,
            "column_names": column_names,
            "feature_names": column_names,
            "numerical_columns": num_cols,
            "numerical_cols": num_cols,
            "categorical_columns": cat_cols,
            "categorical_cols": cat_cols,
            "missing_values_count": missing_counts,
            "summary_stats": summary_stats
        },
        "discoveries": discoveries,
        "relationships": {
            "correlations": correlations_list,
            "top_pairs": top_pairs
        },
        "structure": {
            "pca_explained_variance": pca_exp_var,
            "pca_points": pca_pts,
            "loadings": loadings_dict
        },
        "clusters": cluster_data,
        "anomalies": anomalies_res,
        "predictive_signal": {
            "target": target_used,
            "feature_importances": feature_importances,
            "model_performance": model_perf
        }
    }

# SPECTRA ML ENGINE

<p align="center">
  <img src="https://img.shields.io/badge/ML-Analysis-000000?style=for-the-badge&logo=scikitlearn&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-FastAPI-000000?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/React-TypeScript-000000?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/AI-Gemini-000000?style=for-the-badge&logo=google&logoColor=white" />
</p>

<p align="center">
  <strong>THE UNSEEN HAS A SHAPE.</strong>
</p>

<p align="center">
  An evidence-first machine learning engine for exploring, analyzing, and understanding tabular datasets.
</p>

---

## `01` — WHAT IS SPECTRA?

**SPECTRA ML ENGINE** takes a raw CSV or Excel dataset and turns it into a structured analytical report.

It examines the dataset from multiple angles:

```text
DATASET
   │
   ├── Structure
   ├── Relationships
   ├── Dimensionality
   ├── Clusters
   ├── Anomalies
   └── Predictive Signal
          │
          ▼
   STRUCTURED EVIDENCE
          │
          ▼
   AI INTERPRETATION
```

SPECTRA is deliberately **not** a generic AI chatbot with a file uploader and some charts.

The machine learning and statistical engine performs the analysis first.

**AI comes after the evidence.**

---

## `02` — WHY AN ANALYSIS ENGINE?

Most AI data-analysis tools follow:

```text
Upload → Ask AI → Get Answer
```

SPECTRA follows:

```text
Upload
  ↓
Profile
  ↓
Measure
  ↓
Detect
  ↓
Evaluate
  ↓
Structure the Evidence
  ↓
Interpret with AI
```

The distinction matters.

SPECTRA does not ask Gemini to *guess* what is happening inside a dataset.

The engine computes things such as:

- correlations
- explained variance
- silhouette scores
- cluster populations
- anomaly consensus
- statistical deviations
- model-derived feature importance

Gemini then helps turn those measurements into understandable explanations.

> **The engine produces the evidence.  
> The AI explains the evidence.**

---

# `03` — THE ANALYSIS PIPELINE

### `01 / PROFILE`

Understand what the dataset contains.

- Records
- Dimensions
- Numerical columns
- Categorical columns
- Target column
- Missing values
- Duplicate records
- Category distributions

---

### `02 / RELATIONSHIPS`

Measure how variables relate to each other.

For numerical data:

**Pearson correlation**

For mixed and categorical data:

**Eta² · Cramér's V**

SPECTRA surfaces meaningful relationships instead of simply dumping a raw matrix onto the screen.

---

### `03 / STRUCTURE`

Use **Principal Component Analysis** to examine the underlying dimensional structure of numerical feature space.

SPECTRA reports:

- Components
- Variance explained
- Total retained variance

---

### `04 / CLUSTERS`

Search for natural groupings using **K-Means**.

Multiple values of `K` are evaluated using the **silhouette score** to identify the strongest observed cluster structure.

The report includes:

- Optimal K
- Silhouette score
- Cluster populations
- Population percentages

---

### `05 / ANOMALIES`

SPECTRA does not rely on a single outlier detector.

It combines:

```text
Isolation Forest
       +
Local Outlier Factor
       +
Z-Score Analysis
       ↓
Consensus Anomaly
```

An observation is classified as a **consensus anomaly** when at least two of the three detection methods agree.

This makes the result easier to inspect and reason about than a single black-box anomaly score.

---

### `06 / PREDICTIVE SIGNAL`

When a classification target is available, SPECTRA uses a **Random Forest** model to identify model-derived feature importance.

This helps answer:

> Which features contribute most strongly to the model's predictions?

Importantly, **feature importance is treated as predictive signal, not causality.**

---

### `07 / AI INTERPRETATION`

Only after the analytical report exists does Gemini enter the pipeline.

The AI receives the computed evidence and explains:

- What the findings mean
- Which patterns are notable
- How different findings relate
- What deserves further investigation

The AI layer is therefore an **interpretation layer**, not the analytical foundation.

---

# `04` — LARGE DATASETS

SPECTRA is designed to remain practical beyond small demo datasets.

For larger datasets, expensive ML/statistical operations are bounded to a **5,000-row analysis sample**.

Lightweight dataset-level operations can still use the complete dataset.

The interface explicitly distinguishes:

```text
DATASET
45,211 records

ANALYZED SAMPLE
5,000 records
```

This prevents the scope of an analysis from being hidden from the user.

---

# `05` — WHAT CAN IT HELP WITH?

SPECTRA is useful when you have a dataset but don't yet have a clear understanding of what is inside it.

### Students

Explore real datasets while seeing how techniques such as PCA, clustering, correlation, and anomaly detection behave in practice.

### Data Analysts

Get a structured first-pass analysis before deeper investigation.

### ML Developers

Inspect a dataset before designing a modeling pipeline.

### Researchers

Quickly examine relationships, structure, anomalies, and potential predictive signals in unfamiliar tabular data.

### Anyone exploring tabular data

Upload the data and get a systematic analytical starting point without manually wiring together multiple analysis workflows.

---

# `06` — ARCHITECTURE

```text
┌──────────────────────────────────────────┐
│                  SPECTRA                 │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │            FRONTEND                │  │
│  │                                    │  │
│  │ React · TypeScript · Vite          │  │
│  │ Tailwind CSS                       │  │
│  └─────────────────┬──────────────────┘  │
│                    │                     │
│              HTTP / JSON                 │
│                    │                     │
│  ┌─────────────────▼──────────────────┐  │
│  │         ANALYSIS ENGINE             │  │
│  │                                    │  │
│  │ FastAPI · Pandas · NumPy · SciPy  │  │
│  │ Scikit-learn                       │  │
│  └─────────────────┬──────────────────┘  │
│                    │                     │
│             Structured Report            │
│                    │                     │
│  ┌─────────────────▼──────────────────┐  │
│  │        AI INTERPRETATION            │  │
│  │                                    │  │
│  │              Gemini                │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

### Frontend

`React` · `TypeScript` · `Vite` · `Tailwind CSS`

### Analysis Engine

`Python` · `FastAPI` · `Pandas` · `NumPy` · `SciPy` · `Scikit-learn`

### ML / Statistical Methods

`PCA` · `K-Means` · `Random Forest` · `Isolation Forest` · `LOF` · `Mutual Information`

`Pearson Correlation` · `Z-Score` · `Eta²` · `Cramér's V` · `Silhouette Score`

### AI

`Gemini`

---

# `07` — INPUT → OUTPUT

### Input

```text
.csv
.xls
.xlsx
```

### Output

A structured analytical report containing:

```text
Dataset Overview
       ↓
Discoveries
       ↓
Feature Relationships
       ↓
PCA
       ↓
Clusters
       ↓
Anomalies
       ↓
Predictive Feature Importance
       ↓
AI Interpretation
```

---

# `08` — EXAMPLE

A banking dataset might produce evidence such as:

```text
45,211 records
17 columns

7 numerical columns
10 categorical columns

Strongest numerical relationship
pdays ↔ previous
r = 0.514

Cluster structure
K = 2
Silhouette = 0.344

Consensus anomalies
164 / 5,000 analyzed records

Highest model-derived feature importance
duration
0.3837
```

SPECTRA doesn't stop at displaying these numbers.

It organizes them into a coherent analytical report and provides an AI interpretation layer on top.

---

# `09` — DESIGN PRINCIPLES

### Evidence over decoration

Every major output should correspond to an actual analytical computation.

### Computation over hallucination

Statistical and ML results come from the analysis engine, not from generated text.

### AI after analysis

LLMs interpret evidence; they do not replace the analytical pipeline.

### Explicit scope

Sample-based analysis is clearly identified as sample-based.

### Multiple signals

Where appropriate, SPECTRA combines multiple analytical methods instead of depending on a single metric.

### Structured output

The engine produces consistent JSON rather than an unstructured block of AI-generated conclusions.

---

# `10` — WHAT SPECTRA IS NOT

SPECTRA is **not**:

```text
× A generic chatbot
× A dashboard template
× A collection of disconnected ML demos
× An AutoML replacement
× A "upload CSV → AI tells you everything" black box
```

It is a focused analytical system built around one idea:

> **Understand the dataset first. Explain it second.**

---

# `11` — PROJECT STRUCTURE

```text
SPECTRA
│
├── frontend
│   ├── components
│   ├── services
│   ├── types
│   └── data
│
└── spectra-api
    ├── app.py
    ├── engine.py
    ├── test_engine.py
    ├── requirements.txt
    └── render.yaml
```

The frontend and Python analysis engine are intentionally separated.

---

# `12` — THE IDEA

There is a difference between **asking AI about data** and **building a system that analyzes data**.

SPECTRA is built around the second idea.

```text
RAW DATA
   ↓
MEASURE
   ↓
ANALYZE
   ↓
VALIDATE
   ↓
STRUCTURE
   ↓
EXPLAIN
```

## SPECTRA ML ENGINE

**SEE THE STRUCTURE.**  
**MEASURE THE EVIDENCE.**  
**UNDERSTAND THE DATA.**

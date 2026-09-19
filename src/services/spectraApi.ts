import { SpectraReport } from '../types/spectra';

const env = (import.meta as unknown as { env?: Record<string, string> }).env || {};
export const API_BASE_URL = env.VITE_SPECTRA_API_URL || 'https://spectra-api-4gkx.onrender.com';

export type ErrorCategory =
  | 'UNREACHABLE'
  | 'CORS_OR_MIXED_CONTENT'
  | 'HTTP_ERROR'
  | 'VALIDATION_FAILED';

export class SpectraApiError extends Error {
  public isEngineOffline: boolean;
  public status?: number;
  public category: ErrorCategory;
  public rawError?: unknown;
  public rawMessage?: string;

  constructor(
    message: string,
    category: ErrorCategory = 'UNREACHABLE',
    status?: number,
    rawError?: unknown,
    rawMessage?: string
  ) {
    super(message);
    this.name = 'SpectraApiError';
    this.category = category;
    this.isEngineOffline = category === 'UNREACHABLE' || category === 'CORS_OR_MIXED_CONTENT';
    this.status = status;
    this.rawError = rawError;
    this.rawMessage = rawMessage || (rawError instanceof Error ? rawError.message : String(rawError ?? ''));
  }
}

/**
 * Sends a dataset file (CSV/XLS/XLSX) and optional target column to the SPECTRA Python engine on Render.
 * Endpoint: POST https://spectra-api-4gkx.onrender.com/analyze
 * Body: multipart/form-data with `file` and optional `target_column`.
 * Note: Content-Type header is omitted to allow automatic browser boundary calculation.
 */
export async function analyzeDataset(
  file: File,
  targetColumn?: string
): Promise<SpectraReport> {
  const formData = new FormData();
  formData.append('file', file);
  if (targetColumn && targetColumn.trim() !== '') {
    formData.append('target_column', targetColumn.trim());
  }

  const endpoint = `${API_BASE_URL.replace(/\/$/, '')}/analyze`;

  const fetchStartTimestamp = new Date().toISOString();
  const fetchStartTime = performance.now();
  console.log(`[SPECTRA DEBUG] /analyze request initiated at: ${fetchStartTimestamp}`, {
    endpoint,
    fileName: file.name,
    fileSize: file.size,
    targetColumn: targetColumn || null,
  });

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    const fetchEndTimestamp = new Date().toISOString();
    const durationMs = (performance.now() - fetchStartTime).toFixed(2);

    console.log(`[SPECTRA DEBUG] /analyze response received at: ${fetchEndTimestamp}`, {
      status: response.status,
      statusText: response.statusText,
      duration: `${durationMs}ms`,
    });

    if (!response.ok) {
      let errorText = '';
      try {
        const errJson = await response.json();
        errorText = errJson.detail || errJson.message || errJson.error || '';
      } catch {
        errorText = await response.text();
      }

      const status = response.status;
      let category: ErrorCategory = 'HTTP_ERROR';
      let userMsg = '';

      if (status === 400 || status === 422) {
        category = 'VALIDATION_FAILED';
        userMsg = errorText
          ? `Dataset Validation Failed: ${errorText}`
          : 'Dataset Validation Failed: The uploaded file could not be validated or parsed by the SPECTRA engine.';
      } else {
        userMsg = `SPECTRA Engine returned HTTP status ${status}: ${errorText || response.statusText || 'Server Error'}`;
      }

      const apiErr = new SpectraApiError(
        userMsg,
        category,
        status,
        undefined,
        errorText || `HTTP ${status} ${response.statusText}`
      );

      console.error('SPECTRA API request failed:', apiErr);
      throw apiErr;
    }

    // Render exact JSON returned from API
    const report: SpectraReport = await response.json();

    console.log('[SPECTRA LIVE REPORT]', {
      dataset: report.dataset,
      discoveries: report.discoveries,
      relationships: report.relationships,
      structure: report.structure,
      anomalies: report.anomalies,
      predictive_signal: report.predictive_signal,
    });

    return report;
  } catch (err: unknown) {
    if (err instanceof SpectraApiError) {
      throw err;
    }

    console.error('SPECTRA API request failed:', err);

    const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const isTargetHttp = API_BASE_URL.startsWith('http:');

    let category: ErrorCategory = 'UNREACHABLE';
    let userMsg = '';

    if (isHttps && isTargetHttp) {
      category = 'CORS_OR_MIXED_CONTENT';
      userMsg = `Browser blocked request to ${API_BASE_URL} due to security policies (HTTPS page requesting insecure HTTP endpoint).`;
    } else {
      category = 'UNREACHABLE';
      userMsg = `Unable to connect to SPECTRA Engine at ${API_BASE_URL}. Ensure the service is online and active.`;
    }

    const rawMsg = err instanceof Error ? err.message : String(err ?? '');
    throw new SpectraApiError(userMsg, category, undefined, err, rawMsg);
  }
}

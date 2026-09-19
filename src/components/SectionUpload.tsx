import React, { useState, useRef, useEffect } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Sigil } from './Sigil';
import { analyzeDataset, SpectraApiError, ErrorCategory } from '../services/spectraApi';
import { SpectraReport } from '../types/spectra';
import {
  Upload,
  FileSpreadsheet,
  Check,
  AlertCircle,
  ChevronDown,
  Target,
} from 'lucide-react';

interface SectionUploadProps {
  onAnalysisSuccess: (report: SpectraReport, fileName: string) => void;
}

interface ErrorState {
  message: string;
  category: ErrorCategory;
  isOffline: boolean;
  rawMessage?: string;
}

export const SectionUpload: React.FC<SectionUploadProps> = ({ onAnalysisSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    setError(null);
    setFile(selectedFile);
    setIsParsing(true);
    setColumns([]);
    setSelectedTarget('');
    setIsDropdownOpen(false);

    const fileName = selectedFile.name.toLowerCase();

    if (fileName.endsWith('.csv')) {
      Papa.parse(selectedFile, {
        header: true,
        preview: 10,
        skipEmptyLines: true,
        complete: (results) => {
          setIsParsing(false);
          if (results.meta && results.meta.fields) {
            setColumns(results.meta.fields);
          } else if (results.data && results.data.length > 0) {
            setColumns(Object.keys(results.data[0] as object));
          }
        },
        error: (err) => {
          setIsParsing(false);
          console.error('SPECTRA API request failed:', err);
          setError({
            message: `CSV Header Parsing Warning: ${err.message}`,
            category: 'VALIDATION_FAILED',
            isOffline: false,
            rawMessage: err.message,
          });
        },
      });
    } else if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
          if (json && json.length > 0) {
            const headerRow = json[0] as string[];
            setColumns(headerRow.map(String));
          }
        } catch (err: unknown) {
          console.error('SPECTRA API request failed:', err);
          setError({
            message: 'Failed to read Excel column headers.',
            category: 'VALIDATION_FAILED',
            isOffline: false,
            rawMessage: err instanceof Error ? err.message : String(err),
          });
        } finally {
          setIsParsing(false);
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    } else {
      setIsParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRunAnalysis = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const report = await analyzeDataset(file, selectedTarget);
      onAnalysisSuccess(report, file.name);
    } catch (err: unknown) {
      if (err instanceof SpectraApiError) {
        setError({
          message: err.message,
          category: err.category,
          isOffline: err.isEngineOffline,
          rawMessage: err.rawMessage,
        });
      } else {
        const rawMsg = err instanceof Error ? err.message : String(err ?? '');
        setError({
          message: rawMsg || 'Dataset analysis could not be completed.',
          category: 'HTTP_ERROR',
          isOffline: false,
          rawMessage: rawMsg,
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 py-6 px-4 select-none">
      {/* Title Header */}
      <div className="space-y-2 border-b border-white/10 pb-6">
        <h1 className="font-display text-2xl sm:text-3xl text-white tracking-wide font-normal">
          Dataset Upload
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-light tracking-wider mt-1">
          Feed tabular telemetry into the SPECTRA mathematical reasoning engine.
        </p>
      </div>

      {/* Stylish Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border rounded-2xl p-8 sm:p-16 text-center transition-all duration-300 cursor-pointer group overflow-hidden
          ${
            isDragOver
              ? 'border-[#c8a962] bg-[#c8a962]/10 shadow-[0_0_40px_rgba(200,169,98,0.25)] scale-[1.01]'
              : 'bg-[#030303] border-white/10 hover:border-[#c8a962]/60 hover:bg-zinc-950/80 hover:shadow-[0_0_30px_rgba(200,169,98,0.12)]'
          }
        `}
      >
        {/* Geometric Corner Accent Markers */}
        <span className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#c8a962]/40 group-hover:border-[#c8a962] transition-colors" />
        <span className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#c8a962]/40 group-hover:border-[#c8a962] transition-colors" />
        <span className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#c8a962]/40 group-hover:border-[#c8a962] transition-colors" />
        <span className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#c8a962]/40 group-hover:border-[#c8a962] transition-colors" />

        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 bg-radial from-[#c8a962]/[0.08] via-transparent to-transparent pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xls,.xlsx"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFileSelect(e.target.files[0]);
            }
          }}
          className="hidden"
        />

        <div className="relative z-10 flex flex-col items-center justify-center space-y-5">
          {/* Animated Central Icon Frame */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-zinc-900/90 border border-white/15 flex items-center justify-center text-zinc-400 group-hover:text-[#c8a962] group-hover:border-[#c8a962]/60 group-hover:shadow-[0_0_20px_rgba(200,169,98,0.3)] transition-all duration-300 shadow-xl">
              {file ? (
                <FileSpreadsheet className="w-9 h-9 text-[#c8a962] animate-bounce" />
              ) : (
                <Upload className="w-9 h-9 transform group-hover:-translate-y-1 transition-transform duration-300" />
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-lg font-medium text-white group-hover:text-[#c8a962] transition-colors tracking-wide">
              {file ? file.name : 'Select or drop dataset file'}
            </p>
            <p className="text-xs text-zinc-400 font-light tracking-widest uppercase font-mono">
              Supports CSV &bull; XLS &bull; XLSX
            </p>
          </div>

          {file && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-[#c8a962]/50 text-xs font-mono text-[#c8a962] shadow-[0_0_15px_rgba(200,169,98,0.2)]">
              <Check className="w-3.5 h-3.5 text-[#c8a962]" />
              <span>{(file.size / 1024).toFixed(1)} KB</span>
            </div>
          )}
        </div>
      </div>

      {/* Target Column Selection & Analyze Button */}
      {file && (
        <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 flex-1 min-w-0">
              <label className="block text-xs uppercase tracking-widest text-zinc-300 font-medium">
                Optional Target Column (Supervised Feature Signal Attribution)
              </label>
              {isParsing ? (
                <p className="text-xs text-zinc-500 italic animate-pulse font-mono py-2">
                  Parsing column structure...
                </p>
              ) : columns.length > 0 ? (
                /* Custom Styled Dark Gold Dropdown Menu */
                <div ref={dropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`
                      w-full flex items-center justify-between bg-zinc-900 border text-left text-sm rounded-xl px-4 py-3.5 transition-all duration-200 outline-none cursor-pointer font-mono
                      ${
                        isDropdownOpen
                          ? 'border-[#c8a962] ring-1 ring-[#c8a962]/50 shadow-[0_0_20px_rgba(200,169,98,0.15)] bg-zinc-900'
                          : 'border-white/10 hover:border-[#c8a962]/40 hover:bg-zinc-900/80 text-white'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Target className="w-4 h-4 text-[#c8a962] shrink-0" />
                      <span className={selectedTarget ? 'text-white font-medium' : 'text-zinc-400'}>
                        {selectedTarget ? selectedTarget : 'None (Unsupervised Structural Discovery)'}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-[#c8a962] transition-transform duration-200 shrink-0 ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-zinc-950 border border-[#c8a962]/40 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl animate-fadeIn p-1.5 space-y-0.5 max-h-60 overflow-y-auto font-mono text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTarget('');
                          setIsDropdownOpen(false);
                        }}
                        className={`
                          w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-left transition-colors cursor-pointer
                          ${
                            selectedTarget === ''
                              ? 'bg-zinc-900 text-[#c8a962] font-semibold border-l-2 border-[#c8a962]'
                              : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                          }
                        `}
                      >
                        <span>None (Unsupervised Structural Discovery)</span>
                        {selectedTarget === '' && <Check className="w-3.5 h-3.5 text-[#c8a962]" />}
                      </button>

                      {columns.map((col) => (
                        <button
                          key={col}
                          type="button"
                          onClick={() => {
                            setSelectedTarget(col);
                            setIsDropdownOpen(false);
                          }}
                          className={`
                            w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-left transition-colors cursor-pointer
                            ${
                              selectedTarget === col
                                ? 'bg-zinc-900 text-[#c8a962] font-semibold border-l-2 border-[#c8a962]'
                                : 'text-zinc-300 hover:bg-zinc-900/60 hover:text-white'
                            }
                          `}
                        >
                          <span className="truncate">{col}</span>
                          {selectedTarget === col && <Check className="w-3.5 h-3.5 text-[#c8a962]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-zinc-500 py-2">
                  No column headers auto-detected. Target can be specified manually in backend.
                </p>
              )}
            </div>

            {/* Primary Action Button with Sigil */}
            <div className="shrink-0">
              <button
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
                className="w-full md:w-auto relative inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-[#c8a962] text-black text-xs font-mono uppercase tracking-[0.2em] font-semibold hover:bg-[#d4af37] hover:shadow-[0_0_25px_rgba(200,169,98,0.35)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer outline-none"
              >
                <Sigil size="sm" dark={true} isLoading={isAnalyzing} ariaLabel="SPECTRA Sigil" />
                <span>{isAnalyzing ? 'Analyzing Dataset...' : 'Analyze Dataset'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subtle Toast / Notification for Error State */}
      {error && (
        <div className="bg-zinc-950 border border-amber-500/30 rounded-xl p-4 text-zinc-300 shadow-xl max-w-xl mx-auto flex items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-[#c8a962] shrink-0" />
            <p className="text-xs font-mono text-zinc-300">
              Analysis is temporarily unavailable. Please try again later.
            </p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-zinc-500 hover:text-zinc-300 text-xs font-mono shrink-0 cursor-pointer p-1"
            aria-label="Dismiss notification"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

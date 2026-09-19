import React, { useState } from 'react';
import { SectionKey, SpectraReport } from '../types/spectra';
import { Sigil } from './Sigil';
import { SectionUpload } from './SectionUpload';
import { SectionOverview } from './SectionOverview';
import { SectionDiscoveries } from './SectionDiscoveries';
import { SectionRelationships } from './SectionRelationships';
import { SectionStructure } from './SectionStructure';
import { SectionClusters } from './SectionClusters';
import { SectionAnomalies } from './SectionAnomalies';
import { SectionPredictive } from './SectionPredictive';

import {
  Upload,
  Database,
  Compass,
  GitCommit,
  Layers,
  Network,
  AlertCircle,
  Target,
  Menu,
  X,
  FileText,
  ChevronRight,
} from 'lucide-react';

interface WorkspaceLayoutProps {
  report: SpectraReport | null;
  fileName: string;
  onAnalysisSuccess: (report: SpectraReport, fileName: string) => void;
  onReturnToLanding: () => void;
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  report,
  fileName,
  onAnalysisSuccess,
  onReturnToLanding,
}) => {
  const [activeSection, setActiveSection] = useState<SectionKey>(
    report ? 'overview' : 'upload'
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const navItems = [
    { key: 'upload' as SectionKey, label: 'Upload', icon: Upload, disabled: false },
    { key: 'overview' as SectionKey, label: 'Overview', icon: Database, disabled: !report },
    { key: 'discoveries' as SectionKey, label: 'Discoveries', icon: Compass, disabled: !report },
    { key: 'relationships' as SectionKey, label: 'Relationships', icon: GitCommit, disabled: !report },
    { key: 'structure' as SectionKey, label: 'Structure', icon: Layers, disabled: !report },
    { key: 'clusters' as SectionKey, label: 'Clusters', icon: Network, disabled: !report },
    { key: 'anomalies' as SectionKey, label: 'Anomalies', icon: AlertCircle, disabled: !report },
    { key: 'predictive' as SectionKey, label: 'Predictive', icon: Target, disabled: !report },
  ];

  const handleSelectSection = (key: SectionKey) => {
    setActiveSection(key);
    setIsMobileMenuOpen(false);
  };

  const handleNewReport = (newReport: SpectraReport, name: string) => {
    onAnalysisSuccess(newReport, name);
    setActiveSection('overview');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f4f5] flex flex-col font-sans selection:bg-[#c8a962]/30 selection:text-white">
      {/* Sleek Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#000000]/90 backdrop-blur-md border-b border-white/10 select-none">
        <div className="max-w-[1700px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Left: Brand & Sigil */}
            <div className="flex items-center gap-4 shrink-0">
              <button
                onClick={onReturnToLanding}
                className="flex items-center gap-3.5 group text-left cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-[#c8a962]/50 rounded-xl p-1.5 transition-colors"
                title="Return to Landing Page"
              >
                <div className="w-10 h-10 flex items-center justify-center shrink-0">
                  <Sigil size="sm" className="w-10 h-10" interactive={true} ariaLabel="SPECTRA Home" />
                </div>
                <div className="hidden sm:block">
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-lg sm:text-xl tracking-[0.2em] text-white font-semibold group-hover:text-[#c8a962] transition-colors">
                      SPECTRA
                    </h2>
                    <span className="w-2 h-2 rounded-full bg-[#c8a962] shadow-[0_0_10px_#c8a962]" />
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-mono">
                    Analysis Engine
                  </p>
                </div>
              </button>

              {/* Active Dataset Pill (Desktop) */}
              {fileName && (
                <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-white/10 text-xs font-mono text-zinc-300">
                  <FileText className="w-4 h-4 text-[#c8a962]" />
                  <span className="truncate max-w-[150px]" title={fileName}>
                    {fileName}
                  </span>
                </div>
              )}
            </div>

            {/* Center: Desktop Icon Navigation with Hover Tooltips */}
            <nav className="hidden md:flex items-center gap-2.5 py-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.key;
                return (
                  <div key={item.key} className="relative group">
                    <button
                      disabled={item.disabled}
                      onClick={() => handleSelectSection(item.key)}
                      aria-label={item.label}
                      className={`
                        relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 outline-none cursor-pointer
                        ${
                          isActive
                            ? 'bg-zinc-900 text-[#c8a962] border border-[#c8a962]/60 shadow-[0_0_20px_rgba(200,169,98,0.25)] scale-105'
                            : item.disabled
                            ? 'opacity-30 cursor-not-allowed text-zinc-600'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80 hover:border-white/10'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      {isActive && (
                        <span className="absolute -bottom-1 w-2.5 h-0.5 rounded-full bg-[#c8a962] shadow-[0_0_8px_#c8a962]" />
                      )}
                    </button>

                    {/* Floating Tooltip on Hover */}
                    {!item.disabled && (
                      <div className="absolute top-full mt-2.5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1 transition-all duration-200 pointer-events-none z-50 px-3 py-1.5 rounded-lg bg-zinc-950 border border-[#c8a962]/40 text-xs font-mono text-[#c8a962] whitespace-nowrap shadow-2xl">
                        {item.label}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Right: Mobile Menu Toggle Button */}
            <div className="flex items-center md:hidden shrink-0">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-zinc-300 hover:text-white outline-none cursor-pointer rounded-md hover:bg-zinc-900"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 text-[#c8a962]" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#000000]/95 backdrop-blur-lg px-4 py-3 space-y-1">
            {fileName && (
              <div className="pb-2 mb-2 border-b border-white/10 flex items-center gap-2 text-xs font-mono text-[#c8a962]">
                <FileText className="w-3.5 h-3.5" />
                <span className="truncate">{fileName}</span>
              </div>
            )}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.key;
              return (
                <button
                  key={item.key}
                  disabled={item.disabled}
                  onClick={() => handleSelectSection(item.key)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-mono transition-all text-left cursor-pointer
                    ${
                      isActive
                        ? 'bg-zinc-900 text-white font-semibold border-l-2 border-[#c8a962]'
                        : item.disabled
                        ? 'opacity-30 cursor-not-allowed text-zinc-600'
                        : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#c8a962]' : 'text-zinc-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-[#c8a962]" />}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Workspace Canvas */}
      <main className="flex-1 w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        {!report && activeSection !== 'upload' ? (
          <div className="max-w-md mx-auto py-24 text-center space-y-6 bg-zinc-950/80 border border-white/10 rounded-2xl p-8 shadow-2xl">
            <Sigil size="md" className="mx-auto" />
            <div className="space-y-2">
              <h2 className="font-display text-xl text-white font-normal">No Dataset Loaded</h2>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto font-light">
                Please upload a CSV or tabular dataset to initialize the SPECTRA analysis pipeline.
              </p>
            </div>
            <button
              onClick={() => setActiveSection('upload')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#c8a962] text-black text-xs uppercase tracking-widest font-mono font-semibold hover:bg-[#d4af37] shadow-[0_0_20px_rgba(200,169,98,0.3)] transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Dataset</span>
            </button>
          </div>
        ) : (
          <div className="transition-all duration-300">
            {activeSection === 'upload' && (
              <SectionUpload onAnalysisSuccess={handleNewReport} />
            )}
            {activeSection === 'overview' && report && (
              <SectionOverview report={report} fileName={fileName} />
            )}
            {activeSection === 'discoveries' && report && (
              <SectionDiscoveries report={report} />
            )}
            {activeSection === 'relationships' && report && (
              <SectionRelationships report={report} />
            )}
            {activeSection === 'structure' && report && (
              <SectionStructure report={report} />
            )}
            {activeSection === 'clusters' && report && (
              <SectionClusters report={report} />
            )}
            {activeSection === 'anomalies' && report && (
              <SectionAnomalies report={report} />
            )}
            {activeSection === 'predictive' && report && (
              <SectionPredictive report={report} />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

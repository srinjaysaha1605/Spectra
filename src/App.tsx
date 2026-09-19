import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { WorkspaceLayout } from './components/WorkspaceLayout';
import { SpectraReport } from './types/spectra';

export default function App() {
  const [view, setView] = useState<'landing' | 'workspace'>('landing');
  const [report, setReport] = useState<SpectraReport | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleEnterWorkspace = () => {
    setView('workspace');
  };

  const handleAnalysisSuccess = (newReport: SpectraReport, name: string) => {
    console.log('[SPECTRA LIVE REPORT] Received in App state:', {
      dataset: newReport.dataset,
      discoveries: newReport.discoveries,
      relationships: newReport.relationships,
      structure: newReport.structure,
      anomalies: newReport.anomalies,
      predictive_signal: newReport.predictive_signal,
    });
    setReport(newReport);
    setFileName(name);
  };

  const handleReturnToLanding = () => {
    setView('landing');
  };

  return (
    <div className="min-h-screen bg-[#080807] text-[#e8e3d5] font-sans antialiased selection:bg-[#c8a962]/30 selection:text-[#f5f2eb]">
      {view === 'landing' ? (
        <LandingPage onEnter={handleEnterWorkspace} />
      ) : (
        <WorkspaceLayout
          report={report}
          fileName={fileName}
          onAnalysisSuccess={handleAnalysisSuccess}
          onReturnToLanding={handleReturnToLanding}
        />
      )}
    </div>
  );
}

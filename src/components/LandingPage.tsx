import React from 'react';
import { Sigil } from './Sigil';

interface LandingPageProps {
  onEnter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen w-full bg-[#000000] flex flex-col items-center justify-center relative overflow-hidden select-none px-4">
      {/* Background Subtle Radial Glow */}
      <div className="absolute inset-0 bg-radial from-[#c8a962]/[0.05] via-transparent to-transparent pointer-events-none" />

      {/* Fine Geometric Background Grid & Celestial Lines */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
        <div className="w-[500px] h-[500px] rounded-full border border-white/10" />
        <div className="absolute w-[750px] h-[750px] rounded-full border border-dashed border-[#c8a962]/20" />
        <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Main Interactive Sigil Gateway */}
      <div className="z-10 flex flex-col items-center gap-10 my-auto text-center max-w-xl">
        <div className="relative group cursor-pointer" onClick={onEnter}>
          <Sigil
            size="xl"
            interactive={true}
            onClick={onEnter}
            ariaLabel="Click Sigil to Enter SPECTRA Engine"
          />
        </div>

        <div className="space-y-3">
          <h1 className="font-display text-4xl sm:text-5xl text-white tracking-[0.2em] font-light uppercase">
            SPECTRA
          </h1>

          <p className="font-display text-zinc-400 text-xs sm:text-sm tracking-[0.35em] uppercase font-normal text-center select-none pt-1">
            The unseen has a shape.
          </p>
        </div>
      </div>
    </div>
  );
};

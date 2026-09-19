import React from 'react';

interface SigilProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  onClick?: () => void;
  isLoading?: boolean;
  ariaLabel?: string;
  className?: string;
  dark?: boolean;
}

export const Sigil: React.FC<SigilProps> = ({
  size = 'lg',
  interactive = false,
  onClick,
  isLoading = false,
  ariaLabel = 'SPECTRA Sigil',
  className = '',
  dark = false,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-56 h-56 sm:w-72 sm:h-72',
    xl: 'w-72 h-72 sm:w-[26rem] sm:h-[26rem]',
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (interactive && onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role={interactive ? 'button' : 'img'}
      tabIndex={interactive ? 0 : -1}
      aria-label={ariaLabel}
      onClick={interactive ? onClick : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
      className={`
        relative flex items-center justify-center select-none outline-none shrink-0
        transition-all duration-300 ease-out
        ${sizeClasses[size]}
        ${
          interactive
            ? 'cursor-pointer group hover:scale-[1.04] focus-visible:scale-[1.04]'
            : ''
        }
        ${className}
      `}
    >
      {/* Smooth outer glow shadow on hover */}
      {interactive && (
        <div className="absolute inset-0 rounded-full bg-[#c8a962]/0 group-hover:bg-[#c8a962]/10 blur-xl transition-all duration-300 ease-out pointer-events-none" />
      )}

      {/* Loading aura */}
      {isLoading && (
        <div className={`absolute inset-[-10%] rounded-full border animate-ping opacity-40 pointer-events-none ${dark ? 'border-black/50' : 'border-[#c8a962]/40'}`} />
      )}

      <svg
        viewBox="0 0 500 500"
        className={`
          w-full h-full transition-all duration-300 ease-out transform-gpu
          ${dark ? 'text-black' : 'text-white'}
          ${
            interactive
              ? dark
                ? 'group-hover:text-black group-hover:drop-shadow-[0_0_12px_rgba(0,0,0,0.5)]'
                : 'group-hover:text-white group-hover:drop-shadow-[0_0_20px_rgba(200,169,98,0.55)]'
              : dark
              ? 'drop-shadow-[0_0_8px_rgba(0,0,0,0.3)]'
              : 'drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]'
          }
          ${isLoading ? 'animate-spin [animation-duration:4s]' : ''}
        `}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={`sigilBgGlow-${dark ? 'dark' : 'light'}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={dark ? "#000000" : "#ffffff"} stopOpacity={dark ? "0.12" : "0.06"} />
            <stop offset="70%" stopColor={dark ? "#000000" : "#c8a962"} stopOpacity={dark ? "0.05" : "0.02"} />
            <stop offset="100%" stopColor={dark ? "#000000" : "#000000"} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer ambient glow disc */}
        <circle cx="250" cy="250" r="220" fill={`url(#sigilBgGlow-${dark ? 'dark' : 'light'})`} />

        {/* Dynamic Rotating Outer Rings Group */}
        <g className="animate-spin [transform-origin:250px_250px] [animation-duration:35s] ease-linear">
          {/* Outer Hairline Geometric Circle */}
          <circle
            cx="250"
            cy="250"
            r="215"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="6 6"
            opacity={dark ? "0.6" : "0.3"}
          />

          {/* Solid Outer Precision Ring */}
          <circle
            cx="250"
            cy="250"
            r="195"
            stroke="currentColor"
            strokeWidth="2.5"
            opacity={dark ? "0.7" : "0.4"}
          />

          {/* Cardinal Diamonds */}
          <polygon points="250,32 254,42 250,52 246,42" fill={dark ? "#000000" : "#c8a962"} opacity="0.95" />
          <polygon points="250,448 254,458 250,468 246,458" fill={dark ? "#000000" : "#c8a962"} opacity="0.95" />
          <polygon points="32,250 42,254 52,250 42,246" fill={dark ? "#000000" : "#c8a962"} opacity="0.95" />
          <polygon points="448,250 458,254 468,250 458,246" fill={dark ? "#000000" : "#c8a962"} opacity="0.95" />
        </g>

        {/* Dynamic Counter-Rotating Middle Ring & Geometry Group */}
        <g className="animate-spin [transform-origin:250px_250px] [animation-duration:25s] [animation-direction:reverse] ease-linear">
          {/* Accent Ring */}
          <circle
            cx="250"
            cy="250"
            r="170"
            stroke={dark ? "#000000" : "#c8a962"}
            strokeWidth="2"
            strokeDasharray="12 4"
            opacity={dark ? "0.8" : "0.6"}
          />

          {/* Cardinal Geometric Axes */}
          <line x1="250" y1="25" x2="250" y2="475" stroke="currentColor" strokeWidth="1.5" opacity={dark ? "0.5" : "0.25"} />
          <line x1="25" y1="250" x2="475" y2="250" stroke="currentColor" strokeWidth="1.5" opacity={dark ? "0.5" : "0.25"} />
          <line x1="91" y1="91" x2="409" y2="409" stroke="currentColor" strokeWidth="1" opacity={dark ? "0.4" : "0.18"} />
          <line x1="409" y1="91" x2="91" y2="409" stroke="currentColor" strokeWidth="1" opacity={dark ? "0.4" : "0.18"} />

          {/* Corner Micro Geometric Accents */}
          <circle cx="250" cy="110" r="4" fill={dark ? "#000000" : "#c8a962"} opacity="0.9" />
          <circle cx="250" cy="390" r="4" fill={dark ? "#000000" : "#c8a962"} opacity="0.9" />
          <circle cx="140" cy="250" r="4" fill={dark ? "#000000" : "#c8a962"} opacity="0.9" />
          <circle cx="360" cy="250" r="4" fill={dark ? "#000000" : "#c8a962"} opacity="0.9" />
        </g>

        {/* Interlocking Geometric Triangles */}
        <polygon
          points="250,80 390,320 110,320"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          opacity={dark ? "0.85" : "0.75"}
        />
        <polygon
          points="250,420 110,180 390,180"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          opacity={dark ? "0.85" : "0.75"}
        />

        {/* Inner Geometric Concentric Octagon */}
        <polygon
          points="250,130 335,165 370,250 335,335 250,370 165,335 130,250 165,165"
          stroke={dark ? "#000000" : "#c8a962"}
          strokeWidth="2"
          fill="none"
          opacity={dark ? "0.7" : "0.5"}
        />

        {/* Geometric Eye / Diamond Core */}
        <polygon
          points="250,165 340,250 250,335 160,250"
          stroke="currentColor"
          strokeWidth="3"
          fill={dark ? "#c8a962" : "#000000"}
          fillOpacity="0.9"
        />

        {/* Inner Diamond framing pupil */}
        <polygon
          points="250,195 305,250 250,305 195,250"
          stroke={dark ? "#000000" : "#c8a962"}
          strokeWidth="2.5"
          fill="none"
          opacity="0.95"
        />

        {/* Center Iris Circle */}
        <circle cx="250" cy="250" r="32" stroke="currentColor" strokeWidth="3" fill={dark ? "#000000" : "#000000"} />
        <circle cx="250" cy="250" r="22" stroke={dark ? "#c8a962" : "#c8a962"} strokeWidth="2" strokeDasharray="3 3" opacity="0.9" />

        {/* Central Pupil */}
        <circle cx="250" cy="250" r="10" fill={dark ? "#c8a962" : "#c8a962"} />
        <circle cx="247" cy="247" r="3" fill="#ffffff" />
      </svg>
    </div>
  );
};

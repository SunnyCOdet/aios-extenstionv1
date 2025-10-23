import { useState } from 'react';
import '@src/Options.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { ModelSettings } from './components/ModelSettings';
import Particles from './components/Particles';

const Options = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <div className="relative min-h-screen bg-transparent text-white overflow-x-hidden">
      <Particles
        particleColors={['#ffffff', '#ffffff']}
        particleCount={200}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={100}
        moveParticlesOnHover={true}
        alphaParticles={false}
        disableRotation={false}
      />
      {/* Minimal Header */}
      <header className="border-b border-white/5 bg-transparent">
        <div className="mx-auto max-w-6xl px-8 py-5">
          <div className="flex items-center gap-4">
            <svg
              className="w-10 h-10 transition-transform hover:rotate-180 duration-700"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="optionsIconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#00d4ff', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <circle cx="16" cy="16" r="14" fill="url(#optionsIconGradient)" opacity="0.1" />
              <circle cx="16" cy="16" r="10" stroke="url(#optionsIconGradient)" strokeWidth="2.5" fill="none" />
              <path
                d="M16 10 L16 22 M10 16 L22 16"
                stroke="url(#optionsIconGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="16" cy="16" r="2.5" fill="url(#optionsIconGradient)" />
            </svg>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Settings</h1>
              <p className="text-xs text-slate-500 mt-0.5">Model Configuration</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-8 py-10">
        <div className="opacity-0 animate-fade-in-up">
          <ModelSettings isDarkMode={isDarkMode} />
        </div>
      </main>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Options, <div>Loading...</div>), <div>Error Occurred</div>);

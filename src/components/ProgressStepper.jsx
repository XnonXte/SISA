import React from 'react';

export default function ProgressStepper({ current = 1 }) {
  const steps = [1, 2, 3];

  return (
    <div className="w-full flex justify-center mb-6">
      {/* Container utama menggunakan flex items-center untuk meratakan lingkaran dan garis secara horizontal */}
      <div className="flex items-center justify-between w-full max-w-[360px] px-4">
        {steps.map((step, index) => {
          const done = step < current;
          const active = step === current;

          return (
            <React.Fragment key={step}>
              {/* Lingkaran Progress */}
              <div className="flex flex-col items-center shrink-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 ${
                    done
                      ? 'bg-green-600 border-2 border-green-600 text-white'
                      : active
                      ? 'bg-white border-2 border-green-600 text-green-600 font-bold'
                      : 'bg-white border border-line text-placeholder'
                  }`}
                >
                  {done ? (
                    <i className="bi bi-check-lg text-lg" />
                  ) : (
                    <span className="font-semibold">{step}</span>
                  )}
                </div>
              </div>

              {/* Garis Penghubung (Hanya dirender di antara lingkaran) */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-3 relative bg-line rounded-full overflow-hidden">
                  {/* Progress Garis Hijau */}
                  <div
                    className={`absolute inset-y-0 left-0 bg-green-600 transition-all duration-500 rounded-full ${
                      current > step ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
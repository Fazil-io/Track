import React from 'react';
import { Trophy, Sparkles, CheckCircle2 } from 'lucide-react';

interface CelebrationBannerProps {
  stats: {
    total: number;
    completed: number;
    pending: number;
    percentage: number;
  };
  isCompletedDay: boolean;
}

export const CelebrationBanner: React.FC<CelebrationBannerProps> = ({ stats, isCompletedDay }) => {
  if (stats.total === 0) return null;
  if (stats.percentage !== 100) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 p-5 text-white shadow-lg shadow-emerald-500/20 animate-slide-up">
      {/* Background sparkle accents */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
      <div className="absolute -left-6 -top-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
            <Trophy className="w-6 h-6 text-yellow-300 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base sm:text-lg font-bold tracking-tight">
                Outstanding! All {stats.total} Tasks Completed!
              </h4>
              <Sparkles className="w-4 h-4 text-yellow-200" />
            </div>
            <p className="text-xs sm:text-sm text-emerald-50/90 mt-0.5">
              You maintained 100% discipline today. Don't forget to click <strong className="underline decoration-white/50">"Complete My Day"</strong> to seal your victory!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/25 text-xs font-bold shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>100% Perfect Score</span>
        </div>
      </div>
    </div>
  );
};


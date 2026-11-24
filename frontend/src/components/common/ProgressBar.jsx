import React from 'react';

export const ProgressBar = ({ percentage, height = 'h-2.5', showText = false, customColor = null }) => {
  const clamped = Math.min(Math.max(percentage, 0), 100);

  let barColor = 'bg-emerald-500';
  if (customColor) {
    barColor = customColor;
  } else if (percentage >= 100) {
    barColor = 'bg-rose-500';
  } else if (percentage >= 80) {
    barColor = 'bg-amber-500';
  } else if (percentage >= 60) {
    barColor = 'bg-yellow-500';
  }

  return (
    <div className="w-full">
      {showText && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-500 mb-1">
          <span>{percentage}% used</span>
          {percentage > 100 && (
            <span className="text-rose-600 font-bold">Over by {percentage - 100}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${height}`}>
        <div
          className={`${barColor} ${height} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

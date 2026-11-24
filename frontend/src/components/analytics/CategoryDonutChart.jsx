import React, { useState } from 'react';
import { formatCurrency } from '../../utils/formatters';

export const CategoryDonutChart = ({ categoryBreakdown = [], totalExpenses = 0 }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  if (categoryBreakdown.length === 0 || totalExpenses === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <p className="text-xs">No expense data available for this month.</p>
      </div>
    );
  }

  // Calculate SVG arc paths for donut
  const size = 220;
  const strokeWidth = 32;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativeOffset = 0;

  const activeItem = hoveredCategory || categoryBreakdown[0];

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      {/* Donut SVG */}
      <div className="relative w-[220px] h-[220px] shrink-0">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />
          {categoryBreakdown.map((item) => {
            const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -cumulativeOffset;
            cumulativeOffset += (item.percentage / 100) * circumference;

            const isHovered = hoveredCategory?.category === item.category;

            return (
              <circle
                key={item.category}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer hover:opacity-90"
                onMouseEnter={() => setHoveredCategory(item)}
                onMouseLeave={() => setHoveredCategory(null)}
              />
            );
          })}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            {activeItem ? activeItem.category : 'Total'}
          </span>
          <span className="text-base font-extrabold text-slate-900 leading-tight">
            {activeItem ? formatCurrency(activeItem.amount) : formatCurrency(totalExpenses)}
          </span>
          <span className="text-[11px] font-semibold text-slate-500">
            {activeItem ? `${activeItem.percentage}%` : '100%'}
          </span>
        </div>
      </div>

      {/* Legend list */}
      <div className="flex-1 w-full space-y-2">
        {categoryBreakdown.slice(0, 6).map((item) => (
          <div
            key={item.category}
            onMouseEnter={() => setHoveredCategory(item)}
            onMouseLeave={() => setHoveredCategory(null)}
            className={`flex items-center justify-between p-1.5 rounded-lg text-xs cursor-pointer transition ${
              hoveredCategory?.category === item.category ? 'bg-slate-100' : 'hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-medium text-slate-700 truncate max-w-[140px]">
                {item.category}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-900">{formatCurrency(item.amount)}</span>
              <span className="text-[11px] text-slate-400 w-8 text-right font-semibold">
                {item.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

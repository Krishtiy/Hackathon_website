import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-[#001012]/80 border border-[#00ff7f22] p-6 rounded-xl animate-pulse space-y-4">
    <div className="h-6 bg-[#00ff7f22] rounded w-1/3"></div>
    <div className="h-4 bg-gray-800 rounded w-full"></div>
    <div className="h-4 bg-gray-800 rounded w-4/5"></div>
    <div className="h-10 bg-[#00ff7f11] rounded mt-4"></div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-3 animate-pulse">
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="h-12 bg-gray-800/60 rounded-lg border border-gray-700/30"></div>
    ))}
  </div>
);

import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

export const VirtualLeaderboard = ({ teams = [] }) => {
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: teams.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 52,
    overscan: 5,
  });

  if (!teams.length) {
    return (
      <div className="p-8 text-center text-gray-400 border border-gray-800 rounded-xl bg-[#001012]/90">
        No leaderboard rankings recorded yet.
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="h-[500px] overflow-auto rounded-xl border border-[#00ff7f33] bg-[#001012]/90 p-4"
    >
      <div
        className="w-full relative"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const team = teams[virtualRow.index];
          return (
            <div
              key={virtualRow.key}
              className="absolute top-0 left-0 w-full flex items-center justify-between px-4 py-2 border-b border-gray-800 hover:bg-[#00ff7f11] transition-colors"
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div className="flex items-center space-x-3">
                <span className="font-mono text-sm text-[#00ffae] font-bold">#{virtualRow.index + 1}</span>
                <span className="text-white font-medium">{team.name || team.teamId}</span>
              </div>
              <div className="font-mono text-[#00e5ff] font-semibold">
                {team.points ?? 0} pts
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VirtualLeaderboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import { Award } from '../../components/icons';

const Round1ResultsView = () => {
  const { user, showModal } = useAppContext();
  const [rankedTeams, setRankedTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Results
  useEffect(() => {
    if (user) {
      const fetchResults = async () => {
        try {
          setLoading(true);
          const { data } = await axios.get('https://hackathon-backend1-akuo.onrender.com/api/teams/results/1');
          setRankedTeams(data);
        } catch (error) {
          showModal(error.response?.data?.message || 'Failed to fetch results');
        } finally {
          setLoading(false);
        }
      };
      fetchResults();
    }
  }, [user, showModal]);

  const qualifyingCount = Math.ceil(rankedTeams.length * 0.3);

  if (!user) return <p className="text-center text-[#00e5ff]">Loading…</p>;
  if (loading) return <p className="text-center text-[#00e5ff] animate-pulse">Loading results…</p>;

  return (
    <div className="animate-fadeIn space-y-8">

      {/* Title */}
      <h2 className="
        text-4xl font-extrabold 
        bg-gradient-to-r from-[#00ff7f] to-[#00e5ff]
        bg-clip-text text-transparent
        drop-shadow-[0_0_25px_rgba(0,255,127,0.5)]
      ">
        Round 1 – Leaderboard
      </h2>

      {/* Info Card */}
      <div className="
        p-6 rounded-xl
        bg-[#001012]/80 backdrop-blur-md
        border border-[#00ff7f44]
        shadow-[0_0_20px_rgba(0,255,127,0.25)]
      ">
        <p className="text-gray-300">
          Showing <span className="font-bold text-[#00ff7f]">{rankedTeams.length}</span> verified teams.
        </p>
        <p className="text-[#00ffae] font-semibold mt-1">
          Top {qualifyingCount} teams (Top 30%) advance to Round 2.
        </p>

        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#00ff7f] to-transparent mt-4 opacity-80"></div>
      </div>

      {/* Leaderboard Table */}
      <div className="
        overflow-x-auto rounded-xl
        border border-[#00e5ff33]
        shadow-[0_0_20px_rgba(0,229,255,0.2)]
      ">
        <table className="min-w-full divide-y divide-[#00e5ff33] bg-[#0a0f14]">
          <thead className="bg-[#001b26]">
            <tr>
              {['Rank', 'Team', 'Score (Avg)', 'Time (Avg)', 'Status'].map((h) => (
                <th
                  key={h}
                  className="
                    px-4 py-3 text-left text-xs font-bold tracking-wider
                    text-[#00e5ff] uppercase
                  ">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#00e5ff22]">
            {rankedTeams.map((team, index) => {
              const advanced = index < qualifyingCount;

              return (
                <tr
                  key={team._id}
                  className={`
                    transition-all
                    ${advanced
                      ? 'bg-[#003d29]/60 hover:bg-[#004d36]/70 shadow-[0_0_12px_rgba(0,255,127,0.25)]'
                      : 'hover:bg-[#0f1b25]'
                    }
                  `}
                >

                  {/* Rank */}
                  <td className="px-4 py-3 text-sm font-bold text-white flex items-center gap-2">
                    <span
                      className={`
                        px-3 py-1 rounded-md text-xs
                        ${advanced
                          ? 'bg-[#00ff7f33] text-[#00ffae] border border-[#00ff7f55]'
                          : 'bg-[#1a1f24] text-gray-400 border border-gray-600'
                        }
                      `}
                    >
                      #{index + 1}
                    </span>
                  </td>

                  {/* Team Name */}
                  <td className="px-4 py-3 text-white text-sm">
                    {team.name}
                  </td>

                  {/* Score */}
                  <td className="px-4 py-3 text-[#00e5ff] text-sm font-semibold">
                    {team.round1FinalScore.toFixed(2)}
                  </td>

                  {/* Time */}
                  <td className="px-4 py-3 text-gray-300 text-sm">
                    {team.round1AvgSubmissionTime.toFixed(0)} sec
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    {advanced ? (
                      <span className="flex items-center text-[#00ff7f] font-semibold">
                        <Award className="h-4 w-4 mr-1 text-[#00ffae]" />
                        Advanced
                      </span>
                    ) : (
                      <span className="text-gray-500">Eliminated</span>
                    )}
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Round1ResultsView;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import Card from '../../components/Card';
import Button from '../../components/Button';

const ResultsView = () => {

  const { user, showModal } = useAppContext();
  const [rankedTeams, setRankedTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hackathonState, setHackathonState] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchResultsData = async () => {
        try {
          setLoading(true);
          const stateRes = await axios.get('https://hackathon-backend1-akuo.onrender.com/api/state');
          setHackathonState(stateRes.data);

          if (stateRes.data.round1Status === 'Completed') {
            const resultsRes = await axios.get('https://hackathon-backend1-akuo.onrender.com/api/teams/results/1');
            setRankedTeams(resultsRes.data);
          }
        } catch (error) {
          showModal(error.response?.data?.message || 'Failed to fetch results');
        } finally {
          setLoading(false);
        }
      };
      fetchResultsData();
    }
  }, [user, showModal]);

  const handleDownload = async (path) => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      const response = await axios.get(
        `https://hackathon-backend1-akuo.onrender.com
/api/download?filepath=${path.replace(/\\/g, '/')}`,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');

      const filename = path.split('\\').pop().split('/').pop();
      link.href = url;
      link.setAttribute('download', filename);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      showModal('Failed to download file.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!user) {
    return <p className="text-[#9AE6C7] text-center">Loading user...</p>;
  }

  if (loading) {
    return <p className="text-[#9AE6C7] text-center animate-pulse">Loading results...</p>;
  }

  if (!hackathonState || hackathonState.round1Status !== 'Completed') {
    return (
      <div>
        <h2 className="text-4xl font-extrabold mb-6
                       bg-gradient-to-r from-[#00ff7f] to-[#00e5ff] 
                       bg-clip-text text-transparent
                       drop-shadow-[0_0_18px_rgba(0,255,127,0.45)]">
          Results & Certificates
        </h2>

        <p className="text-[#9AE6C7] text-center">
          Round 1 results are not yet available. Please check back soon.
        </p>
      </div>
    );
  }

  let myTeamRank = -1;
  let myTeamData = null;

  rankedTeams.forEach((team, index) => {
    if (team._id === user.teamId) {
      myTeamRank = index + 1;
      myTeamData = team;
    }
  });

  const qualifyingCount = Math.ceil(rankedTeams.length * 0.30);
  const didAdvance = myTeamRank > 0 && myTeamRank <= qualifyingCount;

  return (
    <div className="relative">

      {/* Hologram Grid */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(0,255,127,0.15) 1px, transparent 1px), linear-gradient(0deg, rgba(0,255,127,0.15) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Scanlines */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(0deg, rgba(0,255,127,0.15) 2px, transparent 2px)",
          backgroundSize: "100% 4px",
        }}
      />

      <div className="relative z-10">

        <h2 className="text-4xl font-extrabold mb-8
                       bg-gradient-to-r from-[#00ff7f] to-[#00e5ff]
                       bg-clip-text text-transparent
                       drop-shadow-[0_0_25px_rgba(0,255,127,0.45)]">
          Round 1 Results
        </h2>

        {myTeamData ? (
          <Card className="p-8 text-center mb-10
                           bg-[#001012]/80 backdrop-blur-md
                           border border-[#00ff7f33]
                           shadow-[0_0_25px_rgba(0,255,127,0.2)]">

            <div className="text-6xl mb-4">
              {didAdvance ? '🚀' : '👍'}
            </div>

            <h3 className={`text-3xl font-bold mt-4 
                            ${didAdvance 
                            ? 'text-[#00ff7f] drop-shadow-[0_0_10px_rgba(0,255,127,0.5)]' 
                            : 'text-yellow-300 drop-shadow-[0_0_10px_rgba(255,255,0,0.4)]'}`}>
              {didAdvance ? "You're Going to Round 2!" : "Thank You for Participating!"}
            </h3>

            <p className="text-[#9AE6C7] mt-3">
              {didAdvance
                ? "Your team placed in the Top 30% and has advanced!"
                : "Your team did not advance — but great effort!"}
            </p>

            <div className="grid grid-cols-2 gap-6 mt-10 text-left">
              <div className="p-4 rounded-lg bg-[#041f1a]/50 border border-[#00ff7f33]">
                <p className="text-sm text-[#77a69a]">Team Rank</p>
                <p className="text-2xl font-bold text-[#bfffe7]">
                  {myTeamRank} / {rankedTeams.length}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#041f1a]/50 border border-[#00ff7f33]">
                <p className="text-sm text-[#77a69a]">Average Score</p>
                <p className="text-2xl font-bold text-[#bfffe7]">
                  {myTeamData.round1FinalScore.toFixed(2)}
                </p>
              </div>
            </div>

          </Card>
        ) : (
          <Card className="p-8 text-center bg-[#001012]/80 border border-[#00ff7f33]">
            <p className="text-yellow-300">
              No participation or missing score for Round 1.
            </p>
          </Card>
        )}

        {/* CERTIFICATES */}
        <Card className="p-6 bg-[#001012]/80 backdrop-blur-md border border-[#00ff7f33]">

          <h3 className="text-2xl font-bold mb-6 text-[#00e5ff]">
            Certificates
          </h3>

          {/* Participation Certificate */}
          {hackathonState.round1CertificatePath ? (
            <div className="mb-6">
              <p className="text-[#9AE6C7] mb-2">Your Round 1 Participation Certificate:</p>

              <Button
                onClick={() => handleDownload(hackathonState.round1CertificatePath)}
                disabled={isDownloading}
                className="w-full"
              >
                {isDownloading ? "Downloading..." : "Download Participation Certificate"}
              </Button>
            </div>
          ) : (
            <p className="text-[#77a69a] text-sm">Certificates not available yet.</p>
          )}

          {/* Round 2 Certificate */}
          {didAdvance && hackathonState.round2CertificatePath && (
            <div className="mt-6 pt-6 border-t border-[#00ff7f22]">
              <p className="text-[#00ff7f] mb-2">Round 2 Advancement Certificate:</p>

              <Button
                onClick={() => handleDownload(hackathonState.round2CertificatePath)}
                disabled={isDownloading}
                className="w-full"
              >
                {isDownloading ? "Downloading..." : "Download Advancement Certificate"}
              </Button>
            </div>
          )}
        </Card>

      </div>
    </div>
  );
};

export default ResultsView;

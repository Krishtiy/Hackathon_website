import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import Button from '../../components/Button';

const TeamPaymentsView = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showModal, user } = useAppContext();

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('https://hackathon-backend1-akuo.onrender.com/api/teams');
      setTeams(data);
    } catch (error) {
      showModal(error.response?.data?.message || 'Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchTeams();
  }, [user, showModal]);

  const handleVerify = async (teamId) => {
    try {
      await axios.post(`https://hackathon-backend1-akuo.onrender.com
/api/teams/${teamId}/verify-payment`);
      showModal('Payment verified!', 'success');
      setTeams(prev =>
        prev.map(team =>
          team._id === teamId ? { ...team, paymentStatus: 'completed' } : team
        )
      );
    } catch (error) {
      showModal(error.response?.data?.message || 'Failed to verify payment');
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm('DANGER: Delete team and ALL member accounts? This cannot be undone.'))
      return;

    try {
      await axios.delete(`https://hackathon-backend1-akuo.onrender.com
/api/teams/${teamId}`);
      showModal('Team deleted successfully', 'success');
      setTeams(prev => prev.filter(team => team._id !== teamId));
    } catch (error) {
      showModal(error.response?.data?.message || 'Failed to delete team');
    }
  };

  if (!user) return <p className="text-gray-300 text-center">Loading...</p>;
  if (loading) return <p className="text-gray-300 text-center">Loading teams...</p>;

  return (
    <div className="relative">

      {/* HACKER GRID BACKGROUND */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(0,255,180,0.25),transparent_60%)] pointer-events-none"></div>
      <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(90deg,#00ffcc33_1px,transparent_1px),linear-gradient(#00ffcc33_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      <h2 className="text-3xl font-extrabold text-[#00F5FF] tracking-wider mb-6 neon-glow">
        TEAM PAYMENT CONTROL PANEL
      </h2>

      {/* TABLE */}
      <div className="overflow-x-auto shadow-[0_0_25px_#00e1ff60] rounded-lg border border-[#00ffc873] bg-[#0a0f12]/80 backdrop-blur-xl">

        <table className="min-w-full divide-y divide-[#00ffc844]">
          <thead className="bg-[#001f1f]/70">
            <tr>
              {['Team Name', 'Members', 'Payment', 'Proof', 'Actions'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-bold text-[#00ffe1] uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#00ffc822] bg-[#0b1417]">
            {teams.map(team => (
              <tr
                key={team._id}
                className="hover:bg-[#012b2b] transition-all duration-300 hover:shadow-[0_0_15px_#00eaff55]"
              >
                <td className="px-4 py-3 text-sm font-semibold text-white">
                  {team.name}
                </td>

                <td className="px-4 py-3 text-sm text-[#87f5ff]">
                  {team.members.length} / 3
                </td>

                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full border ${
                      team.paymentStatus === 'completed'
                        ? 'bg-[#003322] border-[#00ff99] text-[#00ffbb] shadow-[0_0_10px_#00ff8866]'
                        : 'bg-[#332b00] border-[#ffcc00] text-[#ffea70] shadow-[0_0_10px_#ffcc0088]'
                    }`}
                  >
                    {team.paymentStatus.toUpperCase()}
                  </span>
                </td>

                <td className="px-4 py-3 text-sm text-[#00eaff]">
                  {team.paymentProof ? (
                    <a
                      href={`https://hackathon-backend1-akuo.onrender.com
/${team.paymentProof.replace(/\\/g, '/')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-[#72faff] transition"
                    >
                      {team.transactionId || 'View Proof'}
                    </a>
                  ) : (
                    <span className="text-gray-500">No Proof</span>
                  )}
                </td>

                <td className="px-4 py-3 text-sm space-x-3">

                  {team.paymentStatus === 'pending' && team.paymentProof && (
                    <Button
                      variant="primary"
                      className="py-1 px-3 text-xs neon-button"
                      onClick={() => handleVerify(team._id)}
                    >
                      VERIFY
                    </Button>
                  )}

                  <Button
                    variant="secondary"
                    className="py-1 px-3 text-xs bg-red-900/70 hover:bg-red-700 neon-red"
                    onClick={() => handleDeleteTeam(team._id)}
                  >
                    DELETE
                  </Button>

                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamPaymentsView;

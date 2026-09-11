import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import Button from '../../components/Button';

const SubmissionsView = () => {
  // HOOKS
  const { user, showModal } = useAppContext();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH SUBMISSIONS
  useEffect(() => {
    if (user) {
      const fetchSubmissions = async () => {
        try {
          setLoading(true);
          const { data } = await axios.get('https://hackathon-backend1-akuo.onrender.com/api/submissions/round/2');
          setSubmissions(data);
        } catch (error) {
          showModal(error.response?.data?.message || 'Failed to fetch submissions');
        } finally {
          setLoading(false);
        }
      };
      fetchSubmissions();
    }
  }, [user, showModal]);

  const handleAdvance = async (teamId) => {
    if (!window.confirm("Advance this team to Finale?")) return;

    try {
      await axios.post(`https://hackathon-backend1-akuo.onrender.com
/api/teams/${teamId}/advance`);
      showModal('Team advanced to finale!', 'success');

      setSubmissions(prev =>
        prev.map(sub =>
          sub.team._id === teamId
            ? { ...sub, team: { ...sub.team, isFinalist: true } }
            : sub
        )
      );

    } catch (error) {
      showModal(error.response?.data?.message || 'Failed to advance team');
    }
  };

  // LOADING
  if (!user)
    return <p className="text-center text-[#00eaff]">Loading...</p>;

  if (loading)
    return <p className="text-center text-[#00eaff] animate-pulse">Loading submissions...</p>;

  return (
    <div className="animate-fadeIn">

      {/* TITLE */}
      <h2 className="
        text-3xl font-bold mb-6
        bg-gradient-to-r from-[#00eaff] to-[#00ff7f]
        bg-clip-text text-transparent
        drop-shadow-[0_0_25px_rgba(0,255,255,0.3)]
      ">
        Round 2 – Submissions Console
      </h2>

      {/* TABLE WRAPPER WITH GLOW BORDER */}
      <div className="
        overflow-x-auto rounded-xl relative
        border border-[#00eaff55]
        shadow-[0_0_20px_rgba(0,229,255,0.3)]
      ">

        {/* Hologram Grid */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(0,229,255,0.25) 1px, transparent 1px), linear-gradient(0deg, rgba(0,229,255,0.25) 1px, transparent 1px)",
            backgroundSize: "45px 45px",
          }}
        />

        <table className="min-w-full relative z-10 divide-y divide-[#0d2a36]">
          <thead className="bg-[#0d2a36]">
            <tr>
              {["Team Name", "Submitted By", "Time", "File", "Notes", "Action"].map((h) => (
                <th
                  key={h}
                  className="
                    px-4 py-2 text-left text-xs font-bold uppercase tracking-wider
                    text-[#00eaff] drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]
                  "
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-[#07171f] divide-y divide-[#0f2c3b]">
            {submissions.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-4 text-center text-gray-400">
                  No Round 2 submissions yet.
                </td>
              </tr>
            ) : (
              submissions.map((sub) => (
                <tr
                  key={sub._id}
                  className="
                    transition-all hover:bg-[#0e2633]/80
                    hover:shadow-[inset_0_0_25px_rgba(0,229,255,0.2)]
                  "
                >
                  {/* TEAM NAME */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-white">
                    {sub.team.name}
                  </td>

                  {/* USER */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {sub.user.name}
                  </td>

                  {/* TIME */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {new Date(sub.createdAt).toLocaleString()}
                  </td>

                  {/* DOWNLOAD */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <a
                      href={`https://hackathon-backend1-akuo.onrender.com
/${sub.projectZipFile.replace(/\\/g, '/')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        text-[#00eaff] underline font-medium
                        hover:text-[#7dfbff] transition
                        drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]
                      "
                    >
                      Download ZIP
                    </a>
                  </td>

                  {/* NOTES */}
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {sub.submissionNotes || "N/A"}
                  </td>

                  {/* ACTION */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {sub.team.isFinalist ? (
                      <Button
                        variant="secondary"
                        className="py-1 px-3 text-xs opacity-60 cursor-not-allowed"
                        disabled
                      >
                        Finalist
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        className="py-1 px-3 text-xs"
                        onClick={() => handleAdvance(sub.team._id)}
                      >
                        Advance
                      </Button>
                    )}
                  </td>

                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default SubmissionsView;

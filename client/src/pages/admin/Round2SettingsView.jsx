import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import Button from '../../components/Button';
import Card from '../../components/Card';

const Round2SettingsView = () => {
  // HOOKS
  const { user, showModal } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [roundState, setRoundState] = useState(null);
  const [problem, setProblem] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  // FETCH DATA
  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const stateRes = await axios.get('https://hackathon-backend1-akuo.onrender.com/api/state');
      setRoundState(stateRes.data);

      try {
        const pRes = await axios.get('https://hackathon-backend1-akuo.onrender.com/api/questions?round=2');
        if (pRes.data.length > 0) {
          const p = pRes.data[0];
          setProblem(p);
          setTitle(p.title);
          setDescription(p.description);
          setDeadline(p.deadline ? new Date(p.deadline).toISOString().split("T")[0] : "");
        }
      } catch {
        setProblem(null);
      }
    } catch (error) {
      showModal(error.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // CONTROL ROUND
  const handleSetRoundStatus = async (status) => {
    if (!window.confirm(`Set Round 2 to "${status}" ?`)) return;

    try {
      const { data } = await axios.post("https://hackathon-backend1-akuo.onrender.com/api/state/round2", { status });
      setRoundState(data);
      showModal(`Round 2 is now ${status}`, "success");
    } catch (error) {
      showModal(error.response?.data?.message || "Failed to update round state");
    }
  };

  // SAVE PROBLEM
  const handleSaveProblem = async (e) => {
    e.preventDefault();

    if (!title || !description) return showModal("Please fill all required fields.");

    const payload = {
      round: 2,
      title,
      description,
      deadline: deadline || null,
    };

    try {
      if (problem) {
        await axios.put(`https://hackathon-backend1-akuo.onrender.com/api/questions/${problem._id}`, payload);
        showModal("Problem Updated Successfully!", "success");
      } else {
        await axios.post("https://hackathon-backend1-akuo.onrender.com/api/questions", payload);
        showModal("Problem Created Successfully!", "success");
      }

      fetchData();
    } catch (error) {
      showModal(error.response?.data?.message || "Failed to save problem");
    }
  };

  // LOADING STATE
  if (!user)
    return <p className="text-center text-[#00eaff]">Loading...</p>;

  if (loading)
    return (
      <div>
        <h2 className="text-4xl font-bold text-white">Round 2 Settings</h2>
        <p className="text-center text-[#00eaff] animate-pulse mt-4">Loading state…</p>
      </div>
    );

  return (
    <div className="animate-fadeIn space-y-10">

      {/* HEADER */}
      <h2 className="
        text-4xl font-extrabold 
        bg-gradient-to-r from-[#00ff7f] to-[#00eaff]
        bg-clip-text text-transparent
        drop-shadow-[0_0_25px_rgba(0,255,127,0.5)]
      ">
        Round 2 – Settings Console
      </h2>

      {/* ROUND CONTROL */}
      <Card className="relative p-6 bg-[#061218]/80 border border-[#00ff7f44] shadow-[0_0_25px_rgba(0,255,127,0.3)] rounded-xl">

        {/* Futuristic Hologram Grid */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(0,255,127,0.2) 1px, transparent 1px), linear-gradient(0deg, rgba(0,255,127,0.2) 1px, transparent 1px)",
            backgroundSize: "55px 55px",
          }}
        />

        <div className="relative z-10">
          <h3 className="text-xl font-semibold text-white mb-4">Round 2 Control Panel</h3>

          {roundState && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300">Current Status:</p>
                <span
                  className={`
                    text-lg font-bold 
                    ${roundState.round2Status === "Active" ? "text-[#00ff9d]" : "text-[#ffea00]"}
                  `}
                >
                  {roundState.round2Status}
                </span>
              </div>

              <div className="flex gap-4">
                {roundState.round2Status === "Pending" && (
                  <Button onClick={() => handleSetRoundStatus("Active")} disabled={!problem}>
                    Start Round 2
                  </Button>
                )}
                {roundState.round2Status === "Active" && (
                  <Button
                    variant="secondary"
                    className="!bg-red-800 hover:!bg-red-700"
                    onClick={() => handleSetRoundStatus("Completed")}
                  >
                    End Round 2
                  </Button>
                )}
                {roundState.round2Status === "Completed" && (
                  <Button
                    variant="secondary"
                    className="!bg-gray-700"
                    onClick={() => handleSetRoundStatus("Pending")}
                  >
                    Reset to Pending
                  </Button>
                )}
              </div>
            </div>
          )}

          {!problem && (
            <p className="text-[#ffea00] mt-2 text-sm">
              ⚠ You must create a problem statement before starting the round.
            </p>
          )}
        </div>
      </Card>

      {/* PROBLEM FORM */}
      <Card className="relative p-6 bg-[#061218]/80 border border-[#00eaff33] shadow-[0_0_25px_rgba(0,229,255,0.3)] rounded-xl">

        {/* Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(0,229,255,0.2) 1px, transparent 1px), linear-gradient(0deg, rgba(0,229,255,0.2) 1px, transparent 1px)",
            backgroundSize: "55px 55px",
          }}
        />

        <div className="relative z-10">
          <h3 className="text-xl font-semibold text-white mb-4">
            {problem ? "Update AI/ML Problem" : "Create AI/ML Problem"}
          </h3>

          <form onSubmit={handleSaveProblem} className="space-y-5">

            {/* TITLE */}
            <div>
              <label className="block text-sm font-medium text-[#00eaff]">
                Problem Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full px-3 py-2 bg-[#0b1a22] border border-[#00eaff55] text-white rounded-md"
                required
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-medium text-[#00eaff]">
                Problem Description
              </label>
              <textarea
                rows="6"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full px-3 py-2 bg-[#0b1a22] border border-[#00eaff55] text-white rounded-md"
                required
              />
            </div>

            {/* DEADLINE */}
            <div>
              <label className="block text-sm font-medium text-[#00eaff]">
                Submission Deadline (Optional)
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="mt-1 w-full px-3 py-2 bg-[#0b1a22] border border-[#00eaff55] text-white rounded-md"
              />
            </div>

            {/* SAVE BUTTON */}
            <Button type="submit" className="text-lg px-6 py-2">
              {problem ? "Update Problem" : "Create Problem"}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Round2SettingsView;

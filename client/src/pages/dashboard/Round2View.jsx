import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import Button from '../../components/Button';
import Card from '../../components/Card';

const Round2View = () => {
  const { user, showModal } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [hackathonState, setHackathonState] = useState(null);
  const [team, setTeam] = useState(null);
  const [problem, setProblem] = useState(null);
  const [mySubmission, setMySubmission] = useState(null);
  const [didAdvance, setDidAdvance] = useState(false);

  const [file, setFile] = useState(null);
  const [submissionNotes, setSubmissionNotes] = useState('');

  /* ─────────────────────────────────────────────────────────────
     FETCH DATA
  ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          setLoading(true);

          const stateRes = await axios.get('https://hackathon-backend1-akuo.onrender.com/api/state');
          setHackathonState(stateRes.data);

          const teamRes = await axios.get('https://hackathon-backend1-akuo.onrender.com/api/teams/myteam');
          setTeam(teamRes.data);

          if (stateRes.data.round1Status === 'Completed') {
            const resultsRes = await axios.get('https://hackathon-backend1-akuo.onrender.com/api/teams/results/1');
            const rankedTeams = resultsRes.data;
            const cutoff = Math.ceil(rankedTeams.length * 0.3);

            const myRank = rankedTeams.findIndex(t => t._id === user.teamId) + 1;
            if (myRank > 0 && myRank <= cutoff) setDidAdvance(true);
          }

          if (stateRes.data.round2Status === 'Active') {
            try {
              const problemRes = await axios.get(
                'https://hackathon-backend1-akuo.onrender.com/api/questions?round=2'
              );
              if (problemRes.data.length > 0) setProblem(problemRes.data[0]);
            } catch {}
          }

          try {
            const subRes = await axios.get(
              'https://hackathon-backend1-akuo.onrender.com/api/submissions/myteam/2'
            );
            setMySubmission(subRes.data);
          } catch {}

        } catch {}
        finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user]);

  /* ─────────────────────────────────────────────────────────────
     SUBMIT HANDLER
  ───────────────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      showModal('Please select a .zip file before submitting.');
      return;
    }

    const formData = new FormData();
    formData.append('projectFile', file);
    formData.append('submissionNotes', submissionNotes);

    try {
      const { data } = await axios.post(
        'https://hackathon-backend1-akuo.onrender.com/api/submissions/round2',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setMySubmission(data.submission);
      showModal('Submission successful!', 'success');

    } catch (error) {
      showModal(error.response?.data?.message || 'Submission failed');
    }
  };

  /* ─────────────────────────────────────────────────────────────
     BEFORE DISPLAY: CYBERPUNK STATES
  ───────────────────────────────────────────────────────────── */

  if (!user) {
    return <p className="text-[#9AE6C7] text-center">Loading user...</p>;
  }

  if (loading) {
    return (
      <p className="text-[#9AE6C7] text-center animate-pulse">
        Loading Round 2…
      </p>
    );
  }

  if (!team || !hackathonState || hackathonState.round1Status !== 'Completed') {
    return (
      <p className="text-[#9AE6C7] text-center">
        Round 1 is not completed yet. Please check later.
      </p>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     NOT ADVANCED
  ───────────────────────────────────────────────────────────── */
  if (!didAdvance) {
    return (
      <div className="relative">
        <h2 className="text-4xl font-extrabold mb-6
                       bg-gradient-to-r from-[#00ff7f] to-[#00e5ff]
                       bg-clip-text text-transparent
                       drop-shadow-[0_0_25px_rgba(0,255,127,0.45)]">
          Round 2: AI/ML
        </h2>

        <p className="text-yellow-300 text-center drop-shadow-[0_0_10px_rgba(255,255,0,0.5)]">
          Your team did not advance to Round 2.  
          Thank you for your effort!
        </p>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     ROUND 2 PENDING
  ───────────────────────────────────────────────────────────── */
  if (hackathonState.round2Status === 'Pending') {
    return (
      <div>
        <h2 className="text-4xl font-extrabold mb-6
                       bg-gradient-to-r from-[#00ff7f] to-[#00e5ff]
                       bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,255,127,0.45)]">
          Round 2: AI/ML
        </h2>

        <p className="text-[#00ff7f] text-center">
          Congratulations on advancing 🎉  
          The Round 2 problem statement will be posted soon.
        </p>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     ROUND 2 COMPLETED
  ───────────────────────────────────────────────────────────── */
  if (hackathonState.round2Status === 'Completed') {
    if (team.isFinalist) {
      return (
        <div>
          <h2 className="text-4xl font-extrabold mb-6 text-center
                         bg-gradient-to-r from-[#00ff7f] to-[#00e5ff]
                         bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,255,127,0.45)]">
            🎉 FINALIST! 🎉
          </h2>

          <Card className="p-10 text-center
                           bg-[#001012]/80 backdrop-blur-md
                           border border-[#00ff7f33]
                           shadow-[0_0_30px_rgba(0,255,127,0.25)]">
            <p className="text-[#00ffae] text-3xl font-bold mb-4">
              You’re Going to the Finale!
            </p>

            <p className="text-[#9AE6C7] mb-4">
              Your team has been selected for the offline final round.
            </p>

            <div className="text-[#bfffe7] space-y-1">
              <p><b>Venue:</b> NIT Silchar</p>
              <p><b>Date:</b> February 2026 (Last Week)</p>
              <p>Further instructions will be emailed to the team leader.</p>
            </div>
          </Card>
        </div>
      );
    }

    return (
      <div>
        <h2 className="text-4xl font-extrabold mb-6
                       bg-gradient-to-r from-[#00ff7f] to-[#00e5ff]
                       bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,255,127,0.45)]">
          Round 2 Completed
        </h2>

        <Card className="p-10 text-center
                         bg-[#001012]/80 backdrop-blur-md
                         border border-[#00ff7f33]
                         shadow-[0_0_25px_rgba(255,255,0,0.25)]">
          <p className="text-3xl text-yellow-300 font-bold mb-4">
            Thank You for Your Submission
          </p>
          <p className="text-[#e8e3c2]">
            Your team was not selected for the finale,  
            but your hard work was impressive!
          </p>
        </Card>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     ROUND 2 ACTIVE — PROBLEM + SUBMISSION
  ───────────────────────────────────────────────────────────── */
  if (!problem) {
    return (
      <p className="text-yellow-300 text-center drop-shadow-[0_0_8px_rgba(255,255,0,0.4)]">
        Round 2 is active, but the problem statement is not uploaded yet.
      </p>
    );
  }

  const isLeader = user._id === team.leader._id;

  return (
    <div>
      <h2 className="text-4xl font-extrabold mb-6
                     bg-gradient-to-r from-[#00ff7f] to-[#00e5ff]
                     bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,255,127,0.45)]">
        Round 2: {problem.title}
      </h2>

      <Card className="p-8 mb-10
                       bg-[#001012]/80 backdrop-blur-md
                       border border-[#00ff7f33]
                       shadow-[0_0_25px_rgba(0,255,127,0.2)]">
        <h3 className="text-2xl font-bold text-[#00e5ff] mb-4">Problem Statement</h3>
        <p className="text-[#9AE6C7] whitespace-pre-wrap">{problem.description}</p>
        <p className="text-red-400 font-semibold mt-6">
          Deadline: {new Date(problem.deadline).toLocaleString()}
        </p>
      </Card>

      {mySubmission ? (
        <Card className="p-8
                         bg-[#002e1f]/70 border border-[#00ff7f55]
                         shadow-[0_0_30px_rgba(0,255,127,0.3)]">
          <h3 className="text-xl font-bold text-[#00ff7f] mb-2">
            Submission Received
          </h3>
          <p className="text-[#9AE6C7]">
            Submitted on: {new Date(mySubmission.createdAt).toLocaleString()}
          </p>
          <p className="text-[#9AE6C7] mt-2">
            File: {mySubmission.projectZipFile}
          </p>
        </Card>
      ) : (
        <Card className="p-8
                         bg-[#001012]/80 border border-[#00ff7f33]
                         shadow-[0_0_25px_rgba(0,255,127,0.15)]">

          <h3 className="text-xl font-bold text-[#00e5ff] mb-4">Submit Your Project</h3>

          {!isLeader && (
            <p className="text-yellow-300 text-center mb-4 drop-shadow-[0_0_8px_rgba(255,255,0,0.4)]">
              Only your leader ({team.leader.name}) can submit.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* FILE UPLOAD */}
            <div>
              <label className="block text-sm text-[#9AE6C7] mb-1">Upload .zip File</label>
              <input
                type="file"
                accept=".zip"
                disabled={!isLeader}
                onChange={(e) => setFile(e.target.files[0])}
                className="
                  block w-full text-sm text-[#bfffe7]
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:bg-[#00e5ff] file:text-black
                  hover:file:bg-[#00c2ff]
                  disabled:opacity-40
                "
              />
            </div>

            {/* NOTES */}
            <div>
              <label className="block text-sm text-[#9AE6C7] mb-1">
                Submission Notes (optional)
              </label>
              <textarea
                rows="3"
                value={submissionNotes}
                disabled={!isLeader}
                onChange={(e) => setSubmissionNotes(e.target.value)}
                className="
                  w-full px-3 py-2 bg-[#020e0c] text-[#bfffe7] rounded-lg
                  border border-[#00ff7f33]
                  focus:ring-[#00ff7f] focus:ring-2
                  disabled:opacity-40
                "
                placeholder="Explain your approach, model, architecture, etc."
              ></textarea>
            </div>

            <Button
              type="submit"
              disabled={!isLeader}
              className="w-full text-lg"
            >
              Submit Project
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
};

export default Round2View;

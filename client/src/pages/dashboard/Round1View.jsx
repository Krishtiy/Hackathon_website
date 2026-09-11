import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import Button from '../../components/Button';
import Card from '../../components/Card';

const Round1View = () => {
  const { user, showModal } = useAppContext();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [hackathonState, setHackathonState] = useState(null);
  const [team, setTeam] = useState(null);
  const [mySubmission, setMySubmission] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const fetchHackathonState = async () => {
    try {
      const stateRes = await axios.get('https://hackathon-backend1-akuo.onrender.com/api/state');
      setHackathonState(stateRes.data);
    } catch (error) {
      console.error("Failed to poll state:", error);
    }
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      const stateRes = await axios.get('https://hackathon-backend1-akuo.onrender.com/api/state');
      setHackathonState(stateRes.data);

      const teamRes = await axios.get('https://hackathon-backend1-akuo.onrender.com/api/teams/myteam');
      setTeam(teamRes.data);

      try {
        const subRes = await axios.get('https://hackathon-backend1-akuo.onrender.com/api/quiz/my-submission/1');
        setMySubmission(subRes.data.submission);
        setTotalQuestions(subRes.data.totalQuestions);
      } catch {
        setMySubmission(null);
      }

    } catch {
      // Ignore, team might not exist
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
    const interval = setInterval(fetchHackathonState, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStartQuiz = async () => {
    if (!window.confirm("Start the quiz now? Your timer begins immediately and cannot be paused.")) {
      return;
    }
    
    try {
      const { data } = await axios.get('https://hackathon-backend1-akuo.onrender.com/api/quiz/start/1');
      navigate('/quiz/1', { state: { quizData: data } });
    } catch (error) {
      showModal(error.response?.data?.message || 'Failed to start quiz');
    }
  };

  /* ───────────────────────────────────────────────────────────
     CYBERPUNK STYLES FOR ALL STATES BELOW
  ─────────────────────────────────────────────────────────── */

  if (loading) {
    return (
      <p className="text-[#9AE6C7] text-center animate-pulse">
        Loading Round 1 status...
      </p>
    );
  }

  if (!team) {
    return (
      <p className="text-yellow-300 text-center drop-shadow-[0_0_8px_rgba(255,255,0,0.4)]">
        You must be on a team to participate in Round 1.
      </p>
    );
  }

  if (team.paymentStatus !== 'completed') {
    return (
      <p className="text-yellow-300 text-center drop-shadow-[0_0_8px_rgba(255,255,0,0.4)]">
        Your team's payment must be verified to start Round 1.
      </p>
    );
  }

  if (!hackathonState || hackathonState.round1Status === 'Pending') {
    return (
      <p className="text-[#9AE6C7] text-center">
        Round 1 has not started yet. Please check back later.
      </p>
    );
  }

  /* ───────────────────────────────────────────────────────────
     ROUND 1 COMPLETED — SHOW SCORE
  ─────────────────────────────────────────────────────────── */

  if (hackathonState.round1Status === 'Completed') {
    return (
      <div className="relative">

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(0,255,127,0.15) 1px, transparent 1px), linear-gradient(0deg, rgba(0,255,127,0.15) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold mb-6
                         bg-gradient-to-r from-[#00ff7f] to-[#00e5ff]
                         bg-clip-text text-transparent
                         drop-shadow-[0_0_20px_rgba(0,255,127,0.45)]">
            Round 1 Completed
          </h2>

          {mySubmission ? (
            <Card className="p-8 text-center
                             bg-[#001012]/80 backdrop-blur-md
                             border border-[#00ff7f33]
                             shadow-[0_0_30px_rgba(0,255,127,0.2)]">

              <p className="text-xl text-[#9AE6C7] mb-3">Your Score</p>
              <p className="text-5xl font-bold text-[#00ffae] drop-shadow-[0_0_10px_rgba(0,255,127,0.45)]">
                {mySubmission.score} / {totalQuestions}
              </p>

              <p className="text-xl text-[#9AE6C7] mt-6">Team Average Score</p>
              <p className="text-4xl font-bold text-[#00e5ff] drop-shadow-[0_0_10px_rgba(0,229,255,0.45)]">
                {team.round1FinalScore.toFixed(2)}
              </p>
            </Card>
          ) : (
            <p className="text-yellow-300 text-center mt-4">
              You did not submit the quiz.
            </p>
          )}
        </div>

      </div>
    );
  }

  /* ───────────────────────────────────────────────────────────
     USER HAS ALREADY SUBMITTED BUT ROUND STILL ACTIVE
  ─────────────────────────────────────────────────────────── */

  if (mySubmission) {
    return (
      <div className="relative">

        <h2 className="text-4xl font-extrabold mb-6
                       bg-gradient-to-r from-[#00ff7f] to-[#00e5ff]
                       bg-clip-text text-transparent
                       drop-shadow-[0_0_20px_rgba(0,255,127,0.45)]">
          Round 1: Submitted
        </h2>

        <Card className="p-8 text-center
                         bg-[#001012]/80 backdrop-blur-md
                         border border-[#00ff7f33]
                         shadow-[0_0_30px_rgba(0,255,127,0.2)]">

          <p className="text-xl text-[#9AE6C7] mb-3">Your Score</p>
          <p className="text-5xl font-bold text-[#00ffae] drop-shadow-[0_0_10px_rgba(0,255,127,0.45)]">
            {mySubmission.score} / {totalQuestions}
          </p>

          <p className="text-[#77a69a] mt-3 text-sm">Waiting for others...</p>

          <p className="text-xl text-[#9AE6C7] mt-6">Current Team Average</p>
          <p className="text-4xl font-bold text-[#00e5ff]">
            {team.round1FinalScore.toFixed(2)}
          </p>
        </Card>

      </div>
    );
  }

  /* ───────────────────────────────────────────────────────────
     ROUND ACTIVE — SHOW START QUIZ BUTTON
  ─────────────────────────────────────────────────────────── */

  return (
    <div className="relative">

      <h2 className="text-4xl font-extrabold mb-6
                     bg-gradient-to-r from-[#00ff7f] to-[#00e5ff]
                     bg-clip-text text-transparent
                     drop-shadow-[0_0_20px_rgba(0,255,127,0.45)]">
        Round 1: Online Screening
      </h2>

      <p className="text-[#9AE6C7] mb-4">
        A 30-minute quiz of 30 MCQs. Timer begins immediately once started.
      </p>

      <p className="text-yellow-400 font-semibold mb-6 drop-shadow-[0_0_8px_rgba(255,255,0,0.4)]">
        Once started, you cannot pause or retake.  
        Each team member takes the quiz individually.
      </p>

      <Button 
        onClick={handleStartQuiz} 
        className="text-lg px-10 py-3"
      >
        Start Quiz
      </Button>

    </div>
  );
};

export default Round1View;

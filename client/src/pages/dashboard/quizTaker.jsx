import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import Button from '../../components/Button';

/* ───────────────────────────────────────────────
   CYBERPUNK TIMER COMPONENT
─────────────────────────────────────────────── */
const Timer = ({ deadline, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(new Date(deadline) - new Date());

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <div className="text-2xl font-bold text-[#ff5e5e] animate-pulse drop-shadow-[0_0_8px_rgba(255,0,0,0.45)]">
      Time Left: {minutes.toString().padStart(2, '0')}:
      {seconds.toString().padStart(2, '0')}
    </div>
  );
};


/* ───────────────────────────────────────────────
   MAIN COMPONENT
─────────────────────────────────────────────── */
const QuizTaker = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { showModal } = useAppContext();
  
  const [quizData, setQuizData] = useState(state?.quizData);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!quizData) {
      showModal('Cannot resume quiz. Please go to your dashboard.');
      navigate('/dashboard');
    }
  }, [quizData, navigate, showModal]);

  const handleSelectAnswer = (questionId, index) => {
    setAnswers(prev => ({ ...prev, [questionId]: index }));
  };

  const handleSubmit = async (isTimeUp = false) => {
    if (submitting) return;

    setSubmitting(true);
    
    if (!isTimeUp && !window.confirm("Are you sure you want to submit?")) {
      setSubmitting(false);
      return;
    }

    const formattedAnswers = Object.entries(answers).map(
      ([questionId, selectedOption]) => ({
        questionId,
        selectedOption
      })
    );

    try {
      const { data } = await axios.post('https://hackathon-backend1-akuo.onrender.com/api/quiz/submit/1', {
        submissionId: quizData.submissionId,
        answers: formattedAnswers
      });

      showModal(`Quiz Submitted! Your score: ${data.score}/${data.totalQuestions}`, 'success');
      navigate('/dashboard');

    } catch (error) {
      showModal(error.response?.data?.message || 'Failed to submit quiz');
      navigate('/dashboard');
    }
  };

  if (!quizData) return null;

  return (
    <div className="relative max-w-4xl mx-auto px-4 py-12 animate-fadeIn">

      {/* Hologram Grid */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(0,255,127,0.12) 1px, transparent 1px), linear-gradient(0deg, rgba(0,255,127,0.12) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Scanlines */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(0deg, rgba(0,255,127,0.12) 2px, transparent 2px)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* HEADER */}
      <div className="relative z-10 flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold
                       bg-gradient-to-r from-[#00ff7f] to-[#00e5ff]
                       bg-clip-text text-transparent
                       drop-shadow-[0_0_20px_rgba(0,255,127,0.45)]">
          Round 1 Quiz
        </h1>
        <Timer deadline={quizData.deadline} onTimeUp={() => handleSubmit(true)} />
      </div>

      {/* QUESTIONS */}
      <div className="relative z-10 space-y-10">
        {quizData.questions.map((q, index) => (
          <div
            key={q._id}
            className="p-6 rounded-xl bg-[#001012]/80 backdrop-blur-md
                       border border-[#00ff7f33]
                       shadow-[0_0_25px_rgba(0,255,127,0.15)]"
          >
            <p className="text-xl font-semibold text-[#9AE6C7] mb-4">
              Q{index + 1}: {q.title}
            </p>

            <div className="space-y-4">
              {q.options.map((option, i) => {
                const isSelected = answers[q._id] === i;

                return (
                  <label
                    key={i}
                    className={`
                      block p-4 rounded-lg cursor-pointer transition-all transform-gpu
                      border 
                      ${isSelected
                        ? "bg-[#00ff7f]/20 border-[#00ff7f] text-[#00ffae] shadow-[0_0_18px_rgba(0,255,127,0.35)]"
                        : "bg-[#041f1a]/40 border-[#00ff7f22] text-[#9AE6C7] hover:bg-[#083829] hover:border-[#00ff7f77]"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name={q._id}
                      className="hidden"
                      onChange={() => handleSelectAnswer(q._id, i)}
                    />
                    {option}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* SUBMIT BUTTON */}
      <div className="relative z-10 mt-12">
        <Button
          onClick={() => handleSubmit(false)}
          disabled={submitting}
          className="w-full justify-center text-lg"
        >
          {submitting ? 'Submitting...' : 'Finish & Submit Quiz'}
        </Button>
      </div>
    </div>
  );
};

export default QuizTaker;

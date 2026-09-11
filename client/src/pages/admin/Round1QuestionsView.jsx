import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import Button from '../../components/Button';
import Card from '../../components/Card';

const Round1QuestionsView = () => {
  const { showModal, user } = useAppContext();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roundState, setRoundState] = useState(null);

  // Add Question Form
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState(0);

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const stateRes = await axios.get('https://hackathon-backend1-akuo.onrender.com/api/state');
          const qRes = await axios.get('https://hackathon-backend1-akuo.onrender.com/api/questions?round=1');

          setRoundState(stateRes.data);
          setQuestions(qRes.data);

        } catch (error) {
          showModal(error.response?.data?.message || 'Failed to fetch data');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user, showModal]);

  // ---------------- HANDLERS ----------------
  const handleOptionChange = (i, value) => {
    const copy = [...options];
    copy[i] = value;
    setOptions(copy);
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://hackathon-backend1-akuo.onrender.com/api/questions', {
        round: 1,
        title,
        options,
        correctOption: Number(correctOption)
      });

      showModal('Question added successfully!', 'success');
      setTitle('');
      setOptions(['', '', '', '']);
      setCorrectOption(0);

      const qRes = await axios.get('https://hackathon-backend1-akuo.onrender.com/api/questions?round=1');
      setQuestions(qRes.data);

    } catch (error) {
      showModal(error.response?.data?.message || 'Failed to create question');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return;

    try {
      await axios.delete(`https://hackathon-backend1-akuo.onrender.com
/api/questions/${id}`);
      showModal('Deleted successfully!', 'success');

      const qRes = await axios.get('https://hackathon-backend1-akuo.onrender.com/api/questions?round=1');
      setQuestions(qRes.data);

    } catch (error) {
      showModal(error.response?.data?.message || 'Failed to delete question');
    }
  };

  const handleSetRoundStatus = async (status) => {
    if (!window.confirm(`Set Round 1 to "${status}"?`)) return;

    try {
      const { data } = await axios.post('https://hackathon-backend1-akuo.onrender.com/api/state/round1', { status });
      setRoundState(data);
      showModal(`Round 1 updated to ${status}`, 'success');

    } catch (error) {
      showModal(error.response?.data?.message || 'Failed to update round status');
    }
  };

  // ---------------- UI ----------------
  if (!user) return <p className="text-center text-[#00e5ff]">Loading user…</p>;
  if (loading) return <p className="text-center text-[#00e5ff] animate-pulse">Loading…</p>;

  return (
    <div className="space-y-10 animate-fadeIn">

      {/* HEADER */}
      <h2
        className="
          text-4xl font-extrabold mb-2
          bg-gradient-to-r from-[#00ff7f] to-[#00e5ff]
          bg-clip-text text-transparent
          drop-shadow-[0_0_25px_rgba(0,255,127,0.5)]
        "
      >
        Round 1 – Question Bank
      </h2>

      {/* ---------------- ROUND CONTROL ---------------- */}
      <Card
        className="
          p-8 bg-[#001012]/80 backdrop-blur-md
          border border-[#00ff7f55]
          rounded-xl shadow-[0_0_20px_rgba(0,255,127,0.25)]
        "
      >
        <h3 className="text-2xl text-[#00ffae] font-semibold mb-4">Round Control</h3>

        {roundState && (
          <div className="flex items-center justify-between">

            <div>
              <p className="text-gray-300">Current Status:</p>

              <span
                className={`
                  text-xl font-bold
                  ${roundState.round1Status === "Active" ? "text-green-400" : ""}
                  ${roundState.round1Status === "Pending" ? "text-yellow-400" : ""}
                  ${roundState.round1Status === "Completed" ? "text-red-400" : ""}
                `}
              >
                {roundState.round1Status}
              </span>
            </div>

            <div className="space-x-3">
              {roundState.round1Status === "Pending" && (
                <Button onClick={() => handleSetRoundStatus("Active")}>
                  Start Round
                </Button>
              )}

              {roundState.round1Status === "Active" && (
                <Button
                  variant="secondary"
                  className="!bg-red-700 hover:!bg-red-600"
                  onClick={() => handleSetRoundStatus("Completed")}
                >
                  End Round
                </Button>
              )}

              {roundState.round1Status === "Completed" && (
                <Button
                  variant="secondary"
                  className="!bg-gray-700 hover:!bg-gray-600"
                  onClick={() => handleSetRoundStatus("Pending")}
                >
                  Reset Round
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* ---------------- ADD NEW QUESTION  ---------------- */}
      <Card
        className="
          p-8 bg-[#001012]/80 backdrop-blur-md
          border border-[#00e5ff55]
          rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.25)]
        "
      >
        <h3 className="text-2xl text-[#00e5ff] font-semibold mb-6">Add New Question</h3>

        <form onSubmit={handleCreateQuestion} className="space-y-6">

          {/* Question Title */}
          <div>
            <label className="text-sm text-gray-300">Question Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="
                mt-1 w-full px-3 py-2 rounded-md
                bg-gray-900 border border-gray-700 text-white
                focus:border-[#00e5ff] focus:ring-[#00e5ff]
              "
              required
            />
          </div>

          {/* Options */}
          {options.map((opt, i) => (
            <div key={i}>
              <label className="text-sm text-gray-300">
                Option {i + 1}
              </label>
              <input
                value={options[i]}
                onChange={(e) => handleOptionChange(i, e.target.value)}
                className="
                  mt-1 w-full px-3 py-2 rounded-md
                  bg-gray-900 border border-gray-700 text-white
                  focus:border-[#00e5ff] focus:ring-[#00e5ff]
                "
                required
              />
            </div>
          ))}

          {/* Correct Answer */}
          <div>
            <label className="text-sm text-gray-300">Correct Option</label>
            <select
              value={correctOption}
              onChange={(e) => setCorrectOption(e.target.value)}
              className="
                mt-1 w-full px-3 py-2 rounded-md
                bg-gray-900 border border-gray-700 text-white
                focus:border-[#00ff7f] focus:ring-[#00ff7f]
              "
            >
              {[0, 1, 2, 3].map((i) => (
                <option key={i} value={i}>
                  Option {i + 1}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" className="w-full py-2 text-lg">
            Add Question
          </Button>
        </form>
      </Card>

      {/* ---------------- QUESTION LIST ---------------- */}
      <h3 className="text-2xl text-[#00ff7f] font-semibold">Existing Questions</h3>

      <div className="space-y-5">
        {questions.length === 0 && (
          <p className="text-gray-400">No questions added yet.</p>
        )}

        {questions.map((q) => (
          <Card
            key={q._id}
            className="
              p-6 bg-[#0a0f14] border border-[#00ff7f33]
              rounded-xl shadow-[0_0_12px_rgba(0,255,127,0.15)]
            "
          >
            <p className="text-lg font-semibold text-white">{q.title}</p>

            <ul className="mt-3 space-y-1 text-gray-300">
              {q.options.map((opt, i) => (
                <li
                  key={i}
                  className={`
                    ${i === q.correctOption ? "text-[#00ff7f] font-bold drop-shadow-[0_0_6px_rgba(0,255,127,0.9)]" : ""}
                  `}
                >
                  {opt} {i === q.correctOption && "(Correct)"}
                </li>
              ))}
            </ul>

            <div className="text-right mt-4">
              <Button
                variant="secondary"
                className="!bg-red-700 hover:!bg-red-600 text-sm py-1 px-3"
                onClick={() => handleDelete(q._id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
};

export default Round1QuestionsView;

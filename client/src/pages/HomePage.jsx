import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import { Award } from '../components/icons';

import heroVideo from '../videos/hero1.mp4';
import { apply3DTilt } from '../utils/tilt';

const HomePage = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const cardRefs = useRef([]);

  // Parallax hero subtle movement
  useEffect(() => {
    const handleMove = (e) => {
      if (!heroRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 18; // range -9 .. 9
      const y = (e.clientY / window.innerHeight - 0.5) * 12; // range -6 .. 6
      heroRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  // Apply 3D tilt to all cards
  useEffect(() => {
    cardRefs.current.forEach((el) => {
      if (el) apply3DTilt(el, 12);
    });
  }, []);

  // small helper to set refs (keeps order)
  const setCardRef = (el, idx) => {
    cardRefs.current[idx] = el;
  };

  return (
    <div className="bg-black text-white min-h-screen animate-fadeIn font-sans">

      {/* HERO */}
      <header className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Video background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>

        {/* color overlay + scanlines */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#071016]/80 via-[#00121a]/50 to-[#000000]/90"></div>
        <div className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-20">
          {/* subtle vertical scanlines using CSS background pattern */}
          <div
            style={{
              backgroundImage:
                'linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
              backgroundSize: '4px 100%',
              height: '100%',
            }}
          />
        </div>

        {/* hero content (parallax container) */}
        <div
          ref={heroRef}
          className="relative z-10 max-w-6xl mx-auto px-6 text-center transition-transform duration-200"
        >
          <h1
            className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-tight"
            style={{
              textShadow:
                '0 0 18px rgba(0,255,127,0.12), 0 0 45px rgba(0,199,255,0.06)',
            }}
          >
            <span className="inline-block relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff7f] via-[#00e5ff] to-[#7efcff]">
                Hackathon 2026
              </span>

              {/* small glitch accent */}
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 w-full h-full"
                style={{
                  mixBlendMode: 'screen',
                  filter: 'blur(6px)',
                  opacity: 0.06,
                  transform: 'translateY(-6px)',
                  background:
                    'linear-gradient(90deg, rgba(0,255,127,0.14), rgba(0,199,255,0.06))',
                }}
              />
            </span>
          </h1>

          <p className="mt-4 text-lg md:text-xl text-[#9fbdd1]">
            A National-Level Coding Competition by <span className="text-[#00ff7f] font-semibold">NIT Silchar</span>
          </p>

          <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-[#b7cfdc]">
            Join other bright minds to hack, build, and prototype AI/ML powered solutions — in a cyberpunk, competitive environment.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => navigate('/register')}
              className="px-10 py-3 text-lg rounded-lg font-semibold
                         bg-gradient-to-r from-[#00ff7f] via-[#00e5ff] to-[#5ef0ff]
                         text-black shadow-[0_8px_30px_rgba(0,229,255,0.12)]
                         hover:scale-[1.04] transition-transform duration-250"
            >
              Register Your Team
            </Button>
          </div>

          <p className="mt-4 text-sm text-[#7faea0]">Deadline: <span className="text-[#00ff7f] font-medium">30th December 2025</span></p>
        </div>
      </header>

      {/* MAIN */}
<main className="relative z-10 -mt-10 space-y-20 px-6 md:px-8 lg:px-12 pb-12">

        {/* ABOUT */}
        <section className="max-w-6xl mx-auto">
  <Card
    ref={(el) => setCardRef(el, 0)}
    className="p-10 bg-[#071019] border border-[#00ff7f]/8 rounded-2xl shadow-[0_10px_40px_rgba(0,255,127,0.03)]"
  >
    <h2 className="text-2xl md:text-3xl font-bold text-white">About the Event</h2>

    <p className="mt-4 text-[#bcdfe3] leading-relaxed">
      This national-level hackathon brings together innovators, developers, and researchers from across the country to tackle
      modern-day challenges using Artificial Intelligence, Machine Learning, and cutting-edge engineering. Build impactful prototypes,
      push your technical limits, and showcase your creativity as you compete for top honors.
    </p>

    <div className="mt-6 grid md:grid-cols-2 gap-6 text-[#cfe8e0] leading-relaxed">
      <p>
        Organized by <span className="text-[#00ff7f] font-semibold">NIT Silchar</span>, the event creates an intense, collaborative environment
        where participants engage with skilled mentors, exchange ideas, and work on solutions that reflect real-world demands.
      </p>

      <p>
        Participants will face a blend of algorithmic challenges, AI/ML model development, and system design tasks — designed to
        test technical depth, problem-solving ability, and teamwork under pressure.
      </p>
    </div>
  </Card>
</section>


        {/* STRUCTURE */}
        <section className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Competition Structure</h3>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Round 1: Online Screening',
                date: 'January 2026 (Second Week)',
                desc: 'MCQs, aptitude, and coding basics to test fundamentals.',
              },
              {
                title: 'Round 2: Online AI/ML',
                date: 'February 2026 (First Week)',
                desc: 'AI/ML problem statements to showcase technical depth and creativity.',
              },
              {
                title: 'Round 3: Offline Finale',
                date: 'February 2026 (Last Week)',
                desc: 'Final on-campus competition — present your project and demo.',
              },
            ].map((item, idx) => (
              <Card
                key={idx}
                ref={(el) => setCardRef(el, idx + 1)}
                className="p-6 rounded-xl bg-[#041217] border border-[#00ff7f]/8
                           hover:shadow-[0_18px_60px_rgba(0,255,127,0.06)] transition-transform duration-300"
              >
                <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                <p className="text-sm mt-1 text-[#7fe3d0] font-medium">{item.date}</p>
                <p className="mt-4 text-[#cfe8e0] text-sm">{item.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* PRIZES */}
        <section className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Prizes & Recognition</h3>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: '1st Prize', amt: '₹50,000', color: '#00ff7f' },
              { title: '2nd Prize', amt: '₹40,000', color: '#00e5ff' },
              { title: '3rd Prize', amt: '₹30,000', color: '#5ef0ff' },
            ].map((p, idx) => (
              <Card
                key={idx}
                ref={(el) => setCardRef(el, idx + 4)}
                className="text-center p-8 rounded-xl bg-[#041217] border border-[#00ff7f]/6
                           transform-gpu hover:scale-[1.03] transition-all duration-250 shadow-[0_10px_30px_rgba(0,255,127,0.02)]"
              >
                <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full"
                     style={{
                       background: 'linear-gradient(135deg, rgba(0,255,127,0.08), rgba(0,229,255,0.04))',
                       boxShadow: `0 6px 24px ${p.color}33`,
                     }}
                >
                  <Award className="h-10 w-10" style={{ color: p.color }} />
                </div>
                <h4 className="text-xl font-bold mt-4">{p.title}</h4>
                <p className="text-3xl font-extrabold mt-2" style={{ color: p.color }}>{p.amt}</p>
                <p className="mt-2 text-[#cfe8e0]">+ Certificate of Achievement</p>
              </Card>
            ))}
          </div>

          <Card className="mt-6 p-6 bg-[#071019] border border-[#00ff7f]/6 rounded-xl">
            <h4 className="text-lg font-semibold text-white text-center">All participants will be recognized!</h4>
            <ul className="mt-4 text-[#cfe8e0] list-disc list-inside space-y-2 max-w-xl mx-auto">
              <li><strong>Outstanding Performance:</strong> Top 10% (≥80%).</li>
              <li><strong>Appreciation Certificate:</strong> ≥50% or Top 75%.</li>
              <li><strong>Participation Certificate:</strong> All registered participants.</li>
            </ul>
          </Card>
        </section>

        {/* REGISTRATION & PERKS */}
        <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          <Card
            ref={(el) => setCardRef(el, 8)}
            className="p-8 bg-[#071019] border border-[#00ff7f]/8 rounded-xl"
          >
            <h4 className="text-xl font-bold text-white">Registration Details</h4>
            <ul className="mt-4 text-[#cfe8e0] space-y-3">
              <li><span className="text-[#00ff7f] font-semibold">Team Size:</span> Up to 3 members</li>
              <li><span className="text-[#00ff7f] font-semibold">Deadline:</span> 30th December 2025</li>
              <li><span className="text-[#00ff7f] font-semibold">Fee:</span> Rs. 2000 per team</li>
            </ul>

            <button
              onClick={() => navigate('/register')}
              className="mt-6 w-full py-3 rounded-md bg-transparent border border-[#00ff7f] text-[#00ff7f]
                         hover:bg-[#00ff7f]/6 transition-colors duration-200"
            >
              Register Your Team
            </button>
          </Card>

          <Card
            ref={(el) => setCardRef(el, 9)}
            className="p-8 bg-[#041217] border border-[#00ff7f]/6 rounded-xl"
          >
            <h4 className="text-xl font-bold text-white">Perks for Finalists</h4>
            <ul className="mt-4 text-[#cfe8e0] list-disc list-inside space-y-2">
              <li>Free accommodation during the final round.</li>
              <li>Opportunity to explore local attractions.</li>
              <li>Academic Interaction & Gala Dinner with esteemed academicians.</li>
            </ul>
          </Card>
        </section>

        {/* CONTACT */}
        <section className="max-w-6xl mx-auto text-center py-8">
          <h3 className="text-2xl font-bold text-white">Have Questions?</h3>
          <p className="mt-3 text-[#cfe8e0]">
            For any queries, reach out to the event coordinators:
            <br />
            <span className="text-[#00ff7f] font-semibold">CR, Sec A & B, B.Tech (CSE), 3rd year, NIT Silchar</span>
          </p>
        </section>
      </main>
    </div>
  );
};

export default HomePage;

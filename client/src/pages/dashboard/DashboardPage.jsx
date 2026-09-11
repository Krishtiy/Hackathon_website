import React, { useState } from 'react';
import Card from '../../components/Card';
import { Users, DollarSign, ClipboardList, Code, Award } from '../../components/icons';

import TeamView from './TeamView';
import PaymentView from './PaymentView';
import Round1View from './Round1View';
import Round2View from './Round2View';
import ResultsView from './ResultsView';

const DashboardPage = () => {
  const [activeView, setActiveView] = useState('team');

  const views = {
    team: <TeamView />,
    payment: <PaymentView />,
    round1: <Round1View />,
    round2: <Round2View />,
    results: <ResultsView />,
  };

  const NavItem = ({ view, icon, children }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`
        flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-left transition-all 
        font-medium transform-gpu

        ${
          activeView === view
            ? 'bg-[#00ff7f]/20 border border-[#00ff7f77] text-[#00ffae] shadow-[0_0_20px_rgba(0,255,127,0.3)]'
            : 'text-[#9AE6C7] hover:bg-[#00271f] hover:text-[#00ff7f] border border-transparent'
        }
      `}
    >
      {icon}
      <span>{children}</span>
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative animate-fadeIn">

      {/* Hologram Grid BG */}
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
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(0deg, rgba(0,255,127,0.1) 2px, transparent 2px)",
          backgroundSize: "100% 4px",
        }}
      />

      <h1
        className="text-4xl font-extrabold mb-10 relative z-10
        bg-gradient-to-r from-[#00ff7f] to-[#00e5ff]
        bg-clip-text text-transparent
        drop-shadow-[0_0_18px_rgba(0,255,127,0.4)]"
      >
        Participant Dashboard
      </h1>

      <div className="flex flex-col md:flex-row gap-8 relative z-10">

        {/* Sidebar */}
        <aside className="md:w-1/4">
          <div
            className="
              p-4 rounded-xl
              bg-[#001012]/80 backdrop-blur-md
              border border-[#00ff7f33]
              shadow-[0_0_25px_rgba(0,255,127,0.15)]
              space-y-2
            "
          >
            <NavItem view="team" icon={<Users className="h-5 w-5 text-[#00e5ff]" />}>
              My Team
            </NavItem>

            <NavItem view="payment" icon={<DollarSign className="h-5 w-5 text-[#00e5ff]" />}>
              Payment
            </NavItem>

            <NavItem view="round1" icon={<ClipboardList className="h-5 w-5 text-[#00e5ff]" />}>
              Round 1: Screening
            </NavItem>

            <NavItem view="round2" icon={<Code className="h-5 w-5 text-[#00e5ff]" />}>
              Round 2: AI/ML
            </NavItem>

            <NavItem view="results" icon={<Award className="h-5 w-5 text-[#00e5ff]" />}>
              Results & Certificates
            </NavItem>
          </div>
        </aside>

        {/* Main Display Panel */}
        <main className="md:w-3/4">
          <Card
            className="
              p-6 md:p-8 min-h-[420px] 
              bg-[#001012]/70 backdrop-blur-md
              border border-[#00ff7f33]
              shadow-[0_0_40px_rgba(0,255,127,0.15)]
            "
          >
            {views[activeView]}
          </Card>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;

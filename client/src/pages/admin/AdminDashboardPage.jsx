import React, { useState } from 'react';
import Card from '../../components/Card';
import {
  Users,
  DollarSign,
  ClipboardList,
  FileText,
  Award
} from '../../components/icons';

// Admin Subviews
import UserManagementView from './UserManagementView';
import TeamPaymentsView from './TeamPaymentsView';
import Round1QuestionsView from './Round1QuestionsView';
import Round1ResultsView from './Round1ResultsView';
import Round2SettingsView from './Round2SettingsView';
import SubmissionsView from './SubmissionsView';
import CertificateView from './CertificateView';

const AdminDashboardPage = () => {
  const [activeView, setActiveView] = useState('users');

  // Cyberpunk Nav Item
  const NavItem = ({ view, icon, children }) => {
    const isActive = activeView === view;

    return (
      <button
        onClick={() => setActiveView(view)}
        className={`
          flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-left transition-all
          border
          ${
            isActive
              ? 'bg-[#00ff7f33] border-[#00ff7f88] text-[#00ffae] shadow-[0_0_15px_rgba(0,255,127,0.45)]'
              : 'bg-[#001012]/60 border-[#00ff7f22] text-gray-300 hover:bg-[#00221b] hover:border-[#00ff7f55] hover:text-[#baffee]'
          }
        `}
      >
        <span className="text-[#00ffae]">{icon}</span>
        <span className="font-medium">{children}</span>
      </button>
    );
  };

  // Render active view
  const renderActiveView = () => {
    switch (activeView) {
      case 'users':
        return <UserManagementView />;
      case 'payments':
        return <TeamPaymentsView />;
      case 'round1':
        return <Round1QuestionsView />;
      case 'round1-results':
        return <Round1ResultsView />;
      case 'round2-settings':
        return <Round2SettingsView />;
      case 'submissions':
        return <SubmissionsView />;
      case 'certificates':
        return <CertificateView />;
      default:
        return <UserManagementView />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">

      {/* Top Title */}
      <h1
        className="
          text-4xl font-extrabold mb-10
          bg-gradient-to-r from-[#00ff7f] to-[#00e5ff]
          bg-clip-text text-transparent
          drop-shadow-[0_0_25px_rgba(0,255,127,0.45)]
        "
      >
        Organizer Dashboard
      </h1>

      <div className="flex flex-col md:flex-row gap-10">

        {/* LEFT SIDEBAR */}
        <aside className="md:w-1/4">

          <div
            className="
              p-4 rounded-xl
              bg-[#001012]/80 backdrop-blur-md
              border border-[#00ff7f33]
              shadow-[0_0_20px_rgba(0,255,127,0.2)]
              space-y-3
            "
          >
            <NavItem view="users" icon={<Users className="h-5 w-5" />}>
              User Management
            </NavItem>

            <NavItem view="payments" icon={<DollarSign className="h-5 w-5" />}>
              Team Management
            </NavItem>

            <NavItem view="round1" icon={<ClipboardList className="h-5 w-5" />}>
              Round 1 Questions
            </NavItem>

            <NavItem view="round1-results" icon={<Award className="h-5 w-5" />}>
              Round 1 Results
            </NavItem>

            <NavItem view="round2-settings" icon={<FileText className="h-5 w-5" />}>
              Round 2 Settings
            </NavItem>

            <NavItem view="submissions" icon={<FileText className="h-5 w-5" />}>
              Round 2 Submissions
            </NavItem>

            <NavItem view="certificates" icon={<Award className="h-5 w-5" />}>
              Certificates
            </NavItem>
          </div>

        </aside>

        {/* RIGHT SIDE CONTENT */}
        <main className="md:w-3/4">
          <Card
            className="
              p-8 min-h-[420px]
              bg-[#001012]/80 backdrop-blur-md
              border border-[#00e5ff33]
              shadow-[0_0_20px_rgba(0,229,255,0.25)]
              rounded-xl
            "
          >
            {renderActiveView()}
          </Card>
        </main>

      </div>
    </div>
  );
};

export default AdminDashboardPage;

import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { Code, Menu, X } from './icons';
import Button from './Button';

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAppContext();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      onClick={() => setIsMobileMenuOpen(false)}
      className="relative text-[#9AE6C7] hover:text-[#00ffae] px-3 py-2 text-sm font-medium transition-all
                 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0
                 after:bg-gradient-to-r from-[#00ff7f] to-[#00e5ff] after:transition-all hover:after:w-full"
    >
      {children}
    </Link>
  );

  const MobileNavLink = ({ to, children }) => (
    <Link
      to={to}
      onClick={() => setIsMobileMenuOpen(false)}
      className="block text-[#9AE6C7] hover:bg-[#03271f] hover:text-[#00ffae] px-3 py-2 
                 rounded-md text-base font-medium transition-all"
    >
      {children}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 
                    bg-[#000a0a]/80 backdrop-blur-md 
                    border-b border-[#00ff7f22] shadow-[0_0_20px_rgba(0,255,127,0.1)]">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ────────────────────── BRAND / LOGO ───────────────────── */}
          <Link to="/" className="flex items-center space-x-2">
            <Code className="h-8 w-8 text-[#00ff7f]" />
            <span className="font-bold text-xl bg-gradient-to-r from-[#00ff7f] to-[#00e5ff]
                             bg-clip-text text-transparent">
              Hackathon 2026
            </span>
          </Link>

          {/* ────────────────────── DESKTOP MENU ───────────────────── */}
          <div className="hidden md:flex items-center space-x-6">

            <NavLink to="/">Home</NavLink>

            {!isLoggedIn && (
              <>
                <NavLink to="/login">Login</NavLink>
                <Button
                  onClick={() => navigate('/register')}
                  className="bg-gradient-to-r from-[#00ff7f] to-[#00e5ff] text-black font-semibold
                             shadow-[0_0_20px_rgba(0,255,127,0.3)]
                             hover:shadow-[0_0_30px_rgba(0,255,127,0.5)]"
                >
                  Register Now
                </Button>
              </>
            )}

            {isLoggedIn && (
              <>
                <NavLink to={user?.role === 'admin' ? '/admin' : '/dashboard'}>
                  Dashboard
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm border border-[#00ff7f33] rounded-md
                             text-[#00ffae] hover:bg-[#003826] hover:border-[#00ff7f] 
                             transition-all"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* ────────────────────── MOBILE MENU BUTTON ───────────────────── */}
          <div className="md:hidden -mr-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md bg-[#001614] text-[#00ff7f] hover:bg-[#003326]
                         focus:ring-2 focus:ring-[#00ff7f]"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ────────────────────── MOBILE MENU DROPDOWN ───────────────────── */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-[#000f0d]/95 border-t border-[#00ff7f22]`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <MobileNavLink to="/">Home</MobileNavLink>

          {!isLoggedIn && (
            <>
              <MobileNavLink to="/login">Login</MobileNavLink>
              <MobileNavLink to="/register">Register</MobileNavLink>
            </>
          )}

          {isLoggedIn && (
            <>
              <MobileNavLink to={user?.role === 'admin' ? '/admin' : '/dashboard'}>
                Dashboard
              </MobileNavLink>

              <button
                onClick={handleLogout}
                className="block w-full text-left text-[#9AE6C7] hover:bg-[#03271f] 
                           hover:text-[#00ffae] rounded-md px-3 py-2 transition-all"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

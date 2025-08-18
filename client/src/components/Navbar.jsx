import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { Play, Send, Loader2 } from "lucide-react";

export default function Navbar({ 
  onRun, 
  onSubmit, 
  isRunning, 
  isSubmitting, 
  showSubmit = true,
  runMode = "example"
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  
  // Check if we're on solve or compiler route
  const isSolveRoute = location.pathname.includes('/solve/');
  const isCompilerRoute = location.pathname === "/compiler";

  const fadeSlideDown = {
    hidden: { opacity: 0, y: -20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const fadeIn = {
    hidden: { opacity: 0, scale: 0.95 },
    show: (i = 0) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.15, duration: 0.5 },
    }),
  };

  // Variants for staggered mobile menu items
  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -10 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
        ease: "easeOut",
      },
    },
  };

  const mobileMenuItemVariants = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  // Compact navbar for solve/compiler routes
  if (isSolveRoute || isCompilerRoute) {
    return (
      <motion.nav
        className="bg-[#141219]/95 backdrop-blur-xl border-b border-white/20 shadow-2xl fixed top-0 w-full z-50 text-white"
        variants={fadeSlideDown}
        initial="hidden"
        animate="show"
      >
        <style>{`
          .compact-nav {
            height: 4rem;
            padding: 0 1.5rem;
          }
          
          .compact-nav .nav-content {
            max-width: 100%;
            padding: 0 1rem;
          }
          
          .compact-nav .logo {
            height: 2.5rem;
            width: auto;
          }
          
          .compact-nav .nav-item {
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
            font-weight: 600;
            border-radius: 0.75rem;
            transition: all 0.3s ease;
            border: 1px solid transparent;
          }
          
          .compact-nav .nav-item:hover {
            background: rgba(114, 134, 255, 0.1);
            border-color: rgba(114, 134, 255, 0.3);
            transform: translateY(-1px);
          }
          
          .compact-nav .user-section {
            gap: 0.75rem;
          }
          
          .compact-nav .user-section button {
            padding: 0.5rem;
            font-size: 0.875rem;
          }

          .action-buttons {
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .run-btn-nav {
            background: linear-gradient(135deg, #7286ff 0%, #fe7587 100%);
            border: none;
            color: white;
            font-weight: 700;
            padding: 0.75rem 1.5rem;
            border-radius: 0.75rem;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(114, 134, 255, 0.4);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.875rem;
            cursor: pointer;
            position: relative;
            overflow: hidden;
          }

          .run-btn-nav:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(114, 134, 255, 0.6);
          }

          .run-btn-nav:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
          }

          .run-btn-nav::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
          }

          .run-btn-nav:hover::before {
            left: 100%;
          }

          .submit-btn-nav {
            background: transparent;
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.8);
            font-weight: 700;
            padding: 0.75rem 1.5rem;
            border-radius: 0.75rem;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.875rem;
            cursor: pointer;
          }

          .submit-btn-nav:hover {
            background: white;
            color: #141219;
            border-color: white;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(255, 255, 255, 0.4);
          }

          .submit-btn-nav:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
          }

          .problem-list-link {
            background: linear-gradient(135deg, rgba(114, 134, 255, 0.1) 0%, rgba(254, 117, 135, 0.1) 100%);
            border: 1px solid rgba(114, 134, 255, 0.3);
            border-radius: 0.75rem;
            padding: 0.75rem 1.25rem;
            color: #e0e7ff;
            font-weight: 600;
            font-size: 0.875rem;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            text-decoration: none;
            backdrop-filter: blur(10px);
          }

          .problem-list-link:hover {
            background: linear-gradient(135deg, rgba(114, 134, 255, 0.2) 0%, rgba(254, 117, 135, 0.2) 100%);
            border-color: rgba(114, 134, 255, 0.5);
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(114, 134, 255, 0.3);
            color: white;
          }

          .problem-list-link svg {
            width: 1rem;
            height: 1rem;
            transition: transform 0.3s ease;
          }

          .problem-list-link:hover svg {
            transform: translateX(2px);
          }
        `}</style>

        <div className="compact-nav max-w-none mx-auto flex items-center justify-between">
          {/* Problem List Link - Replaces Logo */}
          <motion.div variants={fadeIn} custom={0}>
            <Link to="/problems" className="problem-list-link">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Problem List
            </Link>
          </motion.div>

          {/* Center Action Buttons */}
          <motion.div
            variants={fadeIn}
            custom={1}
            className="action-buttons"
          >
            <button
              onClick={onRun}
              disabled={isRunning}
              className="run-btn-nav"
              title={runMode === "example" ? "Run Test Cases" : "Run Code"}
            >
              {isRunning ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {runMode === "example" ? "Run Tests" : "Run"}
            </button>

            {showSubmit && (
              <button
                onClick={onSubmit}
                disabled={isSubmitting}
                className="submit-btn-nav"
                title="Submit Solution"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Submit
              </button>
            )}
          </motion.div>

          {/* Right Section - User Controls */}
          <motion.div
            variants={fadeIn}
            custom={2}
            className="user-section flex items-center gap-2"
          >
            {/* Streak Display */}
            <div className="hidden sm:flex items-center space-x-1 bg-gradient-to-r from-[#7286ff]/20 to-[#fe7587]/20 px-2 py-1 rounded-full border border-[#7286ff]/30">
              <span className="text-xs font-semibold text-[#7286ff]">🔥</span>
              <span className="text-xs text-white/90">7</span>
            </div>

            {/* Theme Toggle */}
            <button className="text-white/70 hover:text-white transition-colors p-1 rounded hover:bg-white/10">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>

            {/* Settings */}
            <button className="text-white/70 hover:text-white transition-colors p-1 rounded hover:bg-white/10">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {/* User Profile */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2"
                >
                  <FontAwesomeIcon icon={faUser} className="text-white text-xl" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1b1724] border border-white/10 rounded shadow-xl text-white backdrop-blur-lg">
                    <div className="p-3 border-b border-white/10">
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-300">{user.email}</p>
                    </div>
                    <ul className="text-sm">
                      <li>
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 hover:bg-white/10"
                        >
                          Dashboard
                        </Link>
                      </li>
                      {user?.role === "admin" && (
                        <li>
                          <Link
                            to="/create-problem"
                            className="block px-4 py-2 hover:bg-white/10"
                          >
                            Create Problem
                          </Link>
                        </li>
                      )}
                      <li>
                        <button
                          onClick={logout}
                          className="w-full text-left px-4 py-2 hover:bg-white/10"
                        >
                          Sign Out
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </motion.nav>
    );
  }

  return (
    <motion.nav
      className="bg-[#141219]/80 backdrop-blur border-b border-white/10 shadow-lg fixed top-0 w-full z-50 text-white"
      variants={fadeSlideDown}
      initial="hidden"
      animate="show"
    >
      <style>{`
        :root {
          --gradient-colorful-1: linear-gradient(270deg, #12C2E9 0%, #c471ed 50%, #f64f59 100%);
          --color: rgba(255, 255, 255, 0.8);
          --hover-color: rgba(255, 255, 255, 1);
          --nav-link-bg-color: var(--gradient-colorful-1);
        }

        .nav-hover-underline {
          position: relative;
          color: var(--color);
          transition: color 0.1s ease-out;
        }

        .nav-hover-underline::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -4px;
          width: 0%;
          height: 2.5px;
          background: var(--nav-link-bg-color);
          background-size: 200% 100%;
          background-position: 100% 0;
          border-radius: 2px;
          filter: drop-shadow(0 0 6px rgba(246, 79, 89, 0.7));
          transition: width 1.2s cubic-bezier(0.15, 0.85, 0.35, 1), 
            background-position 0.8s cubic-bezier(0.2, 0.7, 0.4, 1);
        }

        .nav-hover-underline:hover {
          color: var(--hover-color);
        }

        .nav-hover-underline:hover::after {
          width: 100%;
          background-position: 0 0;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        .neon-btn {
          border-radius: 9999px;
          border: 1.5px solid transparent;
          background:
            linear-gradient(#141219, #141219) padding-box,
            linear-gradient(90deg, #7286ff, #fe7587) border-box;
          padding: 0.5rem 1.25rem;
          font-weight: 600;
          color: white;
          transition: all 0.3s ease;
          cursor: pointer;
          display: inline-block;
          text-align: center;
        }

        .neon-btn:hover {
          background:
            linear-gradient(#2d1d34, #2d1d34) padding-box,
            linear-gradient(90deg, #7286ff, #fe7587) border-box;
          filter: drop-shadow(0 0 8px rgba(114,134,255,0.6));
        }

        .neon-menu-link {
          border-radius: 0.5rem;
          border: 1.5px solid transparent;
          background:
            linear-gradient(#141219, #141219) padding-box,
            linear-gradient(90deg, #7286ff, #fe7587) border-box;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          color: white;
          transition: all 0.3s ease;
          width: 100%;
          display: block;
          text-align: left;
          margin: 0.25rem 0;
          cursor: pointer;
          user-select: none;
        }

        .neon-menu-link:hover {
          background:
            linear-gradient(#2d1d34, #2d1d34) padding-box,
            linear-gradient(90deg, #7286ff, #fe7587) border-box;
          filter: drop-shadow(0 0 10px rgba(114,134,255,0.8));
          text-decoration: none;
          color: white;
        }

        .hamburger-btn {
          border-radius: 0.5rem;
          border: 1.5px solid transparent;
          background:
            linear-gradient(#141219, #141219) padding-box,
            linear-gradient(90deg, #7286ff, #fe7587) border-box;
          padding: 0.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .hamburger-btn:hover {
          filter: drop-shadow(0 0 8px rgba(114,134,255,0.6));
        }

        .hamburger-btn.active {
          filter: drop-shadow(0 0 12px rgba(114,134,255,1));
          border-color: #7286ff;
        }
      `}</style>

      <div className="max-w-screen-xl mx-auto p-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div variants={fadeIn} custom={0}>
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/assets/kickdsa.png"
              alt="KickDSA Logo"
              className="h-10 w-auto scale-380 object-contain ml-4 sm:ml-0"
            />
          </Link>
        </motion.div>

        {/* Main Nav Links */}
        {user && (
          <motion.ul
            variants={fadeIn}
            custom={1}
            className="hidden md:flex gap-8 text-lg font-medium items-center justify-center flex-grow text-white"
          >
            {[
              { label: "Home", to: "/" },
              { label: "Problems", to: "/problems" },
              { label: "Compiler", to: "/compiler" },
              { label: "Leaderboard", to: "/leaderboard" },
              { label: "Path Explorer", to: "/path-explorer" },
            ].map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="nav-hover-underline px-1 py-1 transition-all duration-300"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}

        {/* Auth Buttons / Dropdown */}
        <motion.div
          variants={fadeIn}
          custom={2}
          className="hidden md:flex items-center gap-4"
        >
          {!user ? (
            location.pathname === "/login" ? (
              <Link to="/register" className="neon-btn">
                Get Started
              </Link>
            ) : location.pathname === "/register" ? (
              <Link to="/login" className="neon-btn">
                Login
              </Link>
            ) : !isAuthPage ? (
              <Link to="/register" className="neon-btn">
                Get Started
              </Link>
            ) : null
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faUser} className="text-white text-2xl" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1b1724] border border-white/10 rounded shadow-xl text-white backdrop-blur-lg">
                  <div className="p-3 border-b border-white/10">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-gray-300">{user.email}</p>
                  </div>
                  <ul className="text-sm">
                    <li>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 hover:bg-white/10"
                      >
                        Dashboard
                      </Link>
                    </li>
                    {user?.role === "admin" && (
                      <li>
                        <Link
                          to="/create-problem"
                          className="block px-4 py-2 hover:bg-white/10"
                        >
                          Create Problem
                        </Link>
                      </li>
                    )}
                    <li>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 hover:bg-white/10"
                      >
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`hamburger-btn ${menuOpen ? "active" : ""} focus:outline-none`}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.ul
          variants={mobileMenuVariants}
          initial="hidden"
          animate="show"
          exit="hidden"
          className="md:hidden flex flex-col bg-[#141219]/90 backdrop-blur-md border-t border-white/10 text-white text-center px-4 py-3"
        >
          {user ? (
            [
              { label: "Home", to: "/" },
              { label: "Problems", to: "/problems" },
              { label: "Compiler", to: "/compiler" },
              { label: "Leaderboard", to: "/leaderboard" },
              { label: "Path Explorer", to: "/path-explorer" },
              ...(user?.role === "admin"
                ? [{ label: "Create Problem", to: "/create-problem" }]
                : []),
            ].map((item, index) => (
              <motion.li
                key={item.to}
                variants={mobileMenuItemVariants}
                className="w-full"
              >
                <Link to={item.to} className="neon-menu-link">
                  {item.label}
                </Link>
              </motion.li>
            ))
          ) : (
            <motion.li variants={mobileMenuItemVariants} className="w-full">
              <Link to="/register" className="neon-menu-link">
                Get Started
              </Link>
            </motion.li>
          )}
        </motion.ul>
      )}
    </motion.nav>
  );
}

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

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

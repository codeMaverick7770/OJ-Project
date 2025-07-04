import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="bg-black bg-opacity-60 backdrop-blur border-b border-white/20 shadow-lg fixed top-0 w-full z-50 text-white">
      <div className="max-w-screen-xl mx-auto p-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-400 bg-clip-text text-transparent">
            JustiCode
          </span>
        </Link>

        {/* Nav Links */}
        {user && (
          <ul className="hidden md:flex gap-8 text-lg font-medium items-center justify-center flex-grow text-white">
            <li><Link to="/" className="hover:underline underline-offset-8 decoration-white transition">Home</Link></li>
            <li><Link to="/problems" className="hover:underline underline-offset-8 decoration-white transition">Problems</Link></li>
            <li><Link to="/compiler" className="hover:underline underline-offset-8 decoration-white transition">Compiler</Link></li>
          </ul>
        )}

        {/* Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <Link
              to="/register"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2 rounded-md font-medium hover:opacity-90 transition"
            >
              Get Started
            </Link>
          ) : (
            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2">
                <img
                  src="/assets/user.png"
                  className="w-8 h-8 rounded-full border border-white"
                  alt="user"
                />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-black/80 border border-white/20 rounded shadow-xl text-white backdrop-blur-lg">
                  <div className="p-3 border-b border-white/10">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-gray-300">{user.email}</p>
                  </div>
                  <ul className="text-sm">
                    <li><Link to="/dashboard" className="block px-4 py-2 hover:bg-white/10">Dashboard</Link></li>
                    <li><Link to="/create-problem" className="block px-4 py-2 hover:bg-white/10">Create Problem</Link></li>
                    <li><button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-white/10">Sign Out</button></li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <ul className="md:hidden flex flex-col bg-black border-t border-white/20 text-white text-center">
          {user ? (
            <>
              <li><Link to="/" className="py-2 hover:bg-white/10">Home</Link></li>
              <li><Link to="/problems" className="py-2 hover:bg-white/10">Problems</Link></li>
              <li><Link to="/compiler" className="py-2 hover:bg-white/10">Compiler</Link></li>
            </>
          ) : (
            <li>
              <Link
                to="/register"
                className="py-2 hover:bg-white/10 text-white"
              >
                Get Started
              </Link>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="OJ Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">JustiCode</span>
        </Link>

        {user && (
          <div className="relative flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            >
              <img
                className="w-8 h-8 rounded-full"
                src="https://flowbite.com/docs/images/people/profile-picture-3.jpg"
                alt="user"
              />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-12 z-50 w-44 bg-white rounded-lg shadow dark:bg-gray-700">
                <div className="px-4 py-3">
                  <span className="block text-sm text-gray-900 dark:text-white">{user.name}</span>
                  <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{user.email}</span>
                </div>
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/problems" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                      Problems
                    </Link>
                  </li>
                  <li>
                    <Link to="/compiler" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                      Compiler
                    </Link>
                  </li>
                  {user.role === 'admin' && (
                    <li>
                      <Link to="/create-problem" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                        Create Problem
                      </Link>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={logout}
                      className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="inline-flex items-center p-2 w-10 h-10 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>

        <div className={`${menuOpen ? 'block' : 'hidden'} w-full md:flex md:w-auto md:order-1`}>
          <ul className="flex flex-col md:flex-row md:space-x-8 font-medium p-4 mt-4 border rounded-lg bg-gray-50 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 md:border-0 dark:border-gray-700">
            <li>
              <Link to="/" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 dark:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link to="/problems" className="block py-2 px-3 text-gray-900 hover:bg-gray-100 dark:text-white">
                Problems
              </Link>
            </li>
            {user && (
              <li>
                <Link to="/compiler" className="block py-2 px-3 text-gray-900 hover:bg-gray-100 dark:text-white">
                  Compiler
                </Link>
              </li>
            )}
            {!user && (
              <>
                <li>
                  <Link to="/login" className="block py-2 px-3 text-gray-900 hover:bg-gray-100 dark:text-white">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="block py-2 px-3 text-gray-900 hover:bg-gray-100 dark:text-white">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

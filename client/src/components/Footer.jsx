import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black bg-opacity-60 backdrop-blur border-t border-white/20 text-white py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-400 bg-clip-text text-transparent">
            JustiCode
          </Link>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li>
                <Link to="/about" className="hover:underline underline-offset-4 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:underline underline-offset-4 transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:underline underline-offset-4 transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:underline underline-offset-4 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-4 text-gray-400">
          &copy; {new Date().getFullYear()} JustiCode. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
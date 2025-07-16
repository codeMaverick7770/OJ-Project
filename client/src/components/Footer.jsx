import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#08080c] bg-opacity-90 backdrop-blur-md border-t border-white/10 text-white py-6">

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/assets/kickdsa.png"
              alt="KickDSA Logo"
              className="max-h-10 w-auto scale-300  object-contain"
            />
          </Link>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6 text-sm md:text-base font-medium">
              <li>
                <Link to="/about" className="hover:text-pink-400 transition-colors duration-200">
                  About
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-pink-400 transition-colors duration-200">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-pink-400 transition-colors duration-200">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-pink-400 transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-4 text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} KickDSA. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

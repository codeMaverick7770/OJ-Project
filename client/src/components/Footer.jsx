import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-black bg-opacity-50 backdrop-blur border-t border-white/20 text-white">
      <div className="max-w-screen-xl mx-auto p-6 flex flex-col md:flex-row justify-between items-center">
        <a href="/" className="flex items-center space-x-2 mb-4 md:mb-0">
          <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-400 bg-clip-text text-transparent">JustiCode</span>
        </a>
        <ul className="flex flex-wrap justify-center space-x-6 text-sm text-gray-400">
          <li><a href="#" className="hover:text-white transition">About</a></li>
          <li><a href="#" className="hover:text-white transition">Privacy</a></li>
          <li><a href="#" className="hover:text-white transition">Licensing</a></li>
          <li><a href="#" className="hover:text-white transition">Contact</a></li>
        </ul>
      </div>
      <div className="text-center py-4 text-xs text-gray-400 border-t border-white/20">
        © 2025 <a href="/" className="hover:underline text-white">JustiCode™</a>. All rights reserved.
      </div>
    </footer>
  );
}

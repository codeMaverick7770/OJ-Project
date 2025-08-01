import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../assets/loading.json';

const MIN_DELAY = 400;

const GlobalLoader = ({ fullScreen = true, size = 200, message = '' }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), MIN_DELAY);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 z-50 flex items-center justify-center h-screen w-screen
        transition-opacity duration-500 ease-in-out
        ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        ${fullScreen ? 'bg-black/95 backdrop-blur-[10px]' : ''}
      `}
    >
      <div className="flex flex-col items-center text-white">
        {show && (
          <Lottie
            animationData={loadingAnimation}
            loop={true}
            autoplay={true}
            style={{ height: size, width: size }}
          />
        )}
        {message && (
          <p className="mt-4 text-xl font-semibold text-glow-blue animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default GlobalLoader;

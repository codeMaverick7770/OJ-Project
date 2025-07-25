import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../assets/loading.json';

const MIN_DELAY = 400; // Minimum loader visible time in ms

const GlobalLoader = ({ fullScreen = true, size = 200, message = '' }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(() => {
      if (isMounted) setShow(true);
    }, MIN_DELAY);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`flex items-center justify-center transition-opacity duration-500 ease-in-out ${
        fullScreen
          ? 'h-screen w-screen fixed top-0 left-0 z-50 bg-black/50 backdrop-blur-md'
          : ''
      }`}
    >
      <div className="flex flex-col items-center text-white">
        <Lottie
          animationData={loadingAnimation}
          loop={true}
          style={{ height: size, width: size }}
        />
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

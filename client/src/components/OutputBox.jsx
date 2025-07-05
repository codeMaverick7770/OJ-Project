import React from 'react';

function OutputBox({ output }) {
  if (!output) return null;

  return (
    <div className="bg-white/5 backdrop-blur-md w-full rounded-xl p-4 border border-white/10 text-white text-sm min-h-[150px]">
      <strong className="block mb-2 text-white/70">Output:</strong>
      <pre className="whitespace-pre-wrap">{output}</pre>
    </div>
  );
}

export default OutputBox;

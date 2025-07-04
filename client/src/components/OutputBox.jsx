import React from 'react';

function OutputBox({ output }) {
  if (!output) return null;

  return (
    <div className="bg-white/5 backdrop-blur-md w-full rounded-xl p-4 border border-white/10 text-white text-sm outline-none min-h-[150px] whitespace-pre-wrap">
      <strong className="block mb-2 text-white/70">Output:</strong>
      <pre>{output}</pre>
    </div>
  );
}

export default OutputBox;

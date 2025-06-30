import React from 'react';

function OutputBox({ output }) {
  if (!output) return null;

  return (
    <div className="mt-4 p-4 rounded bg-gray-100 border text-sm whitespace-pre-wrap">
      <strong>Output:</strong>
      <pre className="mt-2">{output}</pre>
    </div>
  );
}

export default OutputBox;

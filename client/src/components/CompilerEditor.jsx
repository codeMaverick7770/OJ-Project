// src/components/CompilerEditor.jsx
import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-okaidia.css'; // Dark theme

function CompilerEditor({ code, setCode }) {
  return (
    <Editor
      value={code}
      onValueChange={setCode}
      highlight={code => highlight(code, languages.js)}
      padding={12}
      className="min-h-[300px] font-mono text-sm text-white bg-transparent outline-none"
      style={{
        backgroundColor: 'transparent',
        caretColor: 'white',
        fontSize: '14px',
        lineHeight: '1.6',
      }}
    />
  );
}

export default CompilerEditor;

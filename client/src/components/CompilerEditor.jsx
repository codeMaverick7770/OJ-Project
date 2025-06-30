import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';

function CompilerEditor({ code, setCode }) {
  return (
    <Editor
      value={code}
      onValueChange={setCode}
      highlight={code => highlight(code, languages.js)}
      padding={10}
      className="min-h-[300px] font-mono text-sm bg-white outline-none"
    />
  );
}

export default CompilerEditor;

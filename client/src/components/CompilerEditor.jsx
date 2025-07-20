import Editor from "@monaco-editor/react";

const CompilerEditor = ({ code, setCode, language = "javascript" }) => {
  const handleEditorChange = (value) => {
    if (typeof value === "string") {
      setCode(value);
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    monaco.editor.defineTheme("transparent-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#00000000", // Fully transparent
        "editorLineNumber.foreground": "#888888",
        "editor.foreground": "#ffffff",

        // Remove borders/focus rings
        "focusBorder": "#00000000",
        "input.border": "#00000000",
        "dropdown.border": "#00000000",
        "editorWidget.border": "#00000000",
        "editorSuggestWidget.border": "#00000000",
        "editorHoverWidget.border": "#00000000",
        "editorGroup.border": "#00000000",
        "sideBar.border": "#00000000",
        "panel.border": "#00000000",
      },
    });

    monaco.editor.setTheme("transparent-dark");
  };

  return (
    <div className="h-[400px] rounded-lg overflow-hidden w-full">
      <Editor
        height="100%"
        width="100%"
        language={language}
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme="transparent-dark"
        options={{
          fontSize: 14,
          fontFamily: "Fira Code, monospace",
          fontLigatures: true,
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          wordWrap: "on",
          formatOnType: true,
          formatOnPaste: true,
          tabSize: 2,
          autoClosingBrackets: "always",
          matchBrackets: "always",
          lineNumbers: "on",
          renderLineHighlight: "none",
          lineDecorationsWidth: 0,
          glyphMargin: false,
        }}
      />
    </div>
  );
};

export default CompilerEditor;

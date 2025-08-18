import Editor from "@monaco-editor/react";
import { useRef, useEffect } from "react";

const CompilerEditor = ({ code, setCode, language = "javascript", markers = [] }) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  const handleEditorChange = (value) => {
    if (typeof value === "string") {
      setCode(value);
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    monaco.editor.defineTheme("transparent-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#00000000",
        "editorLineNumber.foreground": "#888888",
        "editor.foreground": "#ffffff",
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

    if (markers.length > 0) {
      const model = editor.getModel();
      monaco.editor.setModelMarkers(model, "owner", markers);
    }
  };

  useEffect(() => {
    if (monacoRef.current && editorRef.current) {
      const model = editorRef.current.getModel();
      monacoRef.current.editor.setModelMarkers(model, "owner", markers);
    }
  }, [markers]);

  return (
    <div className="h-full rounded-lg overflow-hidden w-full">
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
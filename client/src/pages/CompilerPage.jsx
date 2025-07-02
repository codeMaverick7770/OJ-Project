import React, { useState } from 'react';
import axios from 'axios';
import CompilerEditor from '../components/CompilerEditor';
import OutputBox from '../components/OutputBox';

function CompilerPage() {
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState({
    cpp: `#include <iostream>\nusing namespace std;\nint main() {\n  string name;\n  getline(cin, name);\n  cout << "Hello, " << name << endl;\n  return 0;\n}`,
    java: `import java.util.*;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String name = sc.nextLine();\n    System.out.println("Hello, " + name);\n  }\n}`,
    python: `name = input()\nprint("Hello,", name)`
  });
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleRun = async () => {
    try {
      const { data } = await axios.post(
        import.meta.env.VITE_COMPILER_URL,
        {
          language,
          code: code[language],
          input
        },
        { withCredentials: true }
      );
      setOutput(data.output);
    } catch (err) {
      setOutput(err.response?.data?.error?.stderr || "Something went wrong");
    }
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="min-h-screen py-10 px-4 bg-white/80 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold mb-4 text-center">⚙️ Online Code Compiler</h2>

        <select
          className="border rounded px-3 py-2 mb-4"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
        </select>

        <div className="border rounded p-4 bg-gray-50 mb-4">
          <CompilerEditor
            code={code[language]}
            setCode={(newCode) => setCode({ ...code, [language]: newCode })}
          />
        </div>

        <textarea
          className="w-full p-2 border rounded mb-4 text-sm"
          rows="4"
          placeholder="Enter input here (if any)..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          className="mb-4 px-5 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded hover:opacity-90"
          onClick={handleRun}
        >
          ▶️ Run
        </button>

        <OutputBox output={output} />
      </div>
    </div>
  );
}

export default CompilerPage;

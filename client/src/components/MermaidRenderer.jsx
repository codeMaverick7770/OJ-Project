export default function MermaidRenderer({ chart }) {
  const fallback = `graph TD\n  A[Fallback Diagram] --> B[Invalid Mermaid Format]`;

  const isValidMermaid = chart?.trim().match(
    /^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|journey|gantt)\s/i
  );

  const content = isValidMermaid ? chart.trim() : fallback;

  return (
    <div className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
      <pre>
        <code className="language-mermaid">
{content}
        </code>
      </pre>
    </div>
  );
}

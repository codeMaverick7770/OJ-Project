import React from 'react';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';

// Professional LeetCode-quality markdown renderer
export const LeetCodeRenderer = ({ content }) => {
  if (!content || typeof content !== 'string') {
    return (
      <div className="text-white/50 text-center py-8">
        <p>No content to display</p>
      </div>
    );
  }

  // Process the markdown content with professional quality
  const processMarkdown = (text) => {
    if (!text) return text;

    // Split into lines for processing
    const lines = text.split('\n');
    const elements = [];
    let currentParagraph = [];
    let inCodeBlock = false;
    let codeBlockContent = [];
    let codeBlockLang = '';
    let inLatexBlock = false;
    let latexBlockContent = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // Handle LaTeX blocks ($$...$$)
      if (trimmedLine.startsWith('$$') && trimmedLine.endsWith('$$')) {
        if (currentParagraph.length > 0) {
          elements.push(renderParagraph(currentParagraph, i));
          currentParagraph = [];
        }
        const latex = trimmedLine.slice(2, -2);
        elements.push(renderLatexBlock([latex], i));
        continue;
      }

      // Handle LaTeX block start
      if (trimmedLine.startsWith('$$') && !inLatexBlock) {
        if (currentParagraph.length > 0) {
          elements.push(renderParagraph(currentParagraph, i));
          currentParagraph = [];
        }
        inLatexBlock = true;
        latexBlockContent = [trimmedLine.slice(2)];
        continue;
      }

      // Handle LaTeX block end
      if (trimmedLine.endsWith('$$') && inLatexBlock) {
        latexBlockContent.push(trimmedLine.slice(0, -2));
        elements.push(renderLatexBlock(latexBlockContent, i));
        inLatexBlock = false;
        latexBlockContent = [];
        continue;
      }

      if (inLatexBlock) {
        latexBlockContent.push(line);
        continue;
      }

      // Handle code blocks
      if (trimmedLine.startsWith('```')) {
        if (inCodeBlock) {
          // End code block
          if (codeBlockContent.length > 0) {
            elements.push(renderCodeBlock(codeBlockContent, codeBlockLang, i));
          }
          inCodeBlock = false;
          codeBlockContent = [];
          codeBlockLang = '';
        } else {
          // Start code block
          if (currentParagraph.length > 0) {
            elements.push(renderParagraph(currentParagraph, i));
            currentParagraph = [];
          }
          codeBlockLang = trimmedLine.slice(3).trim();
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
      } else {
        // Handle headings
        if (trimmedLine.startsWith('#')) {
          if (currentParagraph.length > 0) {
            elements.push(renderParagraph(currentParagraph, i));
            currentParagraph = [];
          }
          elements.push(renderHeading(trimmedLine, i));
        }
        // Handle lists
        else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
          if (currentParagraph.length > 0) {
            elements.push(renderParagraph(currentParagraph, i));
            currentParagraph = [];
          }
          elements.push(renderListItem(trimmedLine, i));
        }
        // Handle empty lines
        else if (trimmedLine === '') {
          if (currentParagraph.length > 0) {
            elements.push(renderParagraph(currentParagraph, i));
            currentParagraph = [];
          }
        }
        // Regular content
        else {
          currentParagraph.push(line);
        }
      }
    }

    // Handle remaining paragraph
    if (currentParagraph.length > 0) {
      elements.push(renderParagraph(currentParagraph, lines.length));
    }

    return elements;
  };

  const renderHeading = (line, key) => {
    const level = line.match(/^#+/)[0].length;
    const text = line.replace(/^#+\s*/, '');
    const Tag = `h${Math.min(level, 6)}`;
    
    let className = 'font-bold text-white mb-4 leading-tight';
    if (level === 1) className += ' text-3xl';
    else if (level === 2) className += ' text-2xl';
    else if (level === 3) className += ' text-xl';
    else className += ' text-lg';

    return React.createElement(Tag, { 
      key: `heading-${key}`,
      className 
    }, processInlineFormatting(text));
  };

  const renderParagraph = (lines, key) => {
    if (lines.length === 0) return null;
    
    const content = lines.join('\n');
    return React.createElement('p', {
      key: `para-${key}`,
      className: 'text-white/90 leading-relaxed mb-4 text-base'
    }, processInlineFormatting(content));
  };

  const renderListItem = (line, key) => {
    const text = line.replace(/^[-*]\s*/, '');
    return React.createElement('li', {
      key: `list-${key}`,
      className: 'text-white/90 leading-relaxed ml-6 mb-2 text-base'
    }, processInlineFormatting(text));
  };

  const renderCodeBlock = (lines, language, key) => {
    const code = lines.join('\n');
    return (
      <div key={`code-${key}`} className="mb-6">
        {language && (
          <div className="text-xs text-white/60 mb-2 px-3 py-1 bg-[#2a2a3d] rounded-t font-mono border-b border-[#7286ff]/20">
            {language}
          </div>
        )}
        <pre className="bg-[#1a1a2e] border border-[#7286ff]/20 rounded-b-lg p-4 overflow-x-auto text-sm font-mono text-white/90 leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    );
  };

  const renderLatexBlock = (lines, key) => {
    const latex = lines.join('\n');
    return (
      <div key={`latex-${key}`} className="my-6 p-4 bg-[#1a1a2e] border border-[#7286ff]/20 rounded-lg">
        <div className="text-center">
          <span className="text-lg text-[#7286ff] font-mono">$${latex}$</span>
        </div>
      </div>
    );
  };

  const processInlineFormatting = (text) => {
    if (!text) return text;

    // Process inline LaTeX ($...$)
    const parts = [];
    let lastIndex = 0;
    let inLatex = false;
    let startIndex = -1;

    for (let i = 0; i < text.length; i++) {
      if (text[i] === '$' && (i === 0 || text[i-1] !== '\\')) {
        if (!inLatex) {
          // Start of inline LaTeX
          if (i > lastIndex) {
            parts.push(text.slice(lastIndex, i));
          }
          startIndex = i;
          inLatex = true;
        } else {
          // End of inline LaTeX
          const latex = text.slice(startIndex + 1, i);
          parts.push(
            <span key={`latex-${i}`} className="font-mono text-[#7286ff] bg-[#2a2a3d]/50 px-1 py-0.5 rounded">
              ${latex}$
            </span>
          );
          lastIndex = i + 1;
          inLatex = false;
        }
      }
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    // Process bold, italic, and inline code
    const processedParts = parts.map(part => {
      if (typeof part === 'string') {
        return processBoldAndItalic(part);
      }
      return part;
    });

    return processedParts.length === 1 ? processedParts[0] : processedParts;
  };

  const processBoldAndItalic = (text) => {
    if (!text) return text;

    // Process bold (**text**)
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
    // Process italic (*text*)
    text = text.replace(/\*(.*?)\*/g, '<em class="italic text-white/80">$1</em>');
    // Process inline code (`code`)
    text = text.replace(/`(.*?)`/g, '<code class="bg-[#2a2a3d] px-1.5 py-0.5 rounded text-sm font-mono text-[#7286ff] border border-[#7286ff]/20">$1</code>');
    
    return React.createElement('span', {
      dangerouslySetInnerHTML: { __html: text }
    });
  };

  try {
    return (
      <div className="leetcode-markdown">
        {processMarkdown(content)}
      </div>
    );
  } catch (error) {
    console.error('LeetCodeRenderer error:', error);
    // Fallback: show raw content
    return (
      <div className="text-white/90 leading-relaxed">
        <pre className="whitespace-pre-wrap bg-[#1a1a2e] p-4 rounded border border-red-500/30">
          {content}
        </pre>
      </div>
    );
  }
};

export default LeetCodeRenderer;

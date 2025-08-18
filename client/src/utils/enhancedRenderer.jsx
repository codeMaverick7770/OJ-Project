import React from 'react';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';

// Enhanced renderer that handles both HTML and Markdown content
export const EnhancedRenderer = ({ content }) => {
  if (!content || typeof content !== 'string') {
    return (
      <div className="text-white/50 text-center py-8">
        <p>No content to display</p>
      </div>
    );
  }

  // Check if content contains HTML tags
  const hasHTML = /<[^>]*>/.test(content);
  
  if (hasHTML) {
    // Content is HTML from rich text editor - render directly with sanitization
    return (
      <div 
        className="enhanced-html-content"
        dangerouslySetInnerHTML={{ __html: sanitizeHTML(content) }}
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          lineHeight: '1.6'
        }}
      />
    );
  } else {
    // Content is markdown - use the existing LeetCode renderer logic
    return <MarkdownRenderer content={content} />;
  }
};

// HTML sanitization function
const sanitizeHTML = (html) => {
  // Basic sanitization - allow safe HTML tags and attributes
  const allowedTags = {
    'h1': ['class'],
    'h2': ['class'],
    'h3': ['class'],
    'h4': ['class'],
    'h5': ['class'],
    'h6': ['class'],
    'p': ['class'],
    'strong': ['class'],
    'b': ['class'],
    'em': ['class'],
    'i': ['class'],
    'u': ['class'],
    'code': ['class'],
    'pre': ['class'],
    'ul': ['class'],
    'ol': ['class'],
    'li': ['class'],
    'blockquote': ['class'],
    'hr': ['class'],
    'br': [],
    'span': ['class'],
    'div': ['class']
  };

  // Simple tag-based sanitization
  let sanitized = html;
  
  // Remove script tags and event handlers
  sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove potentially dangerous attributes
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/vbscript:/gi, '');
  sanitized = sanitized.replace(/data:/gi, '');
  
  return sanitized;
};

// Markdown renderer for traditional markdown content
const MarkdownRenderer = ({ content }) => {
  const processMarkdown = (text) => {
    if (!text) return text;

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
          if (codeBlockContent.length > 0) {
            elements.push(renderCodeBlock(codeBlockContent, codeBlockLang, i));
          }
          inCodeBlock = false;
          codeBlockContent = [];
          codeBlockLang = '';
        } else {
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
          if (i > lastIndex) {
            parts.push(text.slice(lastIndex, i));
          }
          startIndex = i;
          inLatex = true;
        } else {
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

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

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

    text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em class="italic text-white/80">$1</em>');
    text = text.replace(/`(.*?)`/g, '<code class="bg-[#2a2a3d] px-1.5 py-0.5 rounded text-sm font-mono text-[#7286ff] border border-[#7286ff]/20">$1</code>');
    
    return React.createElement('span', {
      dangerouslySetInnerHTML: { __html: text }
    });
  };

  try {
    return (
      <div className="markdown-content">
        {processMarkdown(content)}
      </div>
    );
  } catch (error) {
    console.error('MarkdownRenderer error:', error);
    return (
      <div className="text-white/90 leading-relaxed">
        <pre className="whitespace-pre-wrap bg-[#1a1a2e] p-4 rounded border border-red-500/30">
          {content}
        </pre>
      </div>
    );
  }
};

export default EnhancedRenderer;

// Add CSS for enhanced HTML content
const styles = `
  .enhanced-html-content h1 {
    font-size: 1.875rem;
    font-weight: 700;
    margin: 1rem 0 0.5rem 0;
    color: #ffffff;
    line-height: 1.2;
  }
  
  .enhanced-html-content h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0.75rem 0 0.5rem 0;
    color: #ffffff;
    line-height: 1.3;
  }
  
  .enhanced-html-content h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0.5rem 0 0.25rem 0;
    color: #ffffff;
    line-height: 1.4;
  }
  
  .enhanced-html-content p {
    margin: 0.5rem 0;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.9);
  }
  
  .enhanced-html-content ul {
    list-style: none;
    padding-left: 1.25rem;
  }
  
  .enhanced-html-content ul, .enhanced-html-content ol {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
    color: rgba(255, 255, 255, 0.9);
  }
  
  .enhanced-html-content li {
    margin: 0.25rem 0;
    line-height: 1.5;
  }
  
  .enhanced-html-content blockquote {
    border-left: 4px solid #7286ff;
    margin: 1rem 0;
    padding-left: 1rem;
    font-style: italic;
    color: #a0aec0;
    background: rgba(114, 134, 255, 0.1);
    padding: 1rem;
    border-radius: 0.5rem;
  }
  
  .enhanced-html-content code {
    background: rgba(42, 42, 61, 0.8);
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-family: 'Fira Code', monospace;
    font-size: 0.875rem;
    color: #7286ff;
    border: 1px solid rgba(114, 134, 255, 0.2);
  }
  
  .enhanced-html-content pre {
    background: rgba(26, 26, 46, 0.8);
    border: 1px solid rgba(114, 134, 255, 0.2);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1rem 0;
    overflow-x: auto;
    font-family: 'Fira Code', monospace;
    font-size: 0.875rem;
    line-height: 1.5;
  }
  
  .enhanced-html-content pre code {
    background: none;
    padding: 0;
    color: #e2e8f0;
    border: none;
  }
  
  .enhanced-html-content hr {
    border: none;
    border-top: 1px solid rgba(114, 134, 255, 0.3);
    margin: 1rem 0;
  }
  
  .enhanced-html-content strong {
    font-weight: 600;
    color: #ffffff;
  }
  
  .enhanced-html-content em {
    font-style: italic;
    color: rgba(255, 255, 255, 0.8);
  }
`;

// Inject styles into the document
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}

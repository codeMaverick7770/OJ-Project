import React from 'react';

// Simple, reliable markdown renderer for LeetCode-style problem statements
export class SimpleRenderer {
  
  render(markdown) {
    if (!markdown || typeof markdown !== 'string') {
      return null;
    }

    try {
      // Split into lines and process each line
      const lines = markdown.split('\n');
      const elements = [];
      let currentParagraph = [];
      let inCodeBlock = false;
      let codeBlockContent = [];
      let codeBlockLang = '';
      let inLatexBlock = false;
      let latexContent = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i] || '';
        const trimmedLine = line.trim();

        // Handle code blocks
        if (trimmedLine.startsWith('```')) {
          if (inCodeBlock) {
            // End code block
            if (codeBlockContent.length > 0) {
              elements.push(this.renderCodeBlock(codeBlockContent, codeBlockLang));
            }
            inCodeBlock = false;
            codeBlockContent = [];
            codeBlockLang = '';
          } else {
            // Start code block
            if (currentParagraph.length > 0) {
              elements.push(this.renderParagraph(currentParagraph));
              currentParagraph = [];
            }
            codeBlockLang = trimmedLine.slice(3).trim();
            inCodeBlock = true;
          }
          continue;
        }

        // Handle LaTeX blocks
        if (trimmedLine === '$$') {
          if (inLatexBlock) {
            // End LaTeX block
            if (latexContent.length > 0) {
              elements.push(this.renderLatexBlock(latexContent));
            }
            inLatexBlock = false;
            latexContent = [];
          } else {
            // Start LaTeX block
            if (currentParagraph.length > 0) {
              elements.push(this.renderParagraph(currentParagraph));
              currentParagraph = [];
            }
            inLatexBlock = true;
          }
          continue;
        }

        if (inCodeBlock) {
          codeBlockContent.push(line);
        } else if (inLatexBlock) {
          latexContent.push(line);
        } else {
          // Regular markdown processing
          if (trimmedLine === '') {
            // Empty line - end current paragraph
            if (currentParagraph.length > 0) {
              elements.push(this.renderParagraph(currentParagraph));
              currentParagraph = [];
            }
          } else if (trimmedLine.startsWith('#')) {
            // Heading
            if (currentParagraph.length > 0) {
              elements.push(this.renderParagraph(currentParagraph));
              currentParagraph = [];
            }
            elements.push(this.renderHeading(trimmedLine));
          } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
            // List item
            if (currentParagraph.length > 0) {
              elements.push(this.renderParagraph(currentParagraph));
              currentParagraph = [];
            }
            elements.push(this.renderListItem(trimmedLine));
          } else {
            // Regular paragraph content
            currentParagraph.push(line);
          }
        }
      }

      // Handle remaining content
      if (currentParagraph.length > 0) {
        elements.push(this.renderParagraph(currentParagraph));
      }

      return elements;
    } catch (error) {
      console.error('SimpleRenderer error:', error);
      // Fallback: return raw text
      return React.createElement('p', { 
        className: 'text-white/90 leading-relaxed' 
      }, markdown);
    }
  }

  renderHeading(line) {
    const level = line.match(/^#+/)[0].length;
    const text = line.replace(/^#+\s*/, '');
    const Tag = `h${Math.min(level, 6)}`;
    
    let className = 'font-bold text-white mb-4';
    if (level === 1) className += ' text-2xl';
    else if (level === 2) className += ' text-xl';
    else if (level === 3) className += ' text-lg';
    else className += ' text-base';

    return React.createElement(Tag, { 
      key: `heading-${Math.random()}`,
      className 
    }, this.processInlineFormatting(text));
  }

  renderParagraph(lines) {
    if (lines.length === 0) return null;
    
    const content = lines.join('\n');
    return React.createElement('p', {
      key: `para-${Math.random()}`,
      className: 'text-white/90 leading-relaxed mb-3'
    }, this.processInlineFormatting(content));
  }

  renderListItem(line) {
    const text = line.replace(/^[-*]\s*/, '');
    return React.createElement('li', {
      key: `list-${Math.random()}`,
      className: 'text-white/90 leading-relaxed ml-4 mb-1'
    }, this.processInlineFormatting(text));
  }

  renderCodeBlock(lines, language) {
    const code = lines.join('\n');
    return React.createElement('div', {
      key: `code-${Math.random()}`,
      className: 'mb-4'
    }, [
      language && React.createElement('div', {
        key: 'lang',
        className: 'text-xs text-white/60 mb-1 px-2 py-1 bg-[#2a2a3d] rounded-t font-mono'
      }, language),
      React.createElement('pre', {
        key: 'code',
        className: 'bg-[#1a1a2e] border border-[#7286ff]/20 rounded-lg p-4 overflow-x-auto text-sm font-mono text-white/90'
      }, code)
    ]);
  }

  renderLatexBlock(lines) {
    const latex = lines.join('\n');
    return React.createElement('div', {
      key: `latex-${Math.random()}`,
      className: 'my-4 p-4 bg-[#1a1a2e] border border-[#7286ff]/20 rounded-lg text-center overflow-x-auto'
    }, [
      React.createElement('div', {
        key: 'label',
        className: 'text-xs text-white/60 mb-2'
      }, 'LaTeX Math'),
      React.createElement('div', {
        key: 'math',
        className: 'text-lg text-white/90 font-mono'
      }, `$$${latex}$$`)
    ]);
  }

  processInlineFormatting(text) {
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
          parts.push(React.createElement('span', {
            key: `latex-${Math.random()}`,
            className: 'font-mono text-[#7286ff]'
          }, `$${latex}$`));
          lastIndex = i + 1;
          inLatex = false;
        }
      }
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    // Process bold (**text**)
    const processedParts = parts.map(part => {
      if (typeof part === 'string') {
        return this.processBoldAndItalic(part);
      }
      return part;
    });

    return processedParts.length === 1 ? processedParts[0] : processedParts;
  }

  processBoldAndItalic(text) {
    // Process bold (**text**)
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Process italic (*text*)
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Process inline code (`code`)
    text = text.replace(/`(.*?)`/g, '<code class="bg-[#2a2a3d] px-1 py-0.5 rounded text-sm font-mono">$1</code>');
    
    return React.createElement('span', {
      dangerouslySetInnerHTML: { __html: text }
    });
  }
}

export const simpleRenderer = new SimpleRenderer();

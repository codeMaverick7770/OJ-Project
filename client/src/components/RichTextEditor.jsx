import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Minus,
  Superscript,
  Subscript,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo
} from 'lucide-react';

const RichTextEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'Start writing your problem description...',
  className = ''
}) => {
  const [content, setContent] = useState(value);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const editorRef = useRef(null);
  const [history, setHistory] = useState([value]);
  const [historyIndex, setHistoryIndex] = useState(0);

  useEffect(() => {
    setContent(value);
  }, [value]);

  useEffect(() => {
    if (onChange) {
      onChange(content);
    }
  }, [content, onChange]);

  const saveToHistory = (newContent) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newContent);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const execCommand = (command, value = null) => {
    editorRef.current.focus();
    
    if (command === 'insertText') {
      document.execCommand('insertText', false, value);
    } else if (command === 'formatBlock') {
      document.execCommand('formatBlock', false, value);
    } else {
      document.execCommand(command, false, value);
    }
    
    updateContent();
  };

  const insertLaTeX = (type) => {
    editorRef.current.focus();
    const text = type === 'inline' ? '$...$' : '$$\n...\n$$';
    document.execCommand('insertText', false, text);
    
    // Position cursor in the middle
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (type === 'inline') {
        range.setStart(range.startContainer, range.startOffset - 2);
        range.setEnd(range.startContainer, range.startOffset - 2);
      } else {
        range.setStart(range.startContainer, range.startOffset - 3);
        range.setEnd(range.startContainer, range.startOffset - 3);
      }
      selection.removeAllRanges();
      selection.addRange(range);
    }
    
    updateContent();
  };

  const insertCodeBlock = () => {
    editorRef.current.focus();
    const text = '```\n// Your code here\n```';
    document.execCommand('insertText', false, text);
    
    // Position cursor in the middle
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.setStart(range.startContainer, range.startOffset - 20);
      range.setEnd(range.startContainer, range.startOffset - 20);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    
    updateContent();
  };

  const updateContent = () => {
    const newContent = editorRef.current.innerHTML;
    if (newContent !== content) {
      setContent(newContent);
      saveToHistory(newContent);
    }
  };

  const handleInput = () => {
    updateContent();
  };

  const handleKeyDown = (e) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
          break;
      }
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setContent(history[newIndex]);
      if (onChange) onChange(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setContent(history[newIndex]);
      if (onChange) onChange(history[newIndex]);
    }
  };

  const ToolbarButton = ({ 
    icon: Icon, 
    onClick, 
    title, 
    active = false,
    disabled = false 
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`
        p-2 rounded-md transition-all duration-200 hover:bg-white/10 
        ${active ? 'bg-[#7286ff]/20 text-[#7286ff]' : 'text-white/70 hover:text-white'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <Icon size={18} />
    </button>
  );

  const ToolbarSeparator = () => (
    <div className="w-px h-8 bg-white/20 mx-2" />
  );

  return (
    <div className={`rich-text-editor ${className}`}>
      {/* Toolbar */}
      <div className="bg-[#1c1c2a] border border-[#7286ff]/20 rounded-t-lg p-3 flex flex-wrap items-center gap-1">
        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={Bold}
            onClick={() => execCommand('bold')}
            title="Bold (Ctrl+B)"
          />
          <ToolbarButton
            icon={Italic}
            onClick={() => execCommand('italic')}
            title="Italic (Ctrl+I)"
          />
          <ToolbarButton
            icon={Underline}
            onClick={() => execCommand('underline')}
            title="Underline (Ctrl+U)"
          />
        </div>

        <ToolbarSeparator />

        {/* Headings */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={Heading1}
            onClick={() => execCommand('formatBlock', '<h1>')}
            title="Heading 1"
          />
          <ToolbarButton
            icon={Heading2}
            onClick={() => execCommand('formatBlock', '<h2>')}
            title="Heading 2"
          />
          <ToolbarButton
            icon={Heading3}
            onClick={() => execCommand('formatBlock', '<h3>')}
            title="Heading 3"
          />
        </div>

        <ToolbarSeparator />

        {/* Lists */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={List}
            onClick={() => execCommand('insertUnorderedList')}
            title="Bullet List"
          />
          <ToolbarButton
            icon={ListOrdered}
            onClick={() => execCommand('insertOrderedList')}
            title="Numbered List"
          />
        </div>

        <ToolbarSeparator />

        {/* Code & LaTeX */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={Code}
            onClick={insertCodeBlock}
            title="Code Block"
          />
          <ToolbarButton
            icon={Superscript}
            onClick={() => insertLaTeX('inline')}
            title="Inline LaTeX ($...$)"
          />
          <ToolbarButton
            icon={Subscript}
            onClick={() => insertLaTeX('block')}
            title="Block LaTeX ($$...$$)"
          />
        </div>

        <ToolbarSeparator />

        {/* Alignment */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={AlignLeft}
            onClick={() => execCommand('justifyLeft')}
            title="Align Left"
          />
          <ToolbarButton
            icon={AlignCenter}
            onClick={() => execCommand('justifyCenter')}
            title="Align Center"
          />
          <ToolbarButton
            icon={AlignRight}
            onClick={() => execCommand('justifyRight')}
            title="Align Right"
          />
        </div>

        <ToolbarSeparator />

        {/* Other */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={Quote}
            onClick={() => execCommand('formatBlock', '<blockquote>')}
            title="Quote Block"
          />
          <ToolbarButton
            icon={Minus}
            onClick={() => execCommand('insertHorizontalRule')}
            title="Horizontal Rule"
          />
        </div>

        <ToolbarSeparator />

        {/* History */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={Undo}
            onClick={undo}
            disabled={historyIndex === 0}
            title="Undo (Ctrl+Z)"
          />
          <ToolbarButton
            icon={Redo}
            onClick={redo}
            disabled={historyIndex === history.length - 1}
            title="Redo (Ctrl+Shift+Z)"
          />
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        dangerouslySetInnerHTML={{ __html: content }}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onBlur={updateContent}
        className="
          min-h-[300px] p-4 bg-[#282846] border border-[#7286ff]/20 rounded-b-lg
          text-white/90 leading-relaxed text-base focus:outline-none focus:ring-2 
          focus:ring-[#7286ff]/50 focus:border-[#7286ff] transition-all duration-200
          prose prose-invert prose-sm max-w-none
        "
        style={{
          fontFamily: 'Inter, system-ui, sans-serif'
        }}
        data-placeholder={placeholder}
      />

      {/* Character Count */}
      <div className="mt-2 text-xs text-white/50 text-right">
        {content.replace(/<[^>]*>/g, '').length} characters
      </div>

      <style jsx>{`
        .rich-text-editor [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: rgba(255, 255, 255, 0.3);
          pointer-events: none;
        }
        
        .rich-text-editor h1 {
          font-size: 1.875rem;
          font-weight: 700;
          margin: 1rem 0 0.5rem 0;
          color: #ffffff;
        }
        
        .rich-text-editor h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0.75rem 0 0.5rem 0;
          color: #ffffff;
        }
        
        .rich-text-editor h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0.5rem 0 0.25rem 0;
          color: #ffffff;
        }
        
        .rich-text-editor p {
          margin: 0.5rem 0;
          line-height: 1.6;
        }
        
        .rich-text-editor ul, .rich-text-editor ol {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }
        
        .rich-text-editor li {
          margin: 0.25rem 0;
        }
        
        .rich-text-editor blockquote {
          border-left: 4px solid #7286ff;
          margin: 1rem 0;
          padding-left: 1rem;
          font-style: italic;
          color: #a0aec0;
        }
        
        .rich-text-editor code {
          background: rgba(42, 42, 61, 0.8);
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: 'Fira Code', monospace;
          font-size: 0.875rem;
          color: #7286ff;
        }
        
        .rich-text-editor pre {
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
        
        .rich-text-editor pre code {
          background: none;
          padding: 0;
          color: #e2e8f0;
        }
        
        .rich-text-editor hr {
          border: none;
          border-top: 1px solid rgba(114, 134, 255, 0.3);
          margin: 1rem 0;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;

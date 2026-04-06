import React, { useState, useEffect } from 'react';
import { FormSchema } from '../types';

interface JSONViewProps {
  schema: FormSchema;
  onImport: (schema: FormSchema) => void;
}

export const JSONView: React.FC<JSONViewProps> = ({ schema, onImport }) => {
  const [raw, setRaw] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!editing) {
      setRaw(JSON.stringify(schema, null, 2));
    }
  }, [schema, editing]);

  const handleCopy = () => {
    navigator.clipboard.writeText(raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(raw);
      onImport(parsed);
      setError('');
      setEditing(false);
    } catch {
      setError('Invalid JSON — please fix syntax errors before importing.');
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-5 gap-3 bg-white text-[#2d2d2d]">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <p className="font-display text-[14px] font-bold text-[#2d2d2d]">JSON Schema</p>
          <p className="text-[12px] text-[#8a8a8a]">
            {JSON.stringify(schema).length} chars · {(schema.form.fields || []).length} fields
          </p>
        </div>
        <div className="flex gap-2">
          <Btn onClick={() => setEditing(!editing)} variant={editing ? 'accent' : 'default'}>
            {editing ? '✎ Editing' : '✎ Edit'}
          </Btn>
          {editing && (
            <Btn onClick={handleImport} variant="success">↑ Apply</Btn>
          )}
          <Btn onClick={handleCopy} variant="default">
            {copied ? '✓ Copied!' : '⎘ Copy'}
          </Btn>
        </div>
      </div>

      {error && (
        <div className="px-[14px] py-[10px] bg-[rgba(255,77,109,0.1)] border border-danger rounded-[6px] text-danger text-[12px] flex-shrink-0">
          {error}
        </div>
      )}

      {/* Code area */}
      <div
        className="flex-1 overflow-hidden rounded-[16px] transition-all duration-200"
        style={{
          border: `1px solid ${editing ? '#ffbe0b' : '#e0e0e0'}`,
          boxShadow: editing ? '0 0 0 3px rgba(255,190,11,0.1)' : 'none',
        }}
      >
        {editing ? (
          <textarea
            value={raw}
            onChange={e => { setRaw(e.target.value); setError(''); }}
            spellCheck={false}
            className="w-full h-full bg-white text-[#2d2d2d] border-none outline-none p-4 font-mono text-[12px] leading-[1.7] resize-none"
            style={{ fontFamily: '"Fira Code", "Cascadia Code", "Courier New", monospace', tabSize: 2 }}
          />
        ) : (
          <pre
            className="w-full h-full overflow-y-auto bg-white p-4 text-[12px] leading-[1.7] whitespace-pre m-0 text-[#2d2d2d]"
            style={{ fontFamily: '"Fira Code", "Cascadia Code", "Courier New", monospace' }}
          >
            <SyntaxHighlight code={raw} />
          </pre>
        )}
      </div>
    </div>
  );
};

/* Minimal JSON syntax highlighter */
const SyntaxHighlight: React.FC<{ code: string }> = ({ code }) => {
  const tokens = tokenize(code);
  return (
    <>
      {tokens.map((t, i) => (
        <span key={i} style={{ color: tokenColor(t.type) }}>{t.value}</span>
      ))}
    </>
  );
};

type TokenType = 'key' | 'string' | 'number' | 'boolean' | 'null' | 'punct' | 'ws';
interface Token { type: TokenType; value: string; }

function tokenColor(type: TokenType): string {
  switch (type) {
    case 'key': return '#0066cc';
    case 'string': return '#22aa22';
    case 'number': return '#ff6600';
    case 'boolean': return '#d63384';
    case 'null': return '#666666';
    case 'punct': return '#999999';
    default: return '#2d2d2d';
  }
}

function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < code.length) {
    const wsMatch = code.slice(i).match(/^[\s]+/);
    if (wsMatch) { tokens.push({ type: 'ws', value: wsMatch[0] }); i += wsMatch[0].length; continue; }

    if (code[i] === '"') {
      let j = i + 1;
      while (j < code.length && !(code[j] === '"' && code[j - 1] !== '\\')) j++;
      j++;
      const val = code.slice(i, j);
      let k = j;
      while (k < code.length && (code[k] === ' ' || code[k] === '\t')) k++;
      const isKey = code[k] === ':';
      tokens.push({ type: isKey ? 'key' : 'string', value: val });
      i = j;
      continue;
    }
    const numMatch = code.slice(i).match(/^-?\d+(\.\d+)?([eE][+-]?\d+)?/);
    if (numMatch) { tokens.push({ type: 'number', value: numMatch[0] }); i += numMatch[0].length; continue; }
    const boolMatch = code.slice(i).match(/^(true|false|null)/);
    if (boolMatch) {
      tokens.push({ type: boolMatch[0] === 'null' ? 'null' : 'boolean', value: boolMatch[0] });
      i += boolMatch[0].length;
      continue;
    }
    tokens.push({ type: 'punct', value: code[i] });
    i++;
  }
  return tokens;
}

const Btn: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'accent' | 'success';
}> = ({ children, onClick, variant = 'default' }) => {
  const styles = {
    accent: { bg: '#fff8e1', color: '#ffbe0b', border: '#ffbe0b' },
    success: { bg: 'rgba(22,163,74,0.1)', color: '#16a34a', border: '#16a34a' },
    default: { bg: '#f9f9f9', color: '#2d2d2d', border: '#e0e0e0' },
  }[variant];

  return (
    <button
      onClick={onClick}
      className="px-[14px] py-[7px] rounded-[6px] text-[12px] font-display font-semibold cursor-pointer transition-all duration-200"
      style={{
        background: styles.bg,
        color: styles.color,
        border: `1px solid ${styles.border}`,
      }}
    >
      {children}
    </button>
  );
};

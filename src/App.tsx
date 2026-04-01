import React, { useState, useCallback } from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";import { FormSchema, FormField, FieldType, ActiveTab } from './types';
import { INITIAL_SCHEMA, createDefaultField, generateFieldId, downloadJSON } from './utils/helpers';
import { FieldPalette } from './components/FieldPalette';
import { BuilderCanvas } from './components/BuilderCanvas';
import { FieldEditor } from './components/FieldEditor';
import { FormSettings } from './components/FormSettings';
import { FormPreview } from './components/FormPreview';
import { JSONView } from './components/JSONView';

export default function App() {
  const [schema, setSchema] = useState<FormSchema>(INITIAL_SCHEMA);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('builder');
  const [rightPanel, setRightPanel] = useState<'field' | 'settings'>('settings');

  const fields = schema.form.fields || [];
  const selectedField = fields.find(f => f.id === selectedFieldId) || null;

  const updateFields = useCallback((next: FormField[]) => {
    setSchema(s => ({ ...s, form: { ...s.form, fields: next } }));
  }, []);

  const handleAddField = useCallback((type: FieldType) => {
    const id = generateFieldId();
    const field = createDefaultField(type, id);
    updateFields([...fields, field]);
    setSelectedFieldId(id);
    setRightPanel('field');
  }, [fields, updateFields]);

  const handleDeleteField = useCallback((id: string) => {
    updateFields(fields.filter(f => f.id !== id));
    if (selectedFieldId === id) setSelectedFieldId(null);
  }, [fields, selectedFieldId, updateFields]);

  const handleMoveField = useCallback((id: string, dir: 'up' | 'down') => {
    const idx = fields.findIndex(f => f.id === id);
    if (idx === -1) return;
    const next = [...fields];
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= next.length) return;
    [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
    updateFields(next);
  }, [fields, updateFields]);

  const handleFieldChange = useCallback((updated: FormField) => {
    updateFields(fields.map(f => f.id === updated.id ? updated : f));
  }, [fields, updateFields]);

  const handleReorderFields = useCallback((reorderedFields: FormField[]) => {
    updateFields(reorderedFields);
  }, [updateFields]);

  const handleSelectField = useCallback((id: string) => {
    setSelectedFieldId(id);
    setRightPanel('field');
  }, []);

  const handleImportSchema = useCallback((imported: FormSchema) => {
    setSchema(imported);
    setSelectedFieldId(null);
  }, []);

  const handleClearAll = () => {
    if (fields.length === 0 || confirm('Clear all fields?')) {
      updateFields([]);
      setSelectedFieldId(null);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-bg-base">
      {/* ── Top Bar ── */}
      <header className="h-[52px] min-h-[52px] flex items-center justify-between px-5 bg-bg-surface border-b border-border-default z-10 flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-[10px]">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[13px] font-extrabold text-white flex-shrink-0 font-display"
            style={{
              background: 'linear-gradient(135deg, #6c63ff, #ff6b9d)',
              boxShadow: '0 2px 10px rgba(108,99,255,0.4)',
            }}
          >F</div>
          <span
            className="font-display font-extrabold text-base tracking-tight"
            style={{
              background: 'linear-gradient(90deg, #f0f0fa, #9090aa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >FormBuilder</span>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-bg-elevated border border-border-default rounded-[10px] p-[3px] gap-[2px]">
          {(['builder', 'preview', 'json'] as ActiveTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-[5px] rounded-[6px] font-display font-semibold text-[12px] cursor-pointer transition-all duration-200 tracking-wider capitalize border ${
                activeTab === tab
                  ? 'bg-bg-overlay border-border-light-custom text-text-primary'
                  : 'bg-transparent border-transparent text-text-muted'
              }`}
            >
              {tab === 'builder' ? '⚙ Builder' : tab === 'preview' ? '◻ Preview' : '{ } JSON'}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-text-muted bg-bg-elevated px-[10px] py-[3px] rounded-full border border-border-default">
            {fields.length} field{fields.length !== 1 ? 's' : ''}
          </span>
          {activeTab === 'builder' && fields.length > 0 && (
            <HeaderBtn onClick={handleClearAll} danger>✕ Clear</HeaderBtn>
          )}
          <HeaderBtn onClick={() => downloadJSON(schema)} accent>↓ Export JSON</HeaderBtn>
        </div>
      </header>

      {/* ── Main Body ── */}
      <div className="flex-1 overflow-hidden">

        {/* Builder layout */}
        {activeTab === 'builder' && (
          <PanelGroup direction="horizontal" className="w-full h-full">
            {/* Left: Field Palette */}
            <Panel defaultSize={15} minSize={10} maxSize={30} className="overflow-hidden">
              <FieldPalette onAddField={handleAddField} />
            </Panel>

            {/* Resize handle between palette and canvas */}
            <PanelResizeHandle 
              className="w-1 transition-all duration-200 cursor-col-resize"
              style={{
                background: 'var(--border-light, #32323f)',
              }}
            />

            {/* Center: Canvas */}
            <Panel defaultSize={60} minSize={30} className="overflow-hidden h-full">
              <BuilderCanvas
                fields={fields}
                selectedId={selectedFieldId}
                onSelectField={handleSelectField}
                onDeleteField={handleDeleteField}
                onMoveField={handleMoveField}
                onAddField={handleAddField}
                onReorderFields={handleReorderFields}
                formTitle={schema.form.title || schema.form.key}
              />
            </Panel>

            {/* Resize handle between canvas and editor */}
            <PanelResizeHandle 
              className="w-1 transition-all duration-200 cursor-col-resize"
              style={{
                background: 'var(--border-light, #32323f)',
              }}
            />

            {/* Right: Editor Panel */}
            <Panel defaultSize={25} minSize={15} maxSize={50} className="overflow-hidden bg-bg-surface border-l border-border-default flex flex-col">
              <aside className="h-full flex flex-col overflow-hidden">
                {/* Panel tab switcher */}
                <div className="flex border-b border-border-default flex-shrink-0">
                  {(['settings', 'field'] as const).map(panel => (
                    <button
                      key={panel}
                      onClick={() => setRightPanel(panel)}
                      className={`flex-1 py-[10px] px-2 font-display font-semibold text-[11px] cursor-pointer transition-all duration-200 tracking-[0.06em] uppercase border-b-2 border-t-0 border-l-0 border-r-0 ${
                        rightPanel === panel
                          ? 'bg-bg-elevated border-accent text-text-primary'
                          : 'bg-transparent border-transparent text-text-muted'
                      }`}
                    >
                      {panel === 'settings' ? '⚙ Form' : '✎ Field'}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-hidden">
                  {rightPanel === 'settings' ? (
                    <FormSettings schema={schema} onChange={setSchema} />
                  ) : selectedField ? (
                    <FieldEditor field={selectedField} onChange={handleFieldChange} />
                  ) : (
                    <NoFieldSelected onShowSettings={() => setRightPanel('settings')} />
                  )}
                </div>
              </aside>
            </Panel>
          </PanelGroup>
        )}

        {/* Preview tab */}
        {activeTab === 'preview' && (
          <FormPreview schema={schema} />
        )}

        {/* JSON tab */}
        {activeTab === 'json' && (
          <JSONView schema={schema} onImport={handleImportSchema} />
        )}
      </div>
    </div>
  );
}

/* ── Sub components ── */

const HeaderBtn: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  accent?: boolean;
  danger?: boolean;
}> = ({ children, onClick, accent, danger }) => (
  <button
    onClick={onClick}
    className={`px-[14px] py-[6px] rounded-[6px] font-display font-bold text-[12px] cursor-pointer transition-all duration-200 border ${
      accent
        ? 'bg-accent border-accent text-white shadow-accent hover:opacity-[0.88]'
        : danger
        ? 'bg-transparent border-border-default text-danger hover:bg-[rgba(255,77,109,0.1)] hover:border-danger'
        : 'bg-bg-elevated border-border-default text-text-secondary'
    }`}
  >
    {children}
  </button>
);

const NoFieldSelected: React.FC<{ onShowSettings: () => void }> = ({ onShowSettings }) => (
  <div className="p-6 flex flex-col items-center justify-center h-full gap-3 text-center">
    <div className="w-11 h-11 rounded-[10px] bg-bg-overlay border border-border-default flex items-center justify-center text-[20px] text-text-muted">☐</div>
    <p className="font-display text-[13px] font-bold text-text-secondary">No field selected</p>
    <p className="text-[12px] text-text-muted max-w-[180px]">
      Click a field on the canvas to edit its properties.
    </p>
    <button
      onClick={onShowSettings}
      className="mt-1 px-4 py-[7px] bg-[rgba(108,99,255,0.1)] border border-border-focus rounded-[6px] text-accent text-[12px] cursor-pointer font-display font-semibold"
    >
      ⚙ Edit Form Settings
    </button>
  </div>
);

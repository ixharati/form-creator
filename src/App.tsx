import React, { useState, useCallback, useEffect } from 'react';
import { FormSchema, FormField, FieldType, ActiveTab, FormRow } from './types';
import { INITIAL_SCHEMA, createDefaultField, generateFieldId, downloadJSON, migrateFieldsToRows, getAllFields, createDefaultRow } from './utils/helpers';
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

  // Migrate legacy fields to rows on load
  useEffect(() => {
    if (schema.form.fields && schema.form.fields.length > 0 && !schema.form.rows) {
      const rows = migrateFieldsToRows(schema.form.fields);
      setSchema(s => ({ ...s, form: { ...s.form, rows, fields: undefined } }));
    }
  }, [schema.form.fields, schema.form.rows]);

  const rows = schema.form.rows || [];
  const fields = getAllFields(rows);
  const selectedField = fields.find(f => f.id === selectedFieldId) || null;

  const updateRows = useCallback((next: FormRow[]) => {
    setSchema(s => ({ ...s, form: { ...s.form, rows: next } }));
  }, []);

  const handleAddField = useCallback((type: FieldType) => {
    const id = generateFieldId();
    const field = createDefaultField(type, id);
    // Add to first empty column, or create new row
    const newRows = [...rows];
    let added = false;
    for (const row of newRows) {
      for (const col of row.columns) {
        if (!col.field) {
          col.field = field;
          added = true;
          break;
        }
      }
      if (added) break;
    }
    if (!added) {
      // Create new row with single column
      const newRow = createDefaultRow([100]);
      newRow.columns[0].field = field;
      newRows.push(newRow);
    }
    updateRows(newRows);
    setSelectedFieldId(id);
    setRightPanel('field');
  }, [rows, updateRows]);

  const handleDeleteField = useCallback((id: string) => {
    const newRows = rows.map(row => ({
      ...row,
      columns: row.columns.map(col => col.field?.id === id ? { ...col, field: undefined } : col)
    }));
    updateRows(newRows);
    if (selectedFieldId === id) setSelectedFieldId(null);
  }, [rows, selectedFieldId, updateRows]);

  const handleMoveField = useCallback((id: string, dir: 'up' | 'down') => {
    // For now, simple move within rows
    const allFields = getAllFields(rows);
    const idx = allFields.findIndex(f => f.id === id);
    if (idx === -1) return;
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= allFields.length) return;
    // Swap fields
    const field1 = allFields[idx];
    const field2 = allFields[swapIdx];
    const newRows = rows.map(row => ({
      ...row,
      columns: row.columns.map(col => {
        if (col.field?.id === field1.id) return { ...col, field: field2 };
        if (col.field?.id === field2.id) return { ...col, field: field1 };
        return col;
      })
    }));
    updateRows(newRows);
  }, [rows, updateRows]);

  const handleAddRow = useCallback((columnWidths: number[]) => {
    const newRow = createDefaultRow(columnWidths);
    updateRows([...rows, newRow]);
  }, [rows, updateRows]);

  const handleFieldChange = useCallback((updated: FormField) => {
    const newRows = rows.map(row => ({
      ...row,
      columns: row.columns.map(col =>
        col.field?.id === updated.id ? { ...col, field: updated } : col
      )
    }));
    updateRows(newRows);
  }, [rows, updateRows]);

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
      updateRows([]);
      setSelectedFieldId(null);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg--bg-base">
      {/* ── Top Bar ── */}
      <header className="h-[52px] min-h-[52px] flex items-center justify-between px-5 bg-bg-primary border-b border-border-default z-10 flex-shrink-0">
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
          >FormCreator</span>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-bg-primary border border-border-default rounded-[10px] p-[3px] gap-[2px]">
          {(['builder', 'preview', 'json'] as ActiveTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-[5px] bg--bg-primary rounded-[6px] font-display font-semibold text-[12px] cursor-pointer transition-all duration-200 tracking-wider capitalize border ${
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
          <span className="text-[11px] text-text-muted bg-[#ffbe0b] px-[10px] py-[3px] rounded-full border border-border-default">
            {fields.length} field{fields.length !== 1 ? 's' : ''}
          </span>
          {activeTab === 'builder' && fields.length > 0 && (
            <HeaderBtn onClick={handleClearAll} danger>✕ Clear</HeaderBtn>
          )}
          <HeaderBtn onClick={() => downloadJSON(schema)} accent> Export JSON</HeaderBtn>
        </div>
      </header>

      {/* ── Main Body ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* Builder layout */}
        {activeTab === 'builder' && (
          <>
            {/* Left: Field Palette */}
            <FieldPalette onAddField={handleAddField} onAddRow={handleAddRow} />
            

            {/* Center: Canvas */}
            <BuilderCanvas
              rows={rows}
              selectedId={selectedFieldId}
              onSelectField={handleSelectField}
              onDeleteField={handleDeleteField}
              onMoveField={handleMoveField}
              onAddField={handleAddField}
              onReorderRows={updateRows}
              formTitle={schema.form.title || schema.form.key}
            />

            {/* Right: Editor Panel */}
            <aside className="w-[260px] min-w-[260px] bg-bg-surface border-l border-border-default flex flex-col overflow-hidden">
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
          </>
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
    className={`px-[14px] py-[6px] rounded-[6px] text-black font-bold text-[12px] cursor-pointer transition-all duration-200 border ${
      accent
        ? 'bg-[#ffbe0b] border-accent text-white shadow-primary hover:opacity-[0.88]'
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
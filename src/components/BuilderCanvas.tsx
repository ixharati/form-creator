import React from 'react';
import { FormField, FieldType } from '../types';
import { FieldCard } from './FieldCard';
import { FIELD_LABELS } from '../utils/helpers';
import { createDefaultField, generateFieldId } from '../utils/helpers';

interface BuilderCanvasProps {
  fields: FormField[];
  selectedId: string | null;
  onSelectField: (id: string) => void;
  onDeleteField: (id: string) => void;
  onMoveField: (id: string, dir: 'up' | 'down') => void;
  onAddField: (type: FieldType) => void;
  formTitle: string;
}

export const BuilderCanvas: React.FC<BuilderCanvasProps> = ({
  fields,
  selectedId,
  onSelectField,
  onDeleteField,
  onMoveField,
  onAddField,
  formTitle,
}) => {
  const [dragOver, setDragOver] = React.useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const type = e.dataTransfer.getData('fieldType') as FieldType;
    if (type) onAddField(type);
  };

  return (
    <div
      className="flex-1 overflow-hidden flex flex-col bg-bg-base"
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      {/* Canvas header */}
      <div className="px-5 py-[14px] border-b border-border-default bg-bg-surface flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-[10px]">
          <div
            className="w-2 h-2 rounded-full bg-accent"
            style={{ boxShadow: '0 0 8px var(--accent, #6c63ff)' }}
          />
          <span className="font-display text-[14px] font-bold text-text-primary">
            {formTitle || 'Form Builder'}
          </span>
        </div>
        <span className="text-[11px] text-text-muted bg-bg-overlay px-[10px] py-[3px] rounded-full border border-border-default">
          {fields.length} field{fields.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Drop zone / field list */}
      <div
        className={`flex-1 overflow-y-auto p-5 flex flex-col gap-2 ${
          dragOver ? 'outline outline-2 outline-dashed outline-accent -outline-offset-1 rounded-[10px]' : ''
        }`}
      >
        {fields.length === 0 ? (
          <div
            className={`flex-1 flex flex-col items-center justify-center gap-[14px] p-10 border-2 border-dashed border-border-default rounded-[24px] transition-all duration-200 min-h-[300px] ${
              dragOver ? 'bg-[rgba(108,99,255,0.1)]' : 'bg-transparent'
            }`}
          >
            <div className="w-[52px] h-[52px] rounded-[16px] bg-bg-elevated border border-border-default flex items-center justify-center text-[22px]">+</div>
            <div className="text-center">
              <p className="font-display text-[15px] font-bold text-text-secondary mb-1">Add your first field</p>
              <p className="text-[12px] text-text-muted max-w-[240px]">
                Click any field type in the panel or drag it here to start building your form.
              </p>
            </div>
            <div className="flex gap-2 flex-wrap justify-center max-w-[300px]">
              {(['text', 'select', 'checkbox', 'date'] as FieldType[]).map(type => (
                <button
                  key={type}
                  onClick={() => onAddField(type)}
                  className="px-[14px] py-[6px] bg-[rgba(108,99,255,0.1)] border border-border-focus rounded-full text-accent text-[12px] cursor-pointer font-display font-semibold"
                >
                  + {FIELD_LABELS[type]}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {fields.map((field, idx) => (
              <FieldCard
                key={field.id}
                field={field}
                index={idx}
                isSelected={selectedId === field.id}
                onSelect={() => onSelectField(field.id)}
                onDelete={() => onDeleteField(field.id)}
                onMoveUp={() => onMoveField(field.id, 'up')}
                onMoveDown={() => onMoveField(field.id, 'down')}
                isFirst={idx === 0}
                isLast={idx === fields.length - 1}
              />
            ))}
            {/* Drop hint at bottom */}
            <div className="border border-dashed border-border-default rounded-[10px] p-3 text-center text-text-muted text-[11px] mt-1">
              + Click field type to add more
            </div>
          </>
        )}
      </div>
    </div>
  );
};

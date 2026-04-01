import React from 'react';
import { FormField, FieldType, FormRow } from '../types';
import { FieldCard } from './FieldCard';
import { FIELD_LABELS } from '../utils/helpers';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface BuilderCanvasProps {
  rows: FormRow[];
  selectedId: string | null;
  onSelectField: (id: string) => void;
  onDeleteField: (id: string) => void;
  onMoveField: (id: string, dir: 'up' | 'down') => void;
  onAddField: (type: FieldType) => void;
  onReorderRows?: (reorderedRows: FormRow[]) => void;
  formTitle: string;
}

export const BuilderCanvas: React.FC<BuilderCanvasProps> = ({
  rows,
  selectedId,
  onSelectField,
  onDeleteField,
  onMoveField,
  onAddField,
  onReorderRows,
  formTitle,
}) => {
  const [dragOver, setDragOver] = React.useState(false);
  const scrollableNodeRef = React.useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = rows.findIndex(r => r.id === active.id);
      const newIndex = rows.findIndex(r => r.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(rows, oldIndex, newIndex);
        onReorderRows?.(reordered);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const type = e.dataTransfer.getData('fieldType') as FieldType;
    if (type) onAddField(type);
  };

  return (
    <div
      className="h-full w-full flex overflow-hidden flex-col bg-white"
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      {/* Canvas header */}
      <div className="px-5 py-[14px] border-b border-[#e0e0e0] bg-[#ffbe0b] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-[10px]">
          <div
            className="w-2 h-2 rounded-full bg-[#2d2d2d]"
            style={{ boxShadow: '0 0 8px rgba(45,45,45,0.3)' }}
          />
          <span className="font-display text-[14px] font-bold text-[#2d2d2d]">
            {formTitle || 'Form Builder'}
          </span>
        </div>

        <span className="text-[11px] text-[#2d2d2d] bg-white/40 px-[10px] py-[3px] rounded-full border border-white/60">
          {rows.flatMap(r => r.columns).filter(c => c.field).length} field{rows.flatMap(r => r.columns).filter(c => c.field).length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Drop zone / field list */}
      <div
        ref={scrollableNodeRef}
        className={`flex-1 min-h-0 overflow-y-auto p-5 flex flex-col gap-2 ${
          dragOver
            ? 'outline outline-2 outline-dashed outline-[#ffbe0b] -outline-offset-1 rounded-[10px] bg-[#fff8e1]'
            : ''
        }`}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          {rows.length === 0 || rows.every(r => r.columns.every(c => !c.field)) ? (
            <div
              className={`flex-1 flex flex-col items-center justify-center gap-[14px] p-10 border-2 border-dashed border-[#e0e0e0] rounded-[24px] transition-all duration-200 min-h-[300px] ${
                dragOver ? 'bg-[#fff8e1]' : 'bg-white'
              }`}
            >
              <div className="w-[52px] h-[52px] rounded-[16px] bg-[#f9f9f9] border border-[#e0e0e0] flex items-center justify-center text-[22px] text-[#ffbe0b]">+</div>
              <div className="text-center">
                <p className="font-display text-[15px] font-bold text-[#2d2d2d] mb-1">Add your first field</p>
                <p className="text-[12px] text-[#8a8a8a] max-w-[240px]">
                  Click any field type in the panel or drag it here to start building your form.
                </p>
              </div>
              <div className="flex gap-2 flex-wrap justify-center max-w-[300px]">
                {(['text', 'select', 'checkbox', 'datetime'] as FieldType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => onAddField(type)}
                    className="
                      px-[14px] py-[6px]
                      bg-[#fff8e1]
                      border border-[#ffbe0b]
                      rounded-full
                      text-[#ffbe0b]
                      text-[12px]
                      cursor-pointer
                      font-display font-semibold
                      transition-all duration-200
                      hover:bg-[#ffbe0b] hover:text-[#2d2d2d]
                    "
                  >
                    + {FIELD_LABELS[type]}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 w-full">
              <SortableContext
                items={rows.map(r => r.id)}
                strategy={verticalListSortingStrategy}
              >
                {rows.map((row, rowIdx) => (
                  <div key={row.id} className="flex gap-2">
                    {row.columns.map((col, colIdx) => (
                      <div key={col.id} style={{ width: `${col.width}%` }}>
                        {col.field && (() => {
                          const field = col.field!;
                          return (
                            <FieldCard
                              field={field}
                              index={rowIdx * 10 + colIdx}
                              isSelected={selectedId === field.id}
                              onSelect={() => onSelectField(field.id)}
                              onDelete={() => onDeleteField(field.id)}
                              onMoveUp={() => onMoveField(field.id, 'up')}
                              onMoveDown={() => onMoveField(field.id, 'down')}
                              isFirst={rowIdx === 0 && colIdx === 0}
                              isLast={rowIdx === rows.length - 1 && colIdx === row.columns.length - 1}
                            />
                          );
                        })()}
                      </div>
                    ))}
                  </div>
                ))}
              </SortableContext>
              {/* Drop hint at bottom */}
              <div className="border border-dashed border-[#e0e0e0] rounded-[10px] p-3 text-center text-[#8a8a8a] text-[11px] mt-1 flex-shrink-0 bg-white">
                Drag fields to reorder. Click "+" to add more
              </div>
            </div>
          )}
        </DndContext>
      </div>
    </div>
  );
};
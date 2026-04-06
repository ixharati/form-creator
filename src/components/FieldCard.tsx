import React, { useState } from 'react';
import { FormField } from '../types';
import { FIELD_ICONS, FIELD_LABELS } from '../utils/helpers';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface FieldCardProps {
  field: FormField;
  isSelected: boolean;
  index: number;
  onSelect: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const typeColors: Record<string, string> = {
  text: '#064028',
  number: '#064028',
  button: '#064028',
  email: '#064028',
  password: '#064028',
  textarea: '#064028',
  select: '#064028',
  checkbox: '#064028',
  radio: '#064028',
  date: '#064028',
  time: '#064028',
  datetime: '#064028',
  toggle: '#064028',
  range: '#064028',
  file: '#064028',
};

export const FieldCard: React.FC<FieldCardProps> = ({
  field, isSelected, onSelect, onDelete, onMoveUp, onMoveDown, isFirst, isLast,
}) => {
  const [hovered, setHovered] = useState(false);
  const color = typeColors[field.type] || '#6c63ff';

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-[10px] px-4 py-[14px] cursor-pointer transition-all duration-200 relative flex-shrink-0 bg-white border"
      style={{
        borderColor: isSelected ? 'var(--accent)' : 'var(--border-default)',
        boxShadow: isSelected
          ? '0 0 0 2px var(--accent-subtle), var(--shadow-md)'
          : hovered
          ? 'var(--shadow-sm)'
          : isDragging
          ? 'var(--shadow-lg)'
          : 'none',
        ...(style as any),
      }}
    >
      {/* Left accent bar */}
      {isSelected && (
        <div
          className="absolute left-0 top-[10px] bottom-[10px] w-[3px] rounded-r-[3px]"
          style={{ background: 'var(--accent)' }}
        />
      )}

      <div className="flex items-center gap-[10px]" {...attributes} {...listeners}>


        {/* Type badge */}
        <div
          className="w-8 h-8 flex items-center justify-center rounded-[6px] text-[13px] flex-shrink-0 font-bold"
          style={{
            background: 'var(--accent-light)',
            color: 'var(--accent)',
            border: '1px solid var(--border-default)',
          }}
        >
          {FIELD_ICONS[field.type]}
        </div>

        {/* Field info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-[6px]">
            <span className="font-display text-[14px] font-semibold text-text-primary overflow-hidden text-ellipsis whitespace-nowrap">
              {field.label}
            </span>
            {field.validation?.required && (  
              <span className="text-[11px] font-bold flex-shrink-0" style={{ color: '#fe246d' }}>*</span>
            )}
          </div>
          <div className="flex items-center gap-[6px] mt-[2px]">
            <span className="text-[11px] font-semibold tracking-[0.04em] text-accent" style={{ color }}>
              {FIELD_LABELS[field.type]}
            </span>
            {/* {field.width !== undefined && (
              <>
                <span className="text-text-muted text-[10px]">·</span>
                <span className="text-[11px] text-text-muted">{field.width}</span>
              </>
            )} */}
            {field.helpText && (
              <>
                <span className="text-text-muted text-[10px]">·</span>
                <span className="text-[11px] text-text-muted overflow-hidden text-ellipsis whitespace-nowrap max-w-[120px]">
                  {field.helpText}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        {(hovered || isSelected) && (
          <div
            className="flex items-center gap-[2px]"
            onClick={e => e.stopPropagation()}
            data-no-dnd
          >
            <ActionBtn title="Move up" disabled={isFirst} onClick={onMoveUp}>↑</ActionBtn>
            <ActionBtn title="Move down" disabled={isLast} onClick={onMoveDown}>↓</ActionBtn>
            <ActionBtn title="Delete field" onClick={onDelete} danger>✕</ActionBtn>
          </div>
        )}
      </div>
    </div>
  );
};

const ActionBtn: React.FC<{
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}> = ({ children, title, onClick, disabled, danger }) => (
  <button
    title={title}
    disabled={disabled}
    onClick={onClick}
    className={`
      w-[26px] h-[26px] flex items-center justify-center rounded-[5px] text-[12px]
      border transition-all duration-200 font-mono
      ${
        disabled
          ? 'opacity-40 cursor-not-allowed text-text-muted border-border-default'
          : danger
          ? 'cursor-pointer text-white bg-red-500 hover:bg-red-600 border-red-500'
          : 'cursor-pointer text-accent border-border-default hover:bg-[var(--accent-light)] hover:border-accent'
      }
    `}
  >
    {children}
  </button>
);
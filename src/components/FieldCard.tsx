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
  text: '#6c63ff', number: '#ff6b9d', button: '#6c63ff', email: '#00d4aa', password: '#ffb347',
  textarea: '#6c63ff', select: '#ff6b9d', multiselect: '#ff6b9d',
  checkbox: '#00d4aa', radio: '#00d4aa', date: '#ffb347', time: '#ffb347',
  datetime: '#ffb347', toggle: '#6c63ff', range: '#ff6b9d', file: '#00d4aa',
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
      className="rounded-[10px] px-4 py-[14px] cursor-pointer transition-all duration-200 relative flex-shrink-0"
      style={{
        background: isSelected ? '#1e1e28' : '#18181f',
        border: isSelected ? `1px solid ${color}60` : '1px solid #2a2a38',
        boxShadow: isSelected
          ? `0 0 0 2px ${color}30, 0 4px 16px rgba(0,0,0,0.4)`
          : hovered ? '0 1px 3px rgba(0,0,0,0.5)' : isDragging ? '0 8px 24px rgba(0,0,0,0.7)' : 'none',
        animation: 'fadeIn 0.2s ease both',
        ...(style as any),
      }}
    >
      {/* Left accent bar */}
      {isSelected && (
        <div
          className="absolute left-0 top-[10px] bottom-[10px] w-[3px] rounded-r-[3px]"
          style={{ background: color }}
        />
      )}

      <div className="flex items-center gap-[10px]" {...attributes} {...listeners}>
        {/* Type badge */}
        <div
          className="w-8 h-8 flex items-center justify-center rounded-[6px] text-[13px] flex-shrink-0 font-bold"
          style={{
            background: `${color}15`,
            color,
            border: `1px solid ${color}25`,
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
              <span className="text-[11px] font-bold flex-shrink-0" style={{ color: '#ff6b9d' }}>*</span>
            )}
          </div>
          <div className="flex items-center gap-[6px] mt-[2px]">
            <span className="text-[11px] font-semibold tracking-[0.04em]" style={{ color }}>
              {FIELD_LABELS[field.type]}
            </span>
            {field.width !== 'full' && (
              <>
                <span className="text-text-muted text-[10px]">·</span>
                <span className="text-[11px] text-text-muted">{field.width}</span>
              </>
            )}
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
    className={`w-[26px] h-[26px] flex items-center justify-center bg-transparent border border-border-default rounded-[5px] text-[12px] transition-all duration-200 font-mono ${
      disabled
        ? 'opacity-40 cursor-not-allowed text-text-muted'
        : danger
        ? 'cursor-pointer text-danger hover:bg-[rgba(255,77,109,0.1)] hover:border-danger'
        : 'cursor-pointer text-text-secondary hover:bg-bg-hover hover:border-border-light-custom'
    }`}
  >
    {children}
  </button>
);

import React from 'react';
import { FieldType } from '../types';
import { useDragControls } from "motion/react"
import { FIELD_GROUPS, FIELD_ICONS, FIELD_LABELS } from '../utils/helpers';
import {motion} from 'motion/react';

interface FieldPaletteProps {
  onAddField: (type: FieldType) => void;
}

const typeColors: Record<string, string> = {
  text: '#6c63ff',
  number: '#ff6b9d',
  email: '#00d4aa',
  password: '#ffb347',
  button: '#6c63ff',
  textarea: '#6c63ff',
  select: '#ff6b9d',
  multiselect: '#ff6b9d',
  checkbox: '#00d4aa',
  radio: '#00d4aa',
  date: '#ffb347',
  time: '#ffb347',
  datetime: '#ffb347',
  toggle: '#6c63ff',
  range: '#ff6b9d',
  file: '#00d4aa',
};

export const FieldPalette: React.FC<FieldPaletteProps> = ({ onAddField }) => {
  return (
    <aside className="w-[220px] min-w-[220px] bg-bg-surface border-r border-border-default flex flex-col overflow-hidden">
      <div className="px-4 pt-5 pb-3 border-b border-border-default">
        <p className="font-display text-[11px] font-bold tracking-[0.12em] uppercase text-text-muted">Field Types</p>
      </div>

      <div className="flex-1 overflow-y-auto px-[10px] py-3">
        {FIELD_GROUPS.map(group => (
          <div key={group.label} className="mb-[18px]">
            <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-text-muted mb-[6px] pl-[6px]">{group.label}</p>
            <div className="flex flex-col gap-[2px]">
              {group.fields.map(type => (
                <button
                  key={type}
                  onClick={() => onAddField(type)}
                  className="flex items-center gap-[9px] px-[10px] py-[7px] bg-transparent border border-transparent rounded-[6px] text-text-secondary text-[13px] cursor-pointer transition-all duration-200 text-left w-full font-body hover:bg-bg-overlay hover:border-border-default hover:text-text-primary"
                  title={`Add ${FIELD_LABELS[type]}`}
                >
                  <span
                    className="w-[26px] h-[26px] flex items-center justify-center rounded-[6px] text-[12px] flex-shrink-0 font-bold"
                    style={{
                      background: `${typeColors[type]}18`,
                      color: typeColors[type],
                      border: `1px solid ${typeColors[type]}30`,
                    }}
                  >
                    {FIELD_ICONS[type]}
                  </span>
                  <span className="font-normal">{FIELD_LABELS[type]}</span>
                  <span className="ml-auto text-[16px] opacity-30 font-light">+</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.aside>
  );
};

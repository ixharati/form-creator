import React from 'react';
import { FieldType } from '../types';
import { FIELD_GROUPS, FIELD_ICONS, FIELD_LABELS } from '../utils/helpers';
import { motion } from 'framer-motion';

interface FieldPaletteProps {
  onAddField: (type: FieldType) => void;
}

//  Single theme color system (green-based)
const PRIMARY = '#ffbe0b';

export const FieldPalette: React.FC<FieldPaletteProps> = ({ onAddField }) => {
  return (
    <motion.aside className="w-[400px] bg-white border-r border-[#d6e5dd] flex flex-col overflow-hidden">
      
      {/* Header */}
      <div className="px-4 pt-5 pb-3 border-b border-[#d6e5dd] bg-[#ffbe0b]">
        <p className="font-display text-[11px]  font-bold tracking-[0.12em] uppercase text-[#6b8f7a]">
          Field Types
        </p>
      </div>

      {/* Field List */}
      <div className="flex-1 overflow-y-auto px-[10px] py-3">
        {FIELD_GROUPS.map(group => (
          <div key={group.label} className="mb-[18px]">
            
            {/* Group Label */}
            <p className=" font-bold tracking-[0.1em] uppercase mb-[6px] pl-[6px]">
              {group.label}
            </p>

            {/* Fields */}
            <div className="flex flex-col gap-[4px]">
              {group.fields.map(type => (
                <button
                  key={type}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = 'copy';
                    e.dataTransfer.setData('fieldType', type);
                  }}
                  onClick={() => onAddField(type)}
                  className="
                    flex items-center gap-[9px] px-[10px] py-[8px]
                    rounded-[8px] text-[13px] w-full text-left
                    font-body transition-all duration-200
                    border border-transparent
                    text-[#3a5f4a]
                    hover:bg-[rgba(6,64,40,0.08)]
                    hover:border-[#d6e5dd]
                    hover:text-[#064028]
                    active:scale-[0.98]
                  "
                  title={`Add ${FIELD_LABELS[type]}`}
                >
                  
                  {/* Icon */}
                  <span
                    className="w-[26px] h-[26px] flex items-center justify-center rounded-[6px] text-[12px] flex-shrink-0 font-bold"
                    style={{
                      background: 'rgba(6,64,40,0.08)',
                      color: PRIMARY,
                      border: '1px solid rgba(6,64,40,0.2)',
                    }}
                  >
                    {FIELD_ICONS[type]}
                  </span>

                  {/* Label */}
                  <span className="font-medium text-[#064028]">
                    {FIELD_LABELS[type]}
                  </span>

                  {/* Add icon */}
                  <span className="ml-auto text-[16px] opacity-70 font-light text-[#064028]">
                    +
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.aside>
  );
};
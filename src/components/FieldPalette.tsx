import React from 'react';
import { FieldType } from '../types';
import { useDragControls } from "motion/react"
import { FIELD_GROUPS, FIELD_ICONS, FIELD_LABELS } from '../utils/helpers';
<<<<<<< HEAD
import { motion } from 'framer-motion';
=======
import {motion} from 'motion/react';
>>>>>>> 6ab9370 (draggable and 3 screens)

interface FieldPaletteProps {
  onAddField: (type: FieldType) => void;
  onAddRow?: (columnWidths: number[]) => void;
}

//  Single theme color system (green-based)
const PRIMARY = '#ffbe0b';

export const FieldPalette: React.FC<FieldPaletteProps> = ({ onAddField, onAddRow }) => {
  return (
<<<<<<< HEAD
    <motion.aside className="w-[400px] bg-white border-r border-[#e0e0e0] flex flex-col overflow-hidden">
      
      {/* Header */}
      <div className="px-4 pt-5 pb-3 border-b border-[#e0e0e0] bg-white">
        <p className="font-display text-[11px]  font-bold tracking-[0.12em] uppercase text-[#2d2d2d]">
          Field Types
        </p>
=======
    <motion.aside className="w-[220px] min-w-[220px] bg-bg-surface border-r border-border-default flex flex-col overflow-hidden"
    style={{ overflow: 'visible' }}
    >
      <div className="px-4 pt-5 pb-3 border-b border-border-default">
        <p className="font-display text-[11px] font-bold tracking-[0.12em] uppercase text-text-muted">Field Types</p>
>>>>>>> 6ab9370 (draggable and 3 screens)
      </div>

      {/* Layout Controls */}
      {onAddRow && (
        <div className="px-[10px] py-3 border-b border-[#d6e5dd]">
          <p className="font-bold tracking-[0.1em] uppercase mb-[6px] pl-[6px] text-[11px]">
            Layout
          </p>
          <div className="flex flex-col gap-[4px]">
            <button
              onClick={() => onAddRow([100])}
              className="flex items-center gap-[9px] px-[10px] py-[8px] rounded-[8px] text-[13px] w-full text-left font-body transition-all duration-200 border border-transparent text-[#3a5f4a] hover:bg-[rgba(6,64,40,0.08)] hover:border-[#d6e5dd] hover:text-[#064028] active:scale-[0.98]"
            >
              <span className="w-[26px] h-[26px] flex items-center justify-center rounded-[6px] text-[12px] flex-shrink-0 font-bold" style={{ background: 'rgba(6,64,40,0.08)', color: PRIMARY, border: '1px solid rgba(6,64,40,0.2)' }}>□</span>
              <span className="font-medium text-[#064028]">Single Column</span>
            </button>
            <button
              onClick={() => onAddRow([50, 50])}
              className="flex items-center gap-[9px] px-[10px] py-[8px] rounded-[8px] text-[13px] w-full text-left font-body transition-all duration-200 border border-transparent text-[#3a5f4a] hover:bg-[rgba(6,64,40,0.08)] hover:border-[#d6e5dd] hover:text-[#064028] active:scale-[0.98]"
            >
              <span className="w-[26px] h-[26px] flex items-center justify-center rounded-[6px] text-[12px] flex-shrink-0 font-bold" style={{ background: 'rgba(6,64,40,0.08)', color: PRIMARY, border: '1px solid rgba(6,64,40,0.2)' }}>⬌</span>
              <span className="font-medium text-[#064028]">Two Columns</span>
            </button>
            <button
              onClick={() => onAddRow([33, 33, 34])}
              className="flex items-center gap-[9px] px-[10px] py-[8px] rounded-[8px] text-[13px] w-full text-left font-body transition-all duration-200 border border-transparent text-[#3a5f4a] hover:bg-[rgba(6,64,40,0.08)] hover:border-[#d6e5dd] hover:text-[#064028] active:scale-[0.98]"
            >
              <span className="w-[26px] h-[26px] flex items-center justify-center rounded-[6px] text-[12px] flex-shrink-0 font-bold" style={{ background: 'rgba(6,64,40,0.08)', color: PRIMARY, border: '1px solid rgba(6,64,40,0.2)' }}>⧉</span>
              <span className="font-medium text-[#064028]">Three Columns</span>
            </button>
          </div>
        </div>
      )}

      {/* Field List */}
      <div className="flex-1 overflow-y-auto px-[10px] py-3">
        {FIELD_GROUPS.map(group => (
          <div key={group.label} className="mb-[18px]">
            
            {/* Group Label */}
            <p className=" font-bold tracking-[0.1em] uppercase mb-[6px] pl-[6px] text-[#2d2d2d]">
              {group.label}
            </p>

            {/* Fields */}
            <div className="flex flex-col gap-[4px]">
              {group.fields.map(type => (
<<<<<<< HEAD
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
                    text-[#2d2d2d]
                    hover:bg-[#f9f9f9]
                    hover:border-[#e0e0e0]
                    hover:text-[#ffbe0b]
                    active:scale-[0.98]
                  "
                  title={`Add ${FIELD_LABELS[type]}`}
                >
                  
                  {/* Icon */}
                  <span
                    className="w-[26px] h-[26px] flex items-center justify-center rounded-[6px] text-[12px] flex-shrink-0 font-bold"
                    style={{
                      background: '#fff8e1',
                      color: PRIMARY,
                      border: '1px solid #ffe082',
                    }}
                  >
                    {FIELD_ICONS[type]}
                  </span>

                  {/* Label */}
                  <span className="font-medium text-[#2d2d2d]">
                    {FIELD_LABELS[type]}
                  </span>

                  {/* Add icon */}
                  <span className="ml-auto text-[16px] opacity-70 font-light text-[#2d2d2d]">
                    +
                  </span>
                </button>
=======
                <motion.div className='flex-col gap-[2px]' key={type}
                  drag
                  dragSnapToOrigin
                  whileDrag={{ 
                    scale: 1.05, 
                    zIndex: 9999, 
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)" 
                  }}
                  onDragEnd={( event , info) => {
                    if (info.point.x > 200) {
                      onAddField(type);
                    }
                  }}>
                  <button
                      key={type}
                      // onClick={() => onAddField(type)}
                      className="flex cursor-grab items-center gap-[9px] px-[10px] py-[7px] bg-transparent border border-transparent rounded-[6px] text-text-secondary text-[13px] cursor-pointer transition-all duration-200 text-left w-full font-body hover:bg-bg-overlay hover:border-border-default hover:text-text-primary"
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
                      <span className="ml-auto text-[16px] opacity-30 font-light" onClick={() => onAddField(type)}>+</span>
                  </button>
                </motion.div>
>>>>>>> 6ab9370 (draggable and 3 screens)
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.aside>
  );
};
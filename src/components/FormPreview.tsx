import React, { useState } from 'react';
import { FormField, FormSchema } from '../types';
import { motion } from 'framer-motion';
import Select from 'react-select';
import { MultiValue, SingleValue } from "react-select";
interface FormPreviewProps {
  schema: FormSchema;
}

// Define the available screen sizes
type ViewMode = 'laptop' | 'tablet' | 'mobile';

const viewWidths: Record<ViewMode, string> = {
  laptop: '100%', // Max-width 800px
  tablet: '640px',
  mobile: '375px',
};

export const FormPreview: React.FC<FormPreviewProps> = ({ schema }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('laptop');
  const fields = schema.form.fields || [];
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [submitted, setSubmitted] = useState(false);

  const updateValue = (id: string, val: unknown) => {
    setValues(v => ({ ...v, [id]: val }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  if (fields.length === 0) {
    return (
      <div className="flex-1 z-10 flex flex-col items-center justify-center gap-3 text-[#8a8a8a] p-10">
        <div className="text-[48px]">◻</div>
        <p className="font-display text-[16px] font-semibold">No fields yet</p>
        <p className="text-[13px]">Add fields to see your preview here.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
      {/* Device Toggle Header */}
      <div className="h-14 border-b border-[#e0e0e0] flex items-center justify-center gap-2 bg-white">
        {(['laptop', 'tablet', 'mobile'] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${
              viewMode === mode
                ? 'bg-[#ffbe0b] text-[#2d2d2d] shadow-md'
                : 'text-[#8a8a8a] hover:bg-[#f9f9f9] hover:text-[#2d2d2d]'
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-white">
        <motion.div 
          animate={{ width: viewWidths[viewMode] }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="h-fit bg-white border border-[#e0e0e0] shadow-xl rounded-xl overflow-hidden max-w-[800px]"
        >
          {/* Form header */}
          <div
            className="px-8 pt-7 pb-5 border-b border-[#e0e0e0]"
            style={{ background: '#ffffff', borderBottom: '2px solid #ffbe0b' }}
          >
            <h2 className="font-display text-[22px] font-bold text-[#2d2d2d]">
              {schema.form.title || "Untitled Form"}
            </h2>
            {schema.form.description && (
              <p className="text-[13px] text-[#4a4a4a] mt-1">{schema.form.description}</p>
            )}
          </div>
          
          {/* Fields - Responsive wrapping */}
          <div className="px-8 py-6 flex flex-wrap gap-4">
            {fields.map(field => (
              <div
                key={field.id}
                className="transition-all duration-300"
                style={{
                  width: (field.width) ? field.width / 12 * (field.width ||12 ): 700 // Calculate width based on field.width (default full width)
                }}
              >
                <PreviewField
                  field={field}
                  value={values[field.id]}
                  onChange={v => updateValue(field.id, v)}
                />
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-8 pb-6 pt-4 flex gap-[10px] justify-end border-t border-[#e0e0e0]">
            <button 
              className="px-5 py-[9px] bg-white border border-[#e0e0e0] rounded-[10px] text-[#2d2d2d] font-display font-semibold text-[13px] cursor-pointer hover:bg-[#f9f9f9]">
                {schema.form.cancelLabel || 'Cancel'}
          </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-lg text-[#2d2d2d] font-bold text-[13px] transition-all"
              style={{
                background: submitted ? '#ffa500' : '#ffbe0b',
                boxShadow: '0 2px 8px rgba(255, 190, 11, 0.3)'
              }}
            >
              {submitted ? '✓ Submitted!' : (schema.form.submitLabel || 'Submit')}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};


const inputClass ="w-full px-3 py-[9px] bg-white border border-[#e0e0e0] rounded-[6px] text-[#2d2d2d] text-[13px] outline-none font-body transition-colors duration-150 focus:border-[#ffbe0b] focus:shadow-[0_0_0_3px_rgba(255,190,11,0.15)]";
const labelClass = "block text-[12px] font-semibold text-[#2d2d2d] mb-[6px] tracking-[0.02em]";

const PreviewField: React.FC<{
  field: FormField;
  value: unknown;
  onChange: (v: unknown) => void;
}> = ({ field, value, onChange }) => {

  const renderInput = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            value={(value as string) || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            readOnly={field.readOnly}
            rows={3}
            className={`${inputClass} min-h-[80px]`}
            style={{
              width: field.style?.width || '100%',
            }}
          />
        );

      
        case 'button':
          return(
            <button onClick={()=>{onChange(true)}} 
            className='px-4 py-2.5 bg-[#ffbe0b] border-0 rounded-md text-[#2d2d2d] font-semibold text-[13px] transition shadow-md hover:opacity-90'>
              {field.placeholder||"button"}
            </button>
          )

          case 'select':
            const isMulti = field.multiple;
            const options=field.options?.map(o=>({
              label:o.label,
              value:o.value
            }))||[]
            const selectedValue = isMulti
              ? options.filter(o => (value as string[] || []).includes(o.value))
              : options.find(o => o.value === value)||null;

              return (
                <div>
                  <Select 
                  isMulti={isMulti}
                  options = {options}
                  value={selectedValue}
                  

                  onChange={(selected: MultiValue<any> | SingleValue<any>) => {
                    if (isMulti) {
                      onChange((selected as MultiValue<any>).map(s => s.value));
                    } else {
                      onChange((selected as SingleValue<any>)?.value || null);
                    }
                  }}
                  menuPortalTarget={document.body}
                  menuPosition='fixed'

                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),

                    control: (base) => ({
                      ...base,
                      minHeight: 50,
                      backgroundColor: '#ffffff',
                      borderColor: '#e0e0e0',
                      color: '#2d2d2d',
                    }),

                    menu: (base) => ({
                      ...base,
                      backgroundColor: '#ffffff',
                      color: '#2d2d2d',
                    }),

                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected
                        ? '#ffbe0b'
                        : state.isFocused
                        ? '#f9f9f9'
                        : '#ffffff',
                      color: state.isSelected ? '#2d2d2d' : '#2d2d2d',
                    }),

                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: '#fff8e1',
                    }),

                    multiValueLabel: (base) => ({
                      ...base,
                      color: '#ffbe0b',
                    }),

                    multiValueRemove: (base) => ({
                      ...base,
                      color: '#ffbe0b',
                      ':hover': {
                        backgroundColor: '#ffa500',
                        color: '#ffffff',
                      },
                    }),

                    singleValue: (base) => ({
                      ...base,
                      color: '#2d2d2d',
                    }),

                    input: (base) => ({
                      ...base,
                      color: '#2d2d2d',
                    }),

                    placeholder: (base) => ({
                      ...base,
                      color: '#8a8a8a',
                    }),

                    dropdownIndicator: (base) => ({
                      ...base,
                      color: '#2d2d2d',
                    }),

                    indicatorSeparator: () => ({
                      display: 'none',
                    }),
                  }}
                  >


                  </Select>
                </div>
              )

      case 'checkbox':
        if (field.options && field.options.length > 1) {
          return (
            <div className="flex flex-col gap-2">
              {field.options.map(opt => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={((value as string[]) || []).includes(opt.value)}
                    onChange={e => {
                      const cur = (value as string[]) || [];
                      onChange(e.target.checked ? [...cur, opt.value] : cur.filter(v => v !== opt.value));
                    }}
                    className="w-[15px] h-[15px] accent-[#ffbe0b]"
                  />
                  <span className="text-[13px] text-white">{opt.label}</span>
                </label>
              ))}
            </div>
          );
        }
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!(value)}
              onChange={e => onChange(e.target.checked)}
              className="w-[15px] h-[15px] accent-[#ffbe0b]"
            />
            <span className="text-[13px] text-white">
              {field.placeholder || 'Check this option'}
            </span>
          </label>
        );

      case 'radio':
        return (
          <div className="flex flex-col gap-2">
            {field.options?.map(opt => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={field.id}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={() => onChange(opt.value)}
                  className="w-[15px] h-[15px] accent-[#ffbe0b]"
                />
                <span className="text-[13px] text-white">{opt.label}</span>
              </label>
            ))}
          </div>
        );

      case 'toggle':
        return (
          <div
            onClick={() => !field.disabled && onChange(!value)}
            className={`flex items-center gap-[10px] ${field.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div
              className="w-11 h-6 rounded-full relative transition-all duration-200"
              style={{
                background: value ? '#ffbe0b' : '#e0e0e0',
                border: `1px solid ${value ? '#ffbe0b' : '#e0e0e0'}`
              }}
            >
              <div
                className="w-[18px] h-[18px] rounded-full bg-white absolute top-[2px] transition-all duration-200"
                style={{ left: value ? 22 : 2, boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
              />
            </div>
            <span className={`text-[13px] ${value ? 'text-[#ffbe0b]' : 'text-[#a5a7c4]'}`}>
              {value ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        );

      case 'range':
        return (
          <div>
            <input
              type="range"
              min={field.validation?.min ?? 0}
              max={field.validation?.max ?? 100}
              value={(value as number) ?? (field.defaultValue as number) ?? 50}
              onChange={e => onChange(Number(e.target.value))}
              disabled={field.disabled}
              className="w-full accent-[#ffbe0b]"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[11px] text-[#8a8a8a]">{field.validation?.min ?? 0}</span>
              <span className="text-[12px] font-semibold text-[#ffbe0b]">
                {(value as number) ?? (field.defaultValue as number) ?? 50}
              </span>
              <span className="text-[11px] text-[#8a8a8a]">{field.validation?.max ?? 100}</span>
            </div>
          </div>
        );

        case 'datetime': {
          const enableDate = field.enableDate ?? true;
          const enableTime = field.enableTime ?? false;

          let inputType = 'date';

          if (enableDate && enableTime) {
            inputType = 'datetime-local';
          } else if (!enableDate && enableTime) {
            inputType = 'time';
          } else if (enableDate && !enableTime) {
            inputType = 'date';
          }

          return (
            <input
              type={inputType}
              value={(value as string) || ''}
              onChange={e => onChange(e.target.value)}
              disabled={field.disabled}
              readOnly={field.readOnly}
              className={inputClass}
            />
          );
        }

      case 'file':
        const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const files = Array.from(e.dataTransfer.files || []);
        onChange(field.multiple ? files : files[0]);
      };

      const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); // THIS IS REQUIRED FOR NOT REFRESHING THE PAGE AUTOMATICALLY
      };
        return (
          <div
            className="border-2 border-dashed border-border-default rounded-[10px] p-5 text-center cursor-pointer transition-all duration-200 hover:border-accent"
            onClick={() => document.getElementById(field.id)?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
          >
            <input
              id={field.id}
              type="file"
              hidden
              multiple={field.multiple}
              onChange={(e) => {
                const file = e.target.files?.[0];
                onChange(file); // store file in state
              }}
            />

            <div className="text-[24px] mb-[6px]">📎</div>

            <p className="text-[12px] text-[#d4d4e0]">
              {value instanceof File
                ? value.name
                : 'Click to upload or drag and drop'}
            </p>
          </div>
        );

      default:
        return (
          <input
            type={field.type}
            value={(value as string) || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            readOnly={field.readOnly}
            className={inputClass}
            style={{
              width:field.style?.width
            }}
          />
        );
          }
        };

        return (
          <div>
            {field.type !== 'checkbox' || !field.options || field.options.length <= 1 ? (
              <label className={labelClass}>
                {field.label}
                {field.validation?.required && (
                  <span className="ml-[3px]" style={{ color: '#ff6b9d' }}>*</span>
                )}
              </label>
            ) : (
              <p className={labelClass}>
                {field.label}
                {field.validation?.required && (
                  <span className="ml-[3px]" style={{ color: '#ff6b9d' }}>*</span>
                )}
              </p>
            )}
            {renderInput()}
            {field.helpText && (
              <p className="text-[11px] text-[#8a8a8a] mt-[5px]">{field.helpText}</p>
            )}
          </div>
        );
};
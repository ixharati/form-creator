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
      <div className="flex-1 z-10 flex flex-col items-center justify-center gap-3 text-text-muted p-10">
        <div className="text-[48px]">◻</div>
        <p className="font-display text-[16px] font-semibold">No fields yet</p>
        <p className="text-[13px]">Add fields to see your preview here.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-bg-base overflow-hidden">
      {/* Device Toggle Header */}
      <div className="h-14 border-b border-border-default flex items-center justify-center gap-2 bg-bg-surface">
        {(['laptop', 'tablet', 'mobile'] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${
              viewMode === mode
                ? 'bg-accent text-white shadow-md'
                : 'text-text-muted hover:bg-bg-overlay hover:text-text-primary'
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-bg-surface">
        <motion.div 
          animate={{ width: viewWidths[viewMode] }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="h-fit bg-bg-elevated border border-border-default shadow-xl rounded-xl overflow-hidden max-w-[800px]"
        >
          {/* Form header */}
          <div
            className="px-8 pt-7 pb-5 border-b border-border-default"
            style={{ background: '#064028' }}
          >
            <h2 className="font-display text-[22px] font-bold text-text-primary">
              {schema.form.title || "Untitled Form"}
            </h2>
            {schema.form.description && (
              <p className="text-[13px] text-text-secondary mt-1 text-white">{schema.form.description}</p>
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
          <div className="px-8 pb-6 pt-4 flex gap-[10px] justify-end border-t border-border-default">
            <button 
              className="px-5 py-[9px] bg-transparent border border-border-default rounded-[10px] text-text-secondary font-display font-semibold text-[13px] cursor-pointer">
                {schema.form.cancelLabel || 'Cancel'}
          </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-lg text-white font-bold text-[13px] transition-all"
              style={{
                background: submitted ? '#0a5c3a' : '#064028'
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


const inputClass ="w-full px-3 py-[9px] bg-bg-base border border-border-default rounded-[6px] text-text-primary text-[13px] outline-none font-body transition-colors duration-150 focus:border-border-focus focus:shadow-[0_0_0_3px_rgba(6,64,40,0.15)]";
const labelClass = "block text-[12px] font-semibold text-text-secondary mb-[6px] tracking-[0.02em]";

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
            className='px-4 py-2.5 bg-[var(--accent)] border-0 rounded-md text-white font-semibold text-[13px] transition shadow-[var(--shadow--accent)]'>
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
                      backgroundColor: 'var(--bg-base)',
                      borderColor: 'var(--border-default)',
                      color: '#064028',
                    }),

                    menu: (base) => ({
                      ...base,
                      backgroundColor: '#ffffff',
                      color: '#064028',
                    }),

                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected
                        ? '#064028'
                        : state.isFocused
                        ? '#eef5f0'
                        : '#ffffff',
                      color: state.isSelected ? '#ffffff' : '#064028',
                    }),

                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: '#064028',
                    }),

                    multiValueLabel: (base) => ({
                      ...base,
                      color: '#ffffff',
                    }),

                    multiValueRemove: (base) => ({
                      ...base,
                      color: '#ffffff',
                      ':hover': {
                        backgroundColor: '#0a5c3a',
                        color: '#ffffff',
                      },
                    }),

                    singleValue: (base) => ({
                      ...base,
                      color: '#064028',
                    }),

                    input: (base) => ({
                      ...base,
                      color: '#064028',
                    }),

                    placeholder: (base) => ({
                      ...base,
                      color: '#6b8f7a',
                    }),

                    dropdownIndicator: (base) => ({
                      ...base,
                      color: '#064028',
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
                    className="w-[15px] h-[15px] accent-accent"
                  />
                  <span className="text-[13px] text-text-primary">{opt.label}</span>
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
              className="w-[15px] h-[15px] accent-accent"
            />
            <span className="text-[13px] text-text-secondary">
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
                  className="w-[15px] h-[15px] accent-accent"
                />
                <span className="text-[13px] text-text-primary">{opt.label}</span>
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
                background: value ? '#064028' : '#d6e5dd',
                border: `1px solid ${value ? '#064028' : '#d6e5dd'}`
              }}
            >
              <div
                className="w-[18px] h-[18px] rounded-full bg-white absolute top-[2px] transition-all duration-200"
                style={{ left: value ? 22 : 2, boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
              />
            </div>
            <span className={`text-[13px] ${value ? 'text-text-primary' : 'text-text-muted'}`}>
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
              className="w-full accent-accent"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[11px] text-text-muted">{field.validation?.min ?? 0}</span>
              <span className="text-[12px] font-semibold text-accent">
                {(value as number) ?? (field.defaultValue as number) ?? 50}
              </span>
              <span className="text-[11px] text-text-muted">{field.validation?.max ?? 100}</span>
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

            <p className="text-[12px] text-text-muted">
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
              <p className="text-[11px] text-text-muted mt-[5px]">{field.helpText}</p>
            )}
          </div>
        );
};
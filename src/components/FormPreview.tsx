// import React, { useState } from 'react';
// import { FormField, FormSchema } from '../types';
// import Select from 'react-select/base';

// interface FormPreviewProps {
//   schema: FormSchema;
// }

// export const FormPreview: React.FC<FormPreviewProps> = ({ schema }) => {
//   const fields = schema.form.fields || [];
//   const [values, setValues] = useState<Record<string, unknown>>({});
//   const [submitted, setSubmitted] = useState(false);

//   const updateValue = (id: string, val: unknown) => {
//     setValues(v => ({ ...v, [id]: val }));
//   };

//   // const handleCancel = () => {
//   //   setValues({});
//   //   setSubmitted(false);
//   // };

//   const handleSubmit = () => {
//     setSubmitted(true);
//     setTimeout(() => setSubmitted(false), 3000);
//   };

//   if (fields.length === 0) {
//     return (
//       <div className="flex-1 flex flex-col items-center justify-center gap-3 text-text-muted p-10">
//         <div className="text-[48px]">◻</div>
//         <p className="font-display text-[16px] font-semibold">No fields yet</p>
//         <p className="text-[13px] text-center max-w-[280px]">
//           Add fields from the left panel to see your form preview here.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 overflow-y-auto px-6 py-8 flex h-full justify-center">
//       <div className="w-full max-w-[600px] bg-bg-elevated border border-border-default overflow-auto shadow-lg">
//         {/* Form header */}
//         <div
//           className="px-8 pt-7 pb-5 border-b border-border-default"
//           style={{ background: 'linear-gradient(135deg, #1e1e28 0%, #18181f 100%)' }}
//         >
//           <h2 className="font-display text-[22px] font-bold text-text-primary" style={{ marginBottom: schema.form.description ? 6 : 0 }}>
//             {schema.form.title || schema.form.key}
//           </h2>
//           {schema.form.description && (
//             <p className="text-[13px] text-text-secondary">{schema.form.description}</p>
//           )}
//         </div>

//         {/* Fields */}
//         <div className="px-8 py-6 flex flex-wrap gap-4">
//           {fields.map(field => (
//             <div
//               key={field.id}
//               style={{
//                 width: field.width === 'half' ? 'calc(50% - 8px)' :
//                        field.width === 'third' ? 'calc(33.3% - 11px)' : '100%',
//               }}
//             >
//               <PreviewField
//                 field={field}
//                 value={values[field.id]}
//                 onChange={v => updateValue(field.id, v)}
//               />
//             </div>
//           ))}
//         </div>

//         {/* Footer */}
//         <div className="px-8 pb-6 pt-4 flex gap-[10px] justify-end border-t border-border-default">
//           {/* <button onClick={handleCancel}
//           className="px-5 py-[9px] bg-transparent border border-border-default rounded-[10px] text-text-secondary font-display font-semibold text-[13px] cursor-pointer">
//             {schema.form.cancelLabel || 'Cancel'}
//           </button> */}
//           <button
//             onClick={handleSubmit}
//             className="px-5 py-[9px] border-none rounded-[10px] text-white font-display font-bold text-[13px] cursor-pointer transition-all duration-200"
//             style={{
//               background: submitted ? '#00d4aa' : '#6c63ff',
//               boxShadow: submitted ? '0 4px 16px rgba(0,212,170,0.4)' : '0 4px 20px rgba(108,99,255,0.25)',
//             }}
//           >
//             {submitted ? '✓ Submitted!' : (schema.form.submitLabel || 'Submit')}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };



import React, { useState } from 'react';
import { FormField, FormSchema } from '../types';
import { motion } from 'framer-motion';

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
<<<<<<< HEAD
  const rows = schema.form.rows || [];
  const fields = rows.flatMap(row => row.columns.map(col => col.field).filter(Boolean) as FormField[]);
=======
  const fields = schema.form.fields || [];
>>>>>>> 0214f98 (implemented dnd and proper scroll behaviour)
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [submitted, setSubmitted] = useState(false);

  const updateValue = (id: string, val: unknown) => {
    setValues(prev => ({ ...prev, [id]: val }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  if (fields.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-text-muted p-10">
        <div className="text-[48px]">?</div>
        <p className="font-display text-[16px] font-semibold">No fields yet</p>
        <p className="text-[13px]">Add fields to see your preview here.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 flex h-full justify-center">
      <div className="w-full max-w-[600px] bg-bg-elevated border border-border-default overflow-auto shadow-lg">
        <div
          className="px-8 pt-7 pb-5 border-b border-border-default"
          style={{ background: 'linear-gradient(135deg, #1e1e28 0%, #18181f 100%)' }}
        >
          <h2 className="font-display text-[22px] font-bold text-text-primary" style={{ marginBottom: schema.form.description ? 6 : 0 }}>
            {schema.form.title || schema.form.key}
          </h2>
          {schema.form.description && (
            <p className="text-[13px] text-text-secondary">{schema.form.description}</p>
          )}
        </div>

        <div className="px-8 py-6 flex flex-col gap-4">
          {rows.map(row => (
            <div key={row.id} className="flex gap-4 flex-wrap">
              {row.columns.map(col => (
                <div key={col.id} style={{ width: `${col.width}%` }}>
                  {col.field ? (
                    <PreviewField
                      field={col.field}
                      value={values[col.field.id]}
                      onChange={val => updateValue(col.field!.id, val)}
                    />
                  ) : (
                    <div className="h-full rounded-[10px] border border-border-default bg-bg-base p-4 text-[12px] text-text-muted">
                      Empty column
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="px-8 pb-6 pt-4 flex gap-[10px] justify-end border-t border-border-default">
          <button className="px-5 py-[9px] bg-transparent border border-border-default rounded-[10px] text-text-secondary font-display font-semibold text-[13px] cursor-pointer">
            {schema.form.cancelLabel || 'Cancel'}
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-[9px] border-none rounded-[10px] text-white font-display font-bold text-[13px] cursor-pointer transition-all duration-200"
            style={{
              background: submitted ? '#00d4aa' : '#6c63ff',
              boxShadow: submitted ? '0 4px 16px rgba(0,212,170,0.4)' : '0 4px 20px rgba(108,99,255,0.25)',
            }}
          >
            {submitted ? '? Submitted!' : (schema.form.submitLabel || 'Submit')}
          </button>
        </div>
      </div>
    </div>
  );
};


const inputClass = "w-full px-3 py-[9px] bg-bg-base border border-border-default rounded-[6px] text-text-primary text-[13px] outline-none font-body transition-colors duration-150 focus:border-border-focus focus:shadow-[0_0_0_3px_rgba(108,99,255,0.1)]";
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
            className={`${inputClass} resize-y leading-[1.5]`}
          />
        );

      case 'select':
        return (
          <select
            value={(value as string) || ''}
            onChange={e => onChange(e.target.value)}
            disabled={field.disabled}
            className={inputClass}
          >
            <option value="" disabled hidden>
              {field.placeholder || 'Select an option'}
            </option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'button':
        return (
          <button
            onClick={() => onChange(true)}
            className="px-4 py-2.5 bg-[var(--accent)] border-0 rounded-md text-white font-semibold text-[13px] transition shadow-[var(--shadow--accent)]"
          >
            {field.placeholder || 'Button'}
          </button>
        );

      case 'multiselect':
        return (
          <select
            multiple
            value={(value as string[]) || []}
            onChange={e => onChange(Array.from(e.target.selectedOptions).map(opt => opt.value))}
            disabled={field.disabled}
            className={`${inputClass} h-[90px] cursor-pointer`}
          >
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        if (field.options && field.options.length > 1) {
          return (
            <div className="flex flex-col gap-2">
              {field.options.map(option => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={((value as string[]) || []).includes(option.value)}
                    onChange={e => {
                      const current = (value as string[]) || [];
                      onChange(e.target.checked ? [...current, option.value] : current.filter(v => v !== option.value));
                    }}
                    className="w-[15px] h-[15px] accent-accent"
                  />
                  <span className="text-[13px] text-text-primary">{option.label}</span>
                </label>
              ))}
            </div>
          );
        }

        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!value}
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
            {field.options?.map(option => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => onChange(option.value)}
                  className="w-[15px] h-[15px] accent-accent"
                />
                <span className="text-[13px] text-text-primary">{option.label}</span>
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
                background: value ? '#6c63ff' : '#24242f',
                border: `1px solid ${value ? '#6c63ff' : '#2a2a38'}`,
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

      case 'file':
        return (
          <div className="border-2 border-dashed border-border-default rounded-[10px] p-5 text-center cursor-pointer transition-all duration-200 hover:border-accent">
            <div className="text-[24px] mb-[6px]">??</div>
            <p className="text-[12px] text-text-muted">Click to upload or drag and drop</p>
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

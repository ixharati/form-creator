import React from 'react';
import { FormField, SelectOption } from '../types';

interface FieldEditorProps {
  field: FormField;
  onChange: (updated: FormField) => void;
}

export const FieldEditor: React.FC<FieldEditorProps> = ({ field, onChange }) => {
  const update = (patch: Partial<FormField>) => onChange({ ...field, ...patch });
  const updateValidation = (patch: Partial<FormField['validation']>) =>
    onChange({ ...field, validation: { ...field.validation, ...patch } });

  const isMultiSelect = field.type === 'select';
  const isDateTime = field.type === 'datetime';

  const hasOptions = ['select', 'multiselect', 'radio', 'checkbox'].includes(field.type);
  const isRange = field.type === 'range';
  const isTextBased = ['text', 'email', 'password', 'textarea'].includes(field.type);

  return (
    <div className="flex flex-col gap-0 h-full overflow-hidden">
      <div className="px-[18px] py-4 border-b border-border-default flex-shrink-0">
        <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-muted mb-[2px]">Field Settings</p>
        <p className="text-[12px] text-text-muted">{field.id}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-[18px] py-4">

        {/* Basic */}
        <Section title="General">
          <Field label="Label" required>
            <Input value={field.label} onChange={v => update({ label: v })} placeholder="Field label" />
          </Field>
          <Field label="Placeholder">
            <Input value={field.placeholder || ''} onChange={v => update({ placeholder: v })} placeholder="Placeholder text" />
          </Field>
          <Field label="Help Text">
            <Input value={field.helpText || ''} onChange={v => update({ helpText: v })} placeholder="Helper description" />
          </Field>
          {/* <Field label="Width"> */}
            {/* <Select
              value={field.width || 'full'}
              onChange={v => update({ width: v as FormField['width'] })}
              options={[
                { label: 'Full', value: 'full' },
                { label: 'Half', value: 'half' },
                { label: 'Third', value: 'third' },
              ]}
            /> */}
            {/* <input
              type="number"
              className="bg-bg-surface"
              placeholder="Enter value (px)"
              value={field.style?.width ? parseInt(field.style.width) : ''}
              onChange={(e) => {
                let val = e.target.value;
                update({
                  ...field,
                  style: {
                    ...field.style,
                    width: val === '' ? undefined : `${Number(val)}px`,
                  },
                });
              }}
            /> */}
          {/* </Field> */}
          {isMultiSelect && (
            <Field label="Multiple Selections">
                <div>
                  {isMultiSelect && (
                    <div>
                      <input type='checkbox' checked={field.multiple} onChange={e=>update({multiple:e.target.checked})} />
                      <label className="ml-[6px] text-[12px] text-text-muted">Allow multiple selections</label>
                    </div>
                  )}
                </div>
              </Field>
          )}
              
        </Section>

        {/* Date & Time */}
        {isDateTime && (
          <>
            <Field label="Enable Date">
              <input
                type="checkbox"
                checked={field.enableDate ?? true}
                onChange={(e) =>
                  update({ enableDate: e.target.checked })
                }
              />
            </Field>

            <Field label="Enable Time">
              <input
                type="checkbox"
                checked={field.enableTime ?? false}
                onChange={(e) =>
                  update({ enableTime: e.target.checked })
                }
              />
            </Field>
          </>
        )}

        {/* Options */}
        {hasOptions && field.options && (
          <Section title="Options">
            {field.options.map((opt, i) => (
              <div key={i} className="flex gap-[6px] items-center mb-[6px]">
                <div className="flex-1">
                  <Input
                    value={opt.label}
                    onChange={v => {
                      const opts = [...field.options!];
                      opts[i] = { ...opts[i], label: v };
                      update({ options: opts });
                    }}
                    placeholder="Label"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    value={opt.value}
                    onChange={v => {
                      const opts = [...field.options!];
                      opts[i] = { ...opts[i], value: v };
                      update({ options: opts });
                    }}
                    placeholder="Value"
                  />
                </div>
                <button
                  onClick={() => {
                    const opts = field.options!.filter((_, idx) => idx !== i);
                    update({ options: opts });
                  }}
                  className="w-[26px] h-[26px] bg-transparent border border-border-default rounded-[5px] text-danger hover:bg-[rgba(255,77,109,0.1)] cursor-pointer flex items-center justify-center text-[12px] flex-shrink-0"
                >✕</button>
              </div>
            ))}
            <button
              onClick={() => {
                const id = `option_${field.options!.length + 1}`;
                update({
                  options: [...field.options!, { label: `Option ${field.options!.length + 1}`, value: id }],
                });
              }}
              className="w-full py-[7px] bg-[rgba(6,64,40,0.08)] border border-dashed border-[#064028] rounded-[6px] text-[#064028] hover:bg-[rgba(6,64,40,0.15)] transition-all"
            >+ Add Option</button>
          </Section>
        )}

        {/* Range */}
        {isRange && (
          <Section title="Range Settings">
            <div className="grid grid-cols-2 gap-[10px]">
              <Field label="Min">
                <Input type="number" value={String(field.validation?.min ?? 0)} onChange={v => updateValidation({ min: Number(v) })} />
              </Field>
              <Field label="Max">
                <Input type="number" value={String(field.validation?.max ?? 100
                )} onChange={v => updateValidation({ max: Number(v) })} />
              </Field>
            </div>
            <Field label="Default Value">
              <Input type="number" value={String(field.defaultValue ?? 100)} onChange={v => update({ defaultValue: Number(v) })} />
            </Field>
          </Section>
        )}

        {/* Validation */}
        <Section title="Validation">
          <Toggle label="Required" value={!!field.validation?.required} onChange={v => updateValidation({ required: v })} />
          <Toggle label="Disabled" value={!!field.disabled} onChange={v => update({ disabled: v })} />
          <Toggle label="Read Only" value={!!field.readOnly} onChange={v => update({ readOnly: v })} />

          {isTextBased && (
            <div className="grid grid-cols-2 gap-[10px] mt-2">
              <Field label="Min Length">
                <Input type="number" value={String(field.validation?.minLength ?? '')} onChange={v => updateValidation({ minLength: v ? Number(v) : undefined })} placeholder="0" />
              </Field>
              <Field label="Max Length">
                <Input type="number" value={String(field.validation?.maxLength ?? '')} onChange={v => updateValidation({ maxLength: v ? Number(v) : undefined })} placeholder="∞" />
              </Field>
            </div>
          )}

          {field.type === 'number' && (
            <div className="grid grid-cols-2 gap-[10px] mt-2">
              <Field label="Min">
                <Input type="number" value={String(field.validation?.min ?? '')} onChange={v => updateValidation({ min: v ? Number(v) : undefined })} />
              </Field>
              <Field label="Max">
                <Input type="number" value={String(field.validation?.max ?? '')} onChange={v => updateValidation({ max: v ? Number(v) : undefined })} />
              </Field>
            </div>
          )}

          {isTextBased && (
            <Field label="Regex Pattern">
              <Input value={field.validation?.pattern || ''} onChange={v => updateValidation({ pattern: v })} placeholder="e.g. ^[a-z]+$" />
            </Field>
          )}
        </Section>

      </div>
    </div>
  );
};

/* Sub-components  */

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-5">
    <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-text-muted mb-[10px] pb-[6px] border-b border-border-default">{title}</p>
    {children}
  </div>
);

const Field: React.FC<{
  label: string;
  required?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ label, required, children, style }) => (
  <div className="mb-[10px]" style={style}>
    <label className="block text-[11px] text-text-secondary mb-1 font-medium">
      {label}{required && <span className="text-accent-2 ml-[3px]">*</span>}
    </label>
    {children}
  </div>
);

const Input: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}> = ({ value, onChange, placeholder, type = 'text' }) => (
  <input
    type={type}
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full px-[10px] py-[7px] bg-white border border-[#e0e0e0] rounded-[6px] text-[#2d2d2d] text-[12px] outline-none transition-all duration-200 focus:border-[#ffbe0b] focus:shadow-[0_0_0_3px_rgba(255,190,11,0.15)]"
  />
);

const Select: React.FC<{
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
}> = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    className="w-full overflow-scroll bg-white border border-[#e0e0e0] rounded-[6px] text-[#2d2d2d] text-[12px] outline-none cursor-pointer"
  >
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

const Toggle: React.FC<{
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}> = ({ label, value, onChange }) => (
  <div
    onClick={() => onChange(!value)}
    className="flex items-center justify-between py-[6px] cursor-pointer mb-1"
  >
    <span className="text-[12px] text-text-secondary">{label}</span>
    <div
      className="w-9 h-5 rounded-full relative transition-all duration-200 flex-shrink-0"
      style={{
        background: value ? '#064028' : '#e6f0eb',
        border: `1px solid ${value ? '#064028' : '#d6e5dd'}`,
      }}
    >
      <div
        className="w-[14px] h-[14px] rounded-full bg-white absolute top-[2px] transition-all duration-200"
        style={{
          left: value ? 18 : 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }}
      />
    </div>
  </div>
);

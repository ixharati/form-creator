import React from 'react';
import { FormSchema } from '../types';

interface FormSettingsProps {
  schema: FormSchema;
  onChange: (updated: FormSchema) => void;
}

export const FormSettings: React.FC<FormSettingsProps> = ({ schema, onChange }) => {
  const updateForm = (patch: Partial<typeof schema.form>) =>
    onChange({ ...schema, form: { ...schema.form, ...patch } });

  return (
    <div className="flex flex-col gap-0 h-full overflow-hidden">
      <div className="px-[18px] py-4 border-b border-border-default flex-shrink-0">
        <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-muted">Form Settings</p>
      </div>

      <div className="flex-1 overflow-y-auto px-[18px] py-4">
        <Section title="Basic">
          <Field label="Form Title">
            <Input value={schema.form.title || ''} onChange={v => updateForm({ title: v })} placeholder="My Form" />
          </Field>
          <Field label="Form Key">
            <Input value={schema.form.key} onChange={v => updateForm({ key: v })} placeholder="Screen" />
          </Field>
          <Field label="Description">
            <textarea
              value={schema.form.description || ''}
              onChange={e => updateForm({ description: e.target.value })}
              placeholder="Optional description..."
              rows={3}
              className="w-full px-[10px] py-[7px] bg-white border border-[#e0e0e0] rounded-[6px] text-[#2d2d2d] text-[12px] outline-none resize-y font-body leading-[1.5] transition-all duration-200 focus:border-[#ffbe0b] focus:shadow-[0_0_0_3px_rgba(255,190,11,0.15)]"            />
          </Field>
        </Section>

        <Section title="Buttons">
          <Field label="Submit Label">
            <Input value={schema.form.submitLabel || ''} onChange={v => updateForm({ submitLabel: v })} placeholder="Submit" />
          </Field>
          {/* <Field label="Cancel Label">
            <Input value={schema.form.cancelLabel || ''} onChange={v => updateForm({ cancelLabel: v })} placeholder="Cancel" />
          </Field> */}
        </Section>

        <Section title="Configuration">
          <Field label="Tooltip Type">
            <Input value={schema.tooltipType} onChange={v => onChange({ ...schema, tooltipType: v })} placeholder="MuiTooltip" />
          </Field>
          <Field label="Modal Type">
            <Input value={schema.modalType} onChange={v => onChange({ ...schema, modalType: v })} placeholder="MuiDialog" />
          </Field>
          <Field label="Default Language">
            <Input value={schema.defaultLanguage} onChange={v => onChange({ ...schema, defaultLanguage: v })} placeholder="en-US" />
          </Field>
          <Field label="Version">
            <Input value={schema.version} onChange={v => onChange({ ...schema, version: v })} placeholder="1" />
          </Field>
        </Section>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-5">
    <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-text-muted mb-[10px] pb-[6px] border-b border-border-default">{title}</p>
    {children}
  </div>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="mb-[10px]">
    <label className="block text-[11px] text-text-secondary mb-1 font-medium">{label}</label>
    {children}
  </div>
);

const Input: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full px-[10px] py-[7px] bg-white border border-[#e0e0e0] rounded-[6px] text-[#2d2d2d] text-[12px] outline-none transition-all duration-200 focus:border-[#ffbe0b] focus:shadow-[0_0_0_3px_rgba(255,190,11,0.15)]"
  />
);

export type FieldType =
  | 'text'
  | 'number'
  // | 'email'
  | 'password'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'button'
  | 'checkbox'
  | 'radio'
  // | 'date'
  // | 'time'
  | 'datetime'
  | 'toggle'
  | 'range'
  | 'file';

export interface SelectOption {
  label: string;
  value: string;
}


export interface Validation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  patternMessage?: string;
}

export interface FieldStyle{
  width?:`${number}px` | `${number}%`;
  height?: 'string';
  fontSize?: 'string';
  padding?: 'string';
  margin?: 'string';
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  multiple?: boolean;
  helpText?: string;
  defaultValue?: string | boolean | number;
  options?: SelectOption[];
  searchable?: boolean;
  validation?: Validation;
  enableDate?:boolean;
  enableTime?:boolean;
  width?: number;
  disabled?: boolean;
  readOnly?: boolean;
  style?:FieldStyle;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  collapsible?: boolean;
}

export interface FormSchema {
  version: string;
  tooltipType: string;
  modalType: string;
  form: {
    key: string;
    type: string;
    props: Record<string, unknown>;
    title?: string;
    description?: string;
    sections?: FormSection[];
    fields?: FormField[];
    submitLabel?: string;
    cancelLabel?: false;
    layout?: 'single' | 'wizard';
  };
  localization: Record<string, string>;
  languages: Array<{
    code: string;
    dialect: string;
    name: string;
    description: string;
    bidi: 'ltr' | 'rtl';
  }>;
  defaultLanguage: string;
}

export type ActiveTab = 'builder' | 'preview' | 'json' | 'forms';

export interface DragItem {
  id: string;
  index: number;
}

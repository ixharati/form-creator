import { FormField, FieldType, FormSchema } from '../types';

export const INITIAL_SCHEMA: FormSchema = {
  version: '1',
  tooltipType: 'MuiTooltip',
  modalType: 'MuiDialog',
  form: {
    key: 'Screen',
    type: 'Screen',
    props: {},
    title: 'My Form',
    description: '',
    sections: [],
    fields: [],
    submitLabel: 'Submit',
    cancelLabel: false,
    layout: 'single',
  },
  localization: {},
  languages: [
    {
      code: 'en',
      dialect: 'US',
      name: 'English',
      description: 'American English',
      bidi: 'ltr',
    },
  ],
  defaultLanguage: 'en-US',
};

export const FIELD_ICONS: Record<FieldType, string> = {
  text: 'T',
  number: '#',
  // email: '@',
  password: '🔒',
  button: '▸',
  textarea: '¶',
  select: '▾',
  multiselect: '☰',
  checkbox: '☑',
  radio: '◉',
  date: '📅',
  time: '⏱',
  datetime: '📆',
  toggle: '⇌',
  range: '⇔',
  file: '📎',
};

 

export const FIELD_LABELS: Record<FieldType, string> = {
  text: 'Text',
  number: 'Number',
  // email: 'Email',
  password: 'Password',
  textarea: 'Text Area',
  select: 'Dropdown',
  multiselect: 'Multi-Select',
  button: 'Button',
  checkbox: 'Checkbox',
  radio: 'Radio Group',
  date: 'Date',
  time: 'Time',
  datetime: 'Date & Time',
  toggle: 'Toggle',
  range: 'Range Slider',
  file: 'File Upload',
};

export const FIELD_GROUPS = [
  {
    label: 'Text Input',
    fields: ['text', 'number', 'password', 'button', 'textarea'] as FieldType[],
  },
  {
    label: 'Choice',
    fields: ['select', 'checkbox', 'radio'] as FieldType[],
  },
  {
    label: 'Date & Time',
    // fields: ['date', 'time', 'datetime'] as FieldType[],
    fields: ['datetime'] as FieldType[],
  },
  {
    label: 'Special',
    fields: ['toggle', 'range', 'file'] as FieldType[],
  },
];

export const createDefaultField = (type: FieldType, id: string): FormField => {
  const base: FormField = {
    id,
    type,
    label: FIELD_LABELS[type],
    placeholder: type === 'textarea' ? 'Enter text here...' : type === 'text' ? 'Enter value...' : undefined,
    validation: { required: false },
  };
  if (['select', 'multiselect', 'radio', 'checkbox'].includes(type)) {
    base.options = [
      { label: 'Option 1', value: 'option_1' },
      { label: 'Option 2', value: 'option_2' },
    ];
  }
  if (type === 'range') {
    base.validation = { ...base.validation, min: 0, max: 100 };
    base.defaultValue = 50;
  }
  return base;
};

export const downloadJSON = (schema: FormSchema) => {
  const blob = new Blob([JSON.stringify(schema, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${schema.form.key || 'form'}-schema.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const generateSectionId = () => `section_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
export const generateFieldId = () => `field_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

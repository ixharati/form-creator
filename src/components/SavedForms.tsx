import React from 'react';
import { FormSchema } from '../types';

interface SavedFormsProps {
  onLoadForm: (schema: FormSchema) => void;
  onDeleteForm: (id: string) => void;
}

interface SavedForm {
  id: string;
  name: string;
  schema: FormSchema;
  createdAt: string;
}

export const SavedForms: React.FC<SavedFormsProps> = ({ onLoadForm, onDeleteForm }) => {
  const [savedForms, setSavedForms] = React.useState<SavedForm[]>([]);

  React.useEffect(() => {
    const forms = JSON.parse(localStorage.getItem('savedForms') || '[]');
    setSavedForms(forms);
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this form?')) {
      const updatedForms = savedForms.filter(form => form.id !== id);
      setSavedForms(updatedForms);
      localStorage.setItem('savedForms', JSON.stringify(updatedForms));
      onDeleteForm(id);
    }
  };

  if (savedForms.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-full max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#f9f9f9] border border-[#e0e0e0] flex items-center justify-center text-2xl mb-4 mx-auto">
            📄
          </div>
          <h3 className="font-display text-lg font-bold text-[#2d2d2d] mb-2">No saved forms yet</h3>
          <p className="text-[#8a8a8a] text-sm max-w-md mx-auto">
            Create and save your forms in the Builder tab. They'll appear here for easy access and management.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-[#e0e0e0] text-center">
        <h2 className="font-display text-xl font-bold text-[#2d2d2d]">Saved Forms</h2>
        <p className="text-[#8a8a8a] text-sm mt-1">Manage your created forms</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-4">
            {savedForms.map((form) => (
              <div
                key={form.id}
                className="border border-[#e0e0e0] rounded-lg p-4 hover:border-[#ffbe0b] transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-[#2d2d2d] text-lg">
                      {form.name}
                    </h3>
                    <p className="text-[#8a8a8a] text-sm mt-1">
                      {form.schema.form.sections?.length || 0} sections • {
                        form.schema.form.sections?.reduce((total, section) => total + section.fields.length, 0) || 0
                      } fields
                    </p>
                    <p className="text-[#8a8a8a] text-xs mt-2">
                      Created: {new Date(form.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(form.id)}
                    className="text-[#dc2626] hover:bg-red-50 p-2 rounded transition-colors"
                    title="Delete form"
                  >
                    🗑️
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onLoadForm(form.schema)}
                    className="px-4 py-2 bg-[#ffbe0b] text-[#2d2d2d] rounded font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    Load Form
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(form.schema, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${form.name.replace(/\s+/g, '_')}-schema.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-4 py-2 border border-[#e0e0e0] text-[#2d2d2d] rounded font-semibold text-sm hover:bg-gray-50 transition-colors"
                  >
                    Export
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
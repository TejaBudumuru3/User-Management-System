import { useState } from 'react';
import { Button } from './Button';

interface ImageUploadProps {
  onChange: (file: File | null) => void;
  imagePreview?: string;
  className?: string;
}

export const ImageUpload = ({ onChange, imagePreview, className = '' }: ImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(imagePreview || null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setPreview(URL.createObjectURL(file));
        onChange(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setPreview(URL.createObjectURL(file));
        onChange(file);
      }
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer hover:border-blue-400 ${className} ${
        dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-upload')?.click()}
    >
      <input
        id="file-upload"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleChange}
      />
      
      {preview ? (
        <div className="space-y-4">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-32 h-32 mx-auto rounded-2xl object-cover shadow-lg"
          />
          <Button variant="secondary" size="sm">
            Change Image
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gray-200 rounded-2xl mx-auto flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-700">Click or drag image here</p>
          <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
        </div>
      )}
    </div>
  );
};

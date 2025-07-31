import React, { useState, useEffect } from 'react';
import type { RecipeFormData } from '../RecipeBuilder';
import { Loader2 } from 'lucide-react';

interface StepProps {
  data: RecipeFormData;
  onDataChange: (data: any) => void;
}
 
const DetailsStep: React.FC<StepProps> = ({ data, onDataChange }) => {
  const [localData, setLocalData] = useState({
    title: data.title || '',
    description: data.description || '',
    calories: data.calories || '0',
  });

  // Update local data when props change (for draft loading)
  useEffect(() => {
    setLocalData({
      title: data.title || '',
      description: data.description || '',
      calories: data.calories || '0',
    });
  }, [data.title, data.description, data.calories]);

  const [errors, setErrors] = useState<{ title?: string }>({});
  
  const [isCheckingTitle, setIsCheckingTitle] = useState(false);

  useEffect(() => {
    if (!localData.title) {
      return;
    }

    setIsCheckingTitle(true);
    const validationTimeout = setTimeout(() => {
      if (localData.title.length < 4) {
        setErrors(prev => ({ ...prev, title: 'Title is too short. Must be at least 4 characters.' }));
      } else {
        setErrors(prev => ({ ...prev, title: undefined }));
      }
      setIsCheckingTitle(false);
    }, 800);

    return () => clearTimeout(validationTimeout);
  }, [localData.title]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const newData = { ...localData, [id]: value };
    setLocalData(newData);
    onDataChange({ ...data, ...newData });
  };

  return (
    <div className="space-y-6 w-full">
      <h2 className="text-xl font-semibold">Recipe Details</h2>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Recipe Title</label>
        <div className="relative">
          <input
            type="text"
            id="title"
            value={localData.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="e.g., Grandma's Apple Pie"
          />
          {isCheckingTitle && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 animate-spin" />
          )}
        </div>
        {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          id="description"
          rows={3}
          value={localData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="A short description of your recipe"
        />
      </div>
      <div>
        <label htmlFor="calories" className="block text-sm font-medium text-gray-700 mb-2">Calories</label>
        <input
          type="text"
          id="calories"
          value={localData.calories}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
    </div>
  );
};

export default DetailsStep;

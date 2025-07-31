import React, { useEffect, useState, useRef } from 'react';
import { Plus, X } from 'lucide-react';
import type { RecipeFormData } from '../RecipeBuilder';

interface StepProps {
  data: RecipeFormData;
  onDataChange: (data: any) => void;
}

type Ingredient = { name: string; quantity: number | string; unit: string };

const IngredientsStep: React.FC<StepProps> = ({ data, onDataChange }) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: '', quantity: 1, unit: 'cup' }]);
  const [errors, setErrors] = useState<Array<{ quantity?: string }>>([]);
  const isInitialized = useRef(false);

  // Initialize with data from props on first render
  useEffect(() => {
    if (!isInitialized.current) {
      if (data.ingredients && Array.isArray(data.ingredients) && data.ingredients.length > 0) {
        setIngredients(data.ingredients);
      }
      isInitialized.current = true;
    }
  }, []);

  // Update errors when ingredients change
  useEffect(() => {
    if (!Array.isArray(ingredients)) {
      console.error('Ingredients is not an array:', ingredients);
      setIngredients([{ name: '', quantity: 1, unit: 'cup' }]);
      return;
    }
    
    const newErrors = ingredients.map(ing => {
      if (Number(ing.quantity) <= 0) {
        return { quantity: 'Quantity must be greater than 0.' }; 
      }
      return {};
    });
    setErrors(newErrors);
  }, [ingredients]);

  // Update parent component when ingredients change
  useEffect(() => {
    if (isInitialized.current && Array.isArray(ingredients)) {
      onDataChange({ ...data, ingredients });
    }
  }, [ingredients]);

  const addIngredient = () => {
    setIngredients(prev => [...prev, { name: '', quantity: '', unit: '' }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: any) => {
    setIngredients(prev => {
      const newIngredients = [...prev];
      newIngredients[index] = { ...newIngredients[index], [field]: value };
      return newIngredients;
    });
  };


  // Safety check before rendering
  if (!Array.isArray(ingredients)) {
    console.error('Ingredients is not an array in render:', ingredients);
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Ingredients</h2>
        <p className="text-red-500">Error: Invalid ingredients data. Please reload the page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Ingredients</h2>
      <div className="space-y-4">
        {ingredients.map((ing, index) => (
          <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
                <input
                  type="text"
                  value={ing.name}
                  onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                  placeholder="Ingredient name"
                  className="w-full px-3 py-2 border rounded-md border-gray-300"
                />
            </div>
            <div className="w-48">
              <input
                type="number"
                value={ing.quantity}
                onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                placeholder="Qty"
                className={`w-full px-3 py-2 border rounded-md ${errors[index]?.quantity ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors[index]?.quantity && <p className="text-red-600 text-sm mt-1">{errors[index]?.quantity}</p>}
            </div>
            <div className="w-32">
                 <input
                  type="text"
                  value={ing.unit}
                  onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                  placeholder="Unit"
                  className="w-full px-3 py-2 border rounded-md border-gray-300"
                />
            </div>
            <button 
              onClick={() => removeIngredient(index)} 
              disabled={ingredients.length <= 1}
              className="p-2 text-red-500 self-center disabled:text-gray-300 disabled:cursor-not-allowed"
            >
              <X />
            </button>
          </div>
        ))}
      </div>
      <button onClick={addIngredient} className="inline-flex items-center px-4 py-2 text-green-700 bg-green-100 rounded-md">
        <Plus className="mr-2 h-4 w-4" /> Add Ingredient
      </button>
    </div>
  );
};

export default IngredientsStep;

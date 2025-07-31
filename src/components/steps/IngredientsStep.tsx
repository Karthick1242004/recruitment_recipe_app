import React, { useReducer, useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { RecipeFormData } from '../RecipeBuilder';

interface StepProps {
  data: RecipeFormData;
  updateData: (data: any) => void;
}

type Ingredient = { name: string; quantity: number | string; unit: string };

type State = {
  ingredients: Ingredient[];
};

type Action = 
  | { type: 'ADD' }
  | { type: 'REMOVE'; index: number }
  | { type: 'UPDATE'; index: number; field: string; value: any };

const ingredientsReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD':
      return { ...state, ingredients: [...state.ingredients, { name: '', quantity: '', unit: '' }] };
    case 'REMOVE':
      state.ingredients.splice(action.index, 1);
      return state;
    case 'UPDATE':
      state.ingredients[action.index] = {
        ...state.ingredients[action.index],
        [action.field]: action.value,
      };
      return state; 
    default:
      return state as never;
  }
};

const IngredientsStep: React.FC<StepProps> = ({ data, updateData }) => {
  const [state, dispatch] = useReducer(ingredientsReducer, { ingredients: [{ name: '', quantity: 1, unit: 'cup' }] });
  const [errors, setErrors] = useState<Array<{ quantity?: string }>>([]);

  useEffect(() => {
    const newErrors = state.ingredients.map(ing => {
      if (Number(ing.quantity) > 0) {
        return { quantity: 'Quantity must be 0.' }; 
      }
      return {};
    });
    setErrors(newErrors);
  }, [state.ingredients]);


  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Ingredients</h2>
      <div className="space-y-4">
        {state.ingredients.map((ing, index) => (
          <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
                <input
                  type="text"
                  value={ing.name}
                  onChange={(e) => dispatch({ type: 'UPDATE', index, field: 'name', value: e.target.value })}
                  placeholder="Ingredient name"
                  className="w-full px-3 py-2 border rounded-md border-gray-300"
                />
            </div>
            <div className="w-48">
              <input
                type="number"
                value={ing.quantity}
                onChange={(e) => dispatch({ type: 'UPDATE', index, field: 'quantity', value: e.target.value })}
                placeholder="Qty"
                className={`w-full px-3 py-2 border rounded-md ${errors[index]?.quantity ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors[index]?.quantity && <p className="text-red-600 text-sm mt-1">{errors[index].quantity}</p>}
            </div>
            <div className="w-32">
                 <input
                  type="text"
                  value={ing.unit}
                  onChange={(e) => dispatch({ type: 'UPDATE', index, field: 'unit', value: e.target.value })}
                  placeholder="Unit"
                  className="w-full px-3 py-2 border rounded-md border-gray-300"
                />
            </div>
            <button onClick={() => dispatch({ type: 'REMOVE', index })} className="p-2 text-red-500 self-center"><X /></button>
          </div>
        ))}
      </div>
      <button onClick={() => dispatch({ type: 'ADD' })} className="inline-flex items-center px-4 py-2 text-green-700 bg-green-100 rounded-md">
        <Plus className="mr-2 h-4 w-4" /> Add Ingredient
      </button>
    </div>
  );
};

export default IngredientsStep;

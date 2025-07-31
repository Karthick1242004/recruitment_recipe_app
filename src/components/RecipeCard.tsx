import React from 'react';
import { Flame, Edit } from 'lucide-react'; // Import the Edit icon
import { useNavigate } from 'react-router-dom';

interface RecipeCardProps {
  id: string;
  title: string;
  description: string;
  calories: number | string;
}

const RecipeCard: React.FC<RecipeCardProps> = React.memo(({ id, title, description, calories }) => {
  const navigate = useNavigate();
  const isNew = Number(id) < 10 && !isNaN(Number(id));
  const displayCalories = Number(calories);

  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden relative">
      {isNew && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          New!
        </div>
      )}
      <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500" />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            <Flame className="h-4 w-4 mr-1" />
            <span>{isNaN(displayCalories) ? 'N/A' : displayCalories} cal</span>
          </div>
          {/* The new Edit button */}
          <button 
            onClick={handleEdit}
            className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
});

export default RecipeCard;
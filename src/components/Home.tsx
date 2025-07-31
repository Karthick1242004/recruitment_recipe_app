import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Loader2, Star, Search, Tag } from 'lucide-react';
import RecipeCard from './RecipeCard';

interface Recipe {
  id: string;
  title: string;
  description: string;
  totalCalories: number | string;
  tags: string[];
}

const ALL_TAGS = ['Vegan', 'Dessert', 'Quick Meal', 'Spicy'];

const Home: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const [isCreateDisabled, setIsCreateDisabled] = useState(false);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get saved recipes from localStorage
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    
    const mockRecipes: Recipe[] = [
      { id: '1', title: 'Classic Pasta Carbonara', description: 'Creamy Italian pasta dish', totalCalories: 650, tags: [] },
      { id: '2', title: 'Spicy Vegan Curry', description: 'Healthy and fresh', totalCalories: 320, tags: ['Vegan', 'Spicy'] },
      { id: '3', title: 'Chocolate Lava Cake', description: 'A decadent dessert', totalCalories: 480, tags: ['Dessert'] },
    ];
    
    // Combine mock recipes with saved recipes
    const allRecipes = [...mockRecipes, ...savedRecipes];
    setRecipes(allRecipes);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  useEffect(() => {
    const syncWithSessionStatus = () => {
      const status = localStorage.getItem('user_session_status');
      setIsCreateDisabled(status === 'drafting');
    };

    syncWithSessionStatus();
    window.addEventListener('storage', syncWithSessionStatus);

    return () => {
      window.removeEventListener('storage', syncWithSessionStatus);
    };
  }, []);

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const displayedRecipes = recipes.filter(recipe => {
    const matchesSearch = searchQuery ? recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    const matchesTags = selectedTags.length > 0 ? selectedTags.some(tag => recipe.tags.includes(tag)) : true;
    return matchesSearch && matchesTags;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Recipe Book</h1>
          <button 
            onClick={() => navigate('/create')} 
            disabled={isCreateDisabled}
            className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create New Recipe
          </button>
          {isCreateDisabled && <p className="text-sm text-red-500 ml-4">Cannot create new recipes while a draft is in progress.</p>}
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-12 w-12 text-green-600 animate-spin" /></div>
        ) : (
          <>
            <div className="mb-6 p-4 bg-white rounded-lg shadow">
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search recipes..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-wrap">
                <Tag className="h-5 w-5 text-gray-500 mr-2" />
                {ALL_TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`px-3 py-1 my-1 rounded-full text-sm font-medium transition-colors ${
                      selectedTags.includes(tag) ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  id={recipe.id}
                  title={recipe.title}
                  description={recipe.description}
                  calories={recipe.totalCalories}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;

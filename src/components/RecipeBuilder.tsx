import React, 'useState', 'useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, Send, AlertTriangle, Loader2 } from 'lucide-react';
import DetailsStep from './steps/DetailsStep';
import IngredientsStep from './steps/IngredientsStep';
import InstructionsStep from './steps/InstructionsStep';

export interface RecipeFormData {
  title: string;
  description: string;
  calories: string;
  ingredients: Array<{ name: string; quantity: number | string; unit: string }>;
  instructions: Array<{ step: string }>;
  image?: File;
}

const RecipeBuilder: React.FC = () => {
  const { recipeId } = useParams();
  const isEditMode = Boolean(recipeId);

  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const [recipeData, setRecipeData] = useState<RecipeFormData>({
    title: '',
    description: '',
    calories: '0',
    ingredients: [],
    instructions: [{ step: '' }],
  });
  const [draftExists, setDraftExists] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('recipeDraft_v2');
      if (savedDraft) {
        setDraftExists(true);
      }
    } catch (e) {
      console.error("Could not access localStorage.");
    }
  }, []);

  useEffect(() => {
    if (isEditMode) {
      setIsValidating(true);
      const fetchRecipeById = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockApiData = {
          '1': { title: 'Pasta Carbonara from API', description: 'A fetched description', calories: '650' },
          'feat-1': { title: 'Chef\'s Curry from API', description: 'Fetched spicy surprise!', calories: '720' },
        };
        const fetchedData = { recipeDetails: mockApiData[recipeId] };
        setRecipeData(prev => ({ ...prev, ...fetchedData.recipeData }));
        setIsValidating(false);
      };
      fetchRecipeById();
    }
  }, [recipeId, isEditMode]);

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSaveDraft = () => {
    const draftToSave = {
      ...recipeData,
      ingredients: JSON.stringify(recipeData.ingredients),
      lastSaved: new Date().toISOString(),
    };
    localStorage.setItem('recipeDraft_v2', JSON.stringify(draftToSave));
    
    localStorage.setItem('user_session_status', 'drafting');

    alert('Draft saved!');
  };

  const loadDraft = () => {
    const savedDraft = localStorage.getItem('recipeDraft_v2');
    if (savedDraft) {
      const parsed = JSON.parse(savedDraft);
      setRecipeData(prev => Object.assign(prev, parsed));
    }
    setDraftExists(false);
  };

  const handleSubmit = async () => {
    localStorage.removeItem('user_session_status');
    console.log(`Submitting in ${isEditMode ? 'Edit' : 'Create'} mode...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Recipe submitted!');
    navigate('/');
  };

  const renderCurrentStep = () => {
    const props = { data: recipeData, onDataChange: setRecipeData };
    switch (currentStep) {
      case 1: return <DetailsStep {...props} />;
      case 2: return <IngredientsStep {...props} />;
      case 3: return <InstructionsStep {...props} />;
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative">
      {draftExists && (
        <div className="fixed top-5 right-5 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow-lg z-50 flex items-center space-x-4">
          <AlertTriangle className="h-6 w-6 text-yellow-500" />
          <div>
            <p className="font-bold">Draft Found!</p>
            <p>Would you like to load your saved draft?</p>
          </div>
          <button onClick={loadDraft} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">Load</button>
          <button onClick={() => setDraftExists(false)} className="text-yellow-500 hover:text-yellow-700">&times;</button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {isEditMode ? `Editing Recipe` : 'Create New Recipe'}
          </h1>
          <button 
            onClick={handleSaveDraft} 
            disabled={isValidating} 
            className="inline-flex items-center px-4 py-2 text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 disabled:opacity-50"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </button>
        </div>

        <div className="p-6 min-h-[20rem] flex items-center justify-center">
          {isValidating ? <Loader2 className="h-8 w-8 animate-spin text-green-500" /> : renderCurrentStep()}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
          <button onClick={handleBack} disabled={currentStep === 1 || isValidating} className="px-4 py-2 text-gray-700 bg-white border rounded-md disabled:opacity-50">Back</button>
          
          <div className="flex items-center space-x-2">
            {currentStep === 3 ? (
              <button onClick={handleSubmit} disabled={isValidating} className="px-4 py-2 text-white bg-green-600 rounded-md z-10 disabled:opacity-50">
                {isEditMode ? 'Update Recipe' : 'Submit Recipe'}
              </button>
            ) : (
              <button onClick={handleNext} disabled={isValidating} className="px-4 py-2 text-white bg-green-600 rounded-md disabled:opacity-50">Next</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeBuilder;
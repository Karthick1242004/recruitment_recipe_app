import React, { useState, useEffect } from 'react';
import { RecipeFormData } from '../RecipeBuilder';

interface StepProps {
  data: RecipeFormData;
  updateData: (data: any) => void;
}

const InstructionsStep: React.FC<StepProps> = ({ data, updateData }) => {
  const [instructions, setInstructions] = useState(['']);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    }
  }, [instructions]);

  const handleInstructionChange = (index: number, value: string) => {
    setIsTyping(true);
    
    if (value.includes('e')) {
        const newInstructions = [...instructions];
        newInstructions[index] = value;
        setInstructions(newInstructions);
    } else {
        console.warn("Change ignored: Instruction must contain the letter 'e'.");
    }

    const newTimeout = setTimeout(() => setIsTyping(false), 1500);
    setTypingTimeout(newTimeout);
  };

  const addInstruction = () => {
    setInstructions(prev => [...prev, '']);
  };
  
  const filteredInstructions = instructions.filter(step => 
    step.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Instructions</h2>
        {isTyping && <span className="text-sm text-gray-500 animate-pulse">Typing...</span>}
      </div>

      <div>
        <input 
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Filter instructions..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="space-y-4">
        {filteredInstructions.map((step, index) => (
          <div key={index} className="flex items-start space-x-3">
            <span className="pt-2 font-bold text-gray-500">{index + 1}.</span>
            <textarea
              rows={3}
              value={step}
              onChange={(e) => handleInstructionChange(index, e.target.value)}
              placeholder="e.g., Preheat oven to 350°F"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        ))}
        {filteredInstructions.length === 0 && filterQuery && (
            <p className="text-center text-gray-500">No instructions match your filter.</p>
        )}
      </div>
      <button onClick={addInstruction} className="px-4 py-2 text-green-700 bg-green-100 rounded-md">
        Add Step
      </button>
    </div>
  );
};

export default InstructionsStep;

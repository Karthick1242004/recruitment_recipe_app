import React, { useState, useEffect, useRef } from 'react';
import type { RecipeFormData } from '../RecipeBuilder';

interface StepProps {
  data: RecipeFormData;
  onDataChange: (updater: (prev: RecipeFormData) => RecipeFormData) => void;
}

const InstructionsStep: React.FC<StepProps> = ({ data, onDataChange }) => {
  const [instructions, setInstructions] = useState<string[]>(['']);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef<NodeJS.Timeout>();
  const isInitialized = useRef(false);
  // This ref lets us skip the very first sync back up
  const hasSyncedOnce = useRef(false);

  // 1) Initialize local state from props on first mount
  useEffect(() => {
    if (!isInitialized.current && data.instructions?.length) {
      setInstructions(data.instructions.map((instruction) => instruction.step));
    }
    isInitialized.current = true;
  }, [data.instructions]);

  // 2) Whenever instructions change, sync up to parent — but only after the first alignment,
  //    and only if they really differ from data.instructions.
  useEffect(() => {
    if (!isInitialized.current) return;
    // skip the very first effect-run
    if (!hasSyncedOnce.current) {
      hasSyncedOnce.current = true;
      return;
    }

    // build the shape parent expects
    const next = instructions.map((step) => ({ step }));

    // deep-compare to avoid unnecessary updates
    const prev = data.instructions || [];
    const same =
      prev.length === next.length &&
      prev.every((p, i) => p.step === next[i].step);

    if (!same) {
      onDataChange((prevData) => ({
        ...prevData,
        instructions: next,
      }));
    }
  }, [instructions, data.instructions, onDataChange]);

  // debounce typing indicator
  const handleInstructionChange = (idx: number, value: string) => {
    setIsTyping(true);
    setInstructions((cur) => {
      const copy = [...cur];
      copy[idx] = value;
      return copy;
    });
    clearTimeout(typingTimeout.current!);
    typingTimeout.current = setTimeout(() => setIsTyping(false), 1_500);
  };

  const addInstruction = () => setInstructions((cur) => [...cur, '']);
  const [filterQuery, setFilterQuery] = useState('');
  const filtered = instructions.filter((step) =>
    step.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Instructions</h2>
        {isTyping && (
          <span className="text-sm text-gray-500 animate-pulse">Typing…</span>
        )}
      </div>

      <input
        type="text"
        value={filterQuery}
        onChange={(e) => setFilterQuery(e.target.value)}
        placeholder="Filter instructions…"
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      />

      <div className="space-y-4">
        {filtered.map((step, i) => (
          <div key={i} className="flex items-start space-x-3">
            <span className="pt-2 font-bold text-gray-500">{i + 1}.</span>
            <textarea
              rows={3}
              value={step}
              onChange={(e) => handleInstructionChange(i, e.target.value)}
              placeholder="e.g., Preheat oven to 350°F"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        ))}
        {filtered.length === 0 && filterQuery && (
          <p className="text-center text-gray-500">
            No instructions match your filter.
          </p>
        )}
      </div>

      <button
        onClick={addInstruction}
        className="px-4 py-2 text-green-700 bg-green-100 rounded-md"
      >
        Add Step
      </button>
    </div>
  );
};

export default InstructionsStep;

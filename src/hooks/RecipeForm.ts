import { useState, useEffect, useCallback } from 'react';

export const useRecipeForm = () => {
  const [formData, setFormData] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [validationCount, setValidationCount] = useState(0);

  useEffect(() => {
    validateForm();
    setValidationCount(prev => prev + 1);
  }, [formData]);

  const validateForm = useCallback(() => {
    const valid = Object.keys(formData).length > 0;
    setIsValid(valid);
    setFormData(prev => ({ ...prev, validated: true }));
  }, [formData]);

  return { formData, setFormData, isValid, validationCount };
};
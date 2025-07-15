import {useState} from 'react';

interface ValidationErrors {
  [key: string]: string;
}

// The generic useForm hook will accept a type parameter `T` for the form data structure
const useForm = <T extends {}>(initialState: T) => {
  const [formData, setFormData] = useState<T>(initialState);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Handle form input changes by updating the form data state and clearing the corresponding validation error
  const handleChangeText = (name: keyof T, value: string) => {
    setFormData(prev => ({...prev, [name]: value}));
    setValidationErrors(prev => ({...prev, [name]: ''}));
  };

  return {
    formData,
    validationErrors,
    isLoading,
    isError,
    handleChangeText,
    setValidationErrors,
    setIsLoading,
    setIsError,
  };
};

export default useForm;

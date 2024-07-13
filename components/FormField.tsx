import React, { useState } from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'password' | 'date' | 'file';
  name?: string;
  value?: string | boolean | number;
  checked?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  pattern?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  required?: boolean;
  multiple?: boolean;
  error?: boolean;
  touched?: boolean; // Añadir prop touched
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type,
  name,
  value,
  checked,
  onChange,
  onBlur,
  pattern,
  options,
  rows,
  required,
  multiple,
  error,
  touched // Añadir el estado touched aquí
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const purpleColor = 'text-[#6017AF] border-global focus:border-global focus:ring-global dark:text-[#6017AF] dark:border-global dark:focus:border-global';

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isError = error && touched;

  if (type === 'select' && options) {
    return (
      <div className="relative z-0 w-full mb-5 group">
        <label htmlFor={id} className="block text-sm font-medium text-blue-400 dark:text-gray-300 mb-1">
          {label}
        </label>
        <select
          id={id}
          name={name}
          value={value as string}
          onChange={onChange}
          onBlur={onBlur}
          className={`block py-3 px-0 w-full text-lg bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer ${isError ? 'border-red-500' : 'border-gray-300'} ${purpleColor}`}
          required={required}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  } else if (type === 'textarea') {
    return (
      <div className="relative z-0 w-full mb-5 group">
        <label htmlFor={id} className="block text-sm font-medium text-blue-400 dark:text-gray-300 mb-4">
          {label}
        </label>
        <textarea
          id={id}
          name={name}
          value={value as string}
          onChange={onChange}
          onBlur={onBlur}
          rows={rows}
          className={`block p-3 w-full text-lg bg-gray-50 rounded-lg border appearance-none focus:outline-none focus:ring-0 peer ${isError ? 'border-red-500' : 'border-gray-300'} ${purpleColor}`}
          required={required}
        />
      </div>
    );
  } else if (type === 'checkbox') {
    return (
      <div className="relative z-0 w-full mb-5 group flex items-center">
        <input
          type="checkbox"
          name={name}
          id={id}
          checked={checked}
          onChange={onChange}
          onBlur={onBlur}
          className="mr-2 leading-tight"
        />
        <label htmlFor={id} className="text-blue-400 block text-sm font-medium dark:text-gray-300">
          {label}
        </label>
      </div>
    );
  } else if (type === 'password') {
    return (
      <div className="relative z-0 w-full mb-10 group">
        <label htmlFor={id} className="text-blue-400 block text-sm font-medium dark:text-gray-300 mb-1">
          {label}
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name={name}
            id={id}
            pattern={pattern}
            value={value as string}
            onChange={onChange}
            onBlur={onBlur}
            className={`block py-3 px-4 w-full text-lg bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer ${isError ? 'border-red-500' : 'border-gray-300'} ${purpleColor}`}
            required={required}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-sm leading-5"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
      </div>
    );
  } else if (type === 'date' || type === 'file') {
    return (
      <div className="relative z-0 w-full mb-5 group">
        <label htmlFor={id} className="block text-sm font-medium text-blue-400 dark:text-gray-300 mb-1">
          {label}
        </label>
        <input
          type={type}
          name={name}
          id={id}
          onChange={onChange}
          onBlur={onBlur}
          multiple={type === 'file'}
          className={`block py-3 px-4 w-full text-lg bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer ${isError ? 'border-red-500' : 'border-gray-300'} ${purpleColor}`}
          required={required}
        />
      </div>
    );
  } else {
    return (
      <div className="relative z-0 w-full mb-10 group">
        <label htmlFor={id} className="text-blue-400 block text-sm font-medium dark:text-gray-300 mb-1">
          {label}
        </label>
        <input
          type={type}
          name={name}
          id={id}
          pattern={pattern}
          value={value as string}
          onChange={onChange}
          onBlur={onBlur}
          className={`block py-3 px-4 w-full text-lg bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer ${isError ? 'border-red-500' : 'border-gray-300'} ${purpleColor}`}
          required={required}
        />
      </div>
    );
  }
};

export default FormField;

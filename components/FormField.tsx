import React from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  pattern?: string;
  options?: { value: string; label: string }[];
  rows?: number;
}

const FormField: React.FC<FormFieldProps> = ({ id, label, type, value, onChange, pattern, options, rows }) => {
  const purpleColor = 'text-[#6017AF] border-global focus:border-global focus:ring-global dark:text-[#6017AF] dark:border-global dark:focus:border-global';

  if (type === 'select' && options) {
    return (
      <div className="relative z-0 w-full mb-5 group">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-blue-400 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          className={`block py-3 px-0 w-full text-lg text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 peer ${purpleColor}`}
          required
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
        <label
          htmlFor={id}
          className="block text-sm font-medium text-blue-400 dark:text-gray-300 mb-4"
        >
          {label}
        </label>
        <textarea
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          rows={rows}
          className={`block p-3 w-full text-lg text-gray-900 bg-gray-50 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#6017AF] dark:focus:border-global focus:ring-global focus:border-global ${purpleColor}`}
          placeholder=" "
          required
        />
      </div>
    );
  } else {
    return (
      <div className="relative z-0 w-full mb-10 group">
        <label
          htmlFor={id}
          className="text-blue-400 block text-sm font-medium dark:text-gray-300 mb-1"
        >
          {label}
        </label>
        <input
          type={type}
          name={id}
          id={id}
          pattern={pattern}
          value={value}
          onChange={onChange}
          className={`block py-3 px-4 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-global focus:outline-none focus:ring-0 focus:border-global peer ${purpleColor}`}
          placeholder=" "
          required
        />
      </div>
    );
  }
};

export default FormField;

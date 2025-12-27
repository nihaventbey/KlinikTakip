import React from 'react';
import { UseFormRegister, Path, FieldError, RegisterOptions } from 'react-hook-form';

interface FormInputProps<TFormValues extends Record<string, unknown>> extends React.InputHTMLAttributes<HTMLInputElement> {
  name: Path<TFormValues>;
  label?: string;
  register: UseFormRegister<TFormValues>;
  rules?: RegisterOptions;
  error?: FieldError;
  className?: string;
}

export const FormInput = <TFormValues extends Record<string, any>>({
  name,
  label,
  register,
  rules,
  error,
  className = '',
  ...props
}: FormInputProps<TFormValues>) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        id={name}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
        {...register(name, rules)}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};
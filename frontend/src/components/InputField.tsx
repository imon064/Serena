import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  icon,
  error,
  type = 'text',
  id,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-2 w-full">
      <label
        htmlFor={id}
        className="text-xs font-semibold text-slate-500 tracking-wide text-left"
      >
        {label}
      </label>
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-4 text-brand pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}
        <input
          id={id}
          type={inputType}
          className={`w-full py-3.5 ${
            icon ? 'pl-12' : 'px-4'
          } ${
            isPassword ? 'pr-12' : 'pr-4'
          } border border-gray-200 rounded-[14px] text-sm text-slate-900 bg-white placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all duration-200 ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''
          } ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-4 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-150 flex items-center justify-center"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={20} strokeWidth={1.75} /> : <Eye size={20} strokeWidth={1.75} />}
          </button>
        )}
      </div>
      {error && (
        <span className="text-xs text-red-500 text-left mt-0.5">{error}</span>
      )}
    </div>
  );
};

export default InputField;

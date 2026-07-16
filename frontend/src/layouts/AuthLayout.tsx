import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-lavender flex items-center justify-center p-4 sm:p-6 md:p-8 transition-colors duration-300">
      <div className="w-full max-w-[420px] animate-fadeIn">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;

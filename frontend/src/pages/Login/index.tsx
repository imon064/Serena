import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { InputField } from '../../components/InputField';
import { Button } from '../../components/Button';
import { SocialButton } from '../../components/SocialButton';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/journal');
    }, 1000);
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center text-center w-full">
        <h1 className="text-[32px] font-extrabold text-[#110B30] tracking-tight leading-tight mb-2.5">
          Welcome Back
        </h1>
        <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[280px] mb-8">
          Continue your journey toward better mental wellness.
        </p>

        <div className="w-full bg-white rounded-[32px] shadow-card px-6 py-8 sm:px-8 sm:py-10 border border-slate-100/50">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <InputField
              label="Email Address"
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={20} strokeWidth={1.75} />}
              error={errors.email}
            />

            <div className="flex flex-col gap-2">
              <InputField
                label="Password"
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={20} strokeWidth={1.75} />}
                error={errors.password}
              />
              <div className="flex justify-end mt-1">
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Forgot password flow (Demo only)');
                  }}
                  className="text-xs font-bold text-brand hover:text-brand-hover hover:underline transition-colors duration-150"
                >
                  Forgot Password?
                </a>
              </div>
            </div>

            <Button type="submit" isLoading={isLoading} className="mt-2 text-white">
              Sign In
            </Button>
          </form>

          <div className="flex items-center my-6 before:flex-1 before:border-t before:border-gray-200/80 after:flex-1 after:border-t after:border-gray-200/80">
            <span className="px-4 text-[10px] font-bold text-slate-400 tracking-widest uppercase">
              OR
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <SocialButton
              provider="google"
              onClick={() => alert('Google authentication (Demo only)')}
            />
            <SocialButton
              provider="apple"
              onClick={() => alert('Apple authentication (Demo only)')}
            />
          </div>
        </div>

        <div className="mt-8 text-sm font-medium text-slate-500">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-brand font-bold hover:text-brand-hover hover:underline transition-colors duration-150"
          >
            Create Account
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;

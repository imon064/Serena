import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { InputField } from '../../components/InputField';
import { Button } from '../../components/Button';
import { SocialButton } from '../../components/SocialButton';
import { useAuth } from '../../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUpWithPassword, signInWithGoogle } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreeTerms?: string;
  }>({});
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms & Conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    setIsLoading(true);
    try {
      const { needsEmailConfirmation } = await signUpWithPassword(
        email,
        password,
        fullName.trim()
      );

      if (needsEmailConfirmation) {
        alert(
          'Account created! Please check your email to confirm your address, then sign in.'
        );
        navigate('/login');
      } else {
        // Email confirmation disabled: user is signed in immediately.
        navigate('/journal');
      }
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : 'Unable to create account. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setFormError('');
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : 'Google sign-up failed. Please try again.'
      );
      setIsGoogleLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center text-center w-full">
        {/* Header with Back Button */}
        <div className="w-full flex justify-start mb-6">
          <Link
            to="/login"
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all duration-150"
            aria-label="Back to login"
          >
            <ArrowLeft size={18} strokeWidth={2} className="text-slate-600" />
          </Link>
        </div>

        {/* Title and Subtitle */}
        <h1 className="text-[32px] font-extrabold text-[#110B30] tracking-tight leading-tight mb-2.5">
          Create Your Account
        </h1>
        <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[280px] mb-8">
          Start your journey to a healthier and happier mind.
        </p>

        {/* Card Body */}
        <div className="w-full bg-white rounded-[32px] shadow-card px-6 py-8 sm:px-8 sm:py-10 border border-slate-100/50">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {formError && (
              <div className="text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-2xl px-4 py-3 text-left">
                {formError}
              </div>
            )}

            <InputField
              label="Full Name"
              id="fullName"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              icon={<User size={20} strokeWidth={1.75} />}
              error={errors.fullName}
            />

            <InputField
              label="Email Address"
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={20} strokeWidth={1.75} />}
              error={errors.email}
            />

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

            <InputField
              label="Confirm Password"
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<Lock size={20} strokeWidth={1.75} />}
              error={errors.confirmPassword}
            />

            {/* Terms & Conditions Checkbox */}
            <div className="flex flex-col gap-1.5 items-start mt-1">
              <label className="flex items-start gap-3 cursor-pointer select-none text-left">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand focus:ring-opacity-20 transition-all duration-150 cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-500 leading-relaxed">
                  I agree to the{' '}
                  <a
                    href="#privacy"
                    onClick={(e) => { e.preventDefault(); alert('Privacy Policy (Demo)'); }}
                    className="text-brand font-bold hover:underline"
                  >
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a
                    href="#terms"
                    onClick={(e) => { e.preventDefault(); alert('Terms of Service (Demo)'); }}
                    className="text-brand font-bold hover:underline"
                  >
                    Terms of Service
                  </a>
                  .
                </span>
              </label>
              {errors.agreeTerms && (
                <span className="text-xs text-red-500 text-left mt-0.5">{errors.agreeTerms}</span>
              )}
            </div>

            <Button type="submit" isLoading={isLoading} className="mt-2 text-white">
              Create Account
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6 before:flex-1 before:border-t before:border-gray-200/80 after:flex-1 after:border-t after:border-gray-200/80">
            <span className="px-4 text-[10px] font-bold text-slate-400 tracking-widest uppercase">
              OR
            </span>
          </div>

          {/* Social Sign Up Buttons */}
          <div className="flex flex-col gap-3">
            <SocialButton
              provider="google"
              onClick={handleGoogle}
              disabled={isGoogleLoading}
            />
            <SocialButton
              provider="apple"
              onClick={() => alert('Apple registration (Demo only)')}
            />
          </div>
        </div>

        {/* Card Footer */}
        <div className="mt-8 text-sm font-medium text-slate-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-brand font-bold hover:text-brand-hover hover:underline transition-colors duration-150"
          >
            Sign In
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;

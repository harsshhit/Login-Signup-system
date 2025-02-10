import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import type { z } from 'zod';

import { AuthLayout } from '../components/AuthLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { signUpSchema } from '../lib/auth';
import { supabase } from '../lib/supabase';

type SignUpForm = z.infer<typeof signUpSchema>;

export function Signup() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpForm) => {
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
            full_name: data.fullName,
          },
        },
      });

      if (signUpError) {
        if (signUpError.status === 422) {
          toast.error('This email is already registered. Please try signing in instead.');
          return;
        }
        throw signUpError;
      }

      if (!authData.user) throw new Error('No user data returned');

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            username: data.username,
            full_name: data.fullName,
          },
        ]);

      if (profileError) {
        if (profileError.code === '23505') { // Unique violation
          toast.error('This username is already taken. Please choose another one.');
          return;
        }
        throw profileError;
      }

      toast.success('Account created successfully!');
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join MelodyVerse and start your musical journey"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />

        <Input
          label="Username"
          {...register('username')}
          error={errors.username?.message}
        />

        <Input
          label="Full Name"
          {...register('fullName')}
          error={errors.fullName?.message}
        />

        <Input
          label="Password"
          type="password"
          {...register('password')}
          error={errors.password?.message}
        />

        <Input
          label="Confirm Password"
          type="password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        <label className="flex items-center">
          <input
            type="checkbox"
            {...register('terms')}
            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
          />
          <span className="ml-2 text-sm text-gray-600">
            I agree to the{' '}
            <Link
              to="/terms"
              className="text-purple-600 hover:text-purple-500"
            >
              terms and conditions
            </Link>
          </span>
        </label>
        {errors.terms && (
          <p className="text-sm text-red-600">{errors.terms.message}</p>
        )}

        <Button type="submit" loading={isSubmitting}>
          Create account
        </Button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-purple-600 hover:text-purple-500"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import type { z } from "zod";
import { supabase } from "../lib/supabase";
import { loginSchema } from "../lib/auth";
import { ArrowLeft, Eye, EyeOff, ArrowRight } from "lucide-react";

type LoginForm = z.infer<typeof loginSchema>;

export function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen gradient-bg animate-fade-in">
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute top-4 left-4 flex items-center">
          <span className="font-bold text-2xl text-black">Authentication </span>
          <span className="ml-1 bg-white text-black text-xs px-1 rounded">
            System
          </span>
        </div>
        <img
          src="https://images.unsplash.com/photo-1682687982501-1e58ab814714"
          alt="Desert landscape"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 p-8 flex items-center justify-center">
        <div className="w-full max-w-md animate-slide-up">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">
              Sign in to continue your creative journey
            </p>
          </div>

          <div className="mb-8 flex items-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-2 mr-4 rounded-full bg-gray-800 hover:bg-gray-700 transition hover-scale"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex-1 flex justify-end items-center">
              <span className="text-gray-400 mr-2">Don't have an account?</span>
              <Link to="/signup" className="text-white hover:underline">
                Sign up
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  {...register("email")}
                  className="w-full bg-gray-800 border-none rounded-lg p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-gray-700 focus:outline-none input-transition"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password")}
                  className="w-full bg-gray-800 border-none rounded-lg p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-gray-700 focus:outline-none pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between mt-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  className="w-4 h-4 bg-gray-800 border-gray-700 rounded text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                />
                <span className="ml-2 text-sm text-gray-400">Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-4 px-4 rounded-lg flex items-center justify-center mt-8 transition focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer hover-scale"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span className="mr-2">Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Terms reminder (optional, matching the signup form style) */}
            <p className="text-xs text-gray-500 text-center mt-6">
              By signing in, you agree to our Terms of Service, Privacy Policy
              and Data Usage Properties
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

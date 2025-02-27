import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import type { z } from "zod";
import { supabase } from "../lib/supabase";
import { signUpSchema } from "../lib/auth";
import { ArrowLeft, Eye, EyeOff, ArrowRight } from "lucide-react";

type SignUpForm = z.infer<typeof signUpSchema>;

export function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      username: "",
      fullName: "",
      password: "",
      confirmPassword: "",
      // terms: false,
    },
  });

  const onSubmit = async (data: SignUpForm) => {
    setLoading(true);
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email: data.email,
          password: data.password,
          options: {
            data: {
              username: data.username,
              full_name: data.fullName,
            },
          },
        }
      );

      if (signUpError) {
        if (signUpError.status === 422) {
          toast.error(
            "This email is already registered. Please try signing in instead."
          );
          return;
        }
        throw signUpError;
      }

      if (!authData.user) throw new Error("No user data returned");

      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: authData.user.id,
          username: data.username,
          full_name: data.fullName,
        },
      ]);

      if (profileError) {
        if (profileError.code === "23505") {
          // Unique violation
          toast.error(
            "This username is already taken. Please choose another one."
          );
          return;
        }
        throw profileError;
      }

      toast.success("Account created successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Something went wrong. Please try again.");
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
            <h1 className="text-3xl font-bold text-white mb-2">
              Create Your Account to Unleash Your Dreams
            </h1>
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
              <span className="text-gray-400 mr-2">
                Already have an account?
              </span>
              <Link to="/login" className="text-white hover:underline">
                Log in
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Full Name Input */}
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  {...register("fullName")}
                  className="w-full bg-gray-800 border-none rounded-lg p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-gray-700 focus:outline-none input-transition"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Username Input */}
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  {...register("username")}
                  className="w-full bg-gray-800 border-none rounded-lg p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-gray-700 focus:outline-none input-transition"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.username.message}
                  </p>
                )}
              </div>

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

              {/* Confirm Password - We'll keep it visible to ensure form validation works */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  {...register("confirmPassword")}
                  className="w-full bg-gray-800 border-none rounded-lg p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-gray-700 focus:outline-none input-transition"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="mt-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register("terms")}
                  className="w-4 h-4 bg-gray-800 border-gray-700 rounded text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                />
                <span className="ml-2 text-sm text-gray-400">
                  By signing in, you agree to Generative AI's{" "}
                  <Link to="/terms" className="text-blue-400 hover:underline">
                    Terms of Service
                  </Link>
                  ,{" "}
                  <Link to="/privacy" className="text-blue-400 hover:underline">
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/data-usage"
                    className="text-blue-400 hover:underline"
                  >
                    Data Usage Properties
                  </Link>
                </span>
              </label>
              {errors.terms && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.terms.message}
                </p>
              )}
            </div>

            {/* Submit Button - Fixed styling and added loading state */}
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-4 px-4 rounded-lg flex items-center justify-center mt-8 transition focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer hover-scale"
            >
              {loading ? (
                <span>Creating account...</span>
              ) : (
                <>
                  <span className="mr-2">Start Creating</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

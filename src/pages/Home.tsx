import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {  LockIcon } from "lucide-react";
import { supabase } from "../lib/supabase";

type Profile = {
  username: string;
  full_name: string;
  avatar_url: string | null;
};

export function Home() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          navigate("/login");
          return;
        }

        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("username, full_name, avatar_url")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        setProfile(profileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Unable to load profile");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/login");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg animate-fade-in flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg animate-fade-in p-8">
      <div className="w-full max-w-4xl mx-auto animate-slide-up">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white p-3 rounded-full mb-4">
            <LockIcon className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-white text-center mb-2">
           Authentication system
          </h1>
          <p className="text-gray-400 text-center">
            Your authentication was successful!
          </p>
        </div>

        <div className="glass-effect rounded-lg shadow-xl p-8 animate-slide-in">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-700 p-3 rounded-full">
                <LockIcon className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Your Profile</h2>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 hover-scale"
            >
              Sign Out
            </button>
          </div>

          <div className="bg-gray-700 rounded-lg p-6 mb-6">
            <div className="space-y-3">
              <p className="text-gray-300">
                <span className="font-medium text-white">Username:</span>{" "}
                {profile?.username}
              </p>
              <p className="text-gray-300">
                <span className="font-medium text-white">Full Name:</span>{" "}
                {profile?.full_name}
              </p>
            </div>
          </div>

          <div className="text-gray-400">
            <h2 className="text-lg font-semibold text-white mb-4">
              Authentication System Features
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Secure user authentication with Supabase</li>
              <li>Protected routes and session management</li>
              <li>Form validation with Zod schema</li>
              <li>Responsive and modern UI design</li>
              <li>Real-time error handling and notifications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

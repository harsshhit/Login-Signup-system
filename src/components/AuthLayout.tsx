import React from 'react';
import { Music } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white p-3 rounded-full mb-4">
            <Music className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            {title}
          </h1>
          <p className="text-purple-200 text-center">{subtitle}</p>
        </div>
        <div className="bg-white rounded-lg shadow-xl p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
# Authentication System Showcase

A modern authentication system built with React, TypeScript, and Supabase, featuring a beautiful UI and comprehensive security measures.

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env` file:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run development server:
   ```bash
   npm run dev
   ```

## Features

- **Secure Authentication**

  - Email/Password authentication using Supabase
  - Protected routes and session management
  - Automatic redirect to login for unauthenticated users

- **Modern UI/UX**

  - Responsive design with Tailwind CSS
  - Smooth animations and transitions
  - Glass-effect components
  - Loading states and feedback

- **Form Handling**

  - Form validation using Zod schema
  - Real-time error handling
  - Input field validation
  - Toast notifications for user feedback

- **Profile Management**
  - User profile display
  - Username and full name storage
  - Avatar support

## Security Measures

- JWT-based authentication through Supabase
- Secure password hashing
- Row Level Security (RLS) policies
- SQL injection protection
- XSS protection
- Environment variables for sensitive data

## Tech Stack

- React 18
- TypeScript
- Vite
- Supabase
- TailwindCSS
- React Router DOM
- React Hook Form
- Zod
- React Hot Toast

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

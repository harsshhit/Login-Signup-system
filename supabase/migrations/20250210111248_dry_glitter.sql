/*
  # Update Profiles Security Policies

  1. Security Changes
    - Add INSERT policy for profiles table
    - Ensure policies are created only if they don't exist
*/

-- Add INSERT policy if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile" ON profiles
      FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
END $$;
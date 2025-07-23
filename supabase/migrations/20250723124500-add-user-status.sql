-- 1. Create ENUM type for user status
CREATE TYPE public.user_status AS ENUM ('active', 'inactive', 'pending');

-- 2. Add status column to profiles table
ALTER TABLE public.profiles
ADD COLUMN status public.user_status NOT NULL DEFAULT 'pending';

-- 3. Update handle_new_user function to set default role and status
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, status)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.email, 'student', 'pending');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

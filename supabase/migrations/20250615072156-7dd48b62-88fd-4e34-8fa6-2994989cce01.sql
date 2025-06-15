
-- Add 'admin' role to the list of possible user roles
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'admin';

-- Create a new type for user status if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
        CREATE TYPE public.user_status AS ENUM ('pending', 'active', 'inactive');
    END IF;
END$$;

-- Add columns to the profiles table for last name and status
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status public.user_status NOT NULL DEFAULT 'pending';

-- Rename the 'name' column to 'first_name' for clarity, if it exists
DO $$
BEGIN
    IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'name')
    THEN
        ALTER TABLE public.profiles RENAME COLUMN name TO first_name;
    END IF;
END$$;

-- Update the function that handles new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  user_role public.app_role;
  user_status public.user_status;
BEGIN
  -- Set role to 'admin' for specific emails and activate them, otherwise set as pending student
  IF new.email IN ('administracion@kenova.xyz', 'santillan@kenova.xyz', 'francisco.santillan@cetis14.edu.mx') THEN
    user_role := 'admin';
    user_status := 'active'; -- Admins are active by default
  ELSE
    user_role := (new.raw_user_meta_data->>'role')::public.app_role;
    user_status := 'pending'; -- Other users are pending by default
  END IF;

  -- Insert new user data into the profiles table
  INSERT INTO public.profiles (id, first_name, last_name, email, role, status)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'first_name', 
    new.raw_user_meta_data->>'last_name',
    new.email, 
    user_role,
    user_status
  );
  RETURN new;
END;
$function$;

-- Ensure the trigger on new user creation is active by recreating it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- Update existing admin accounts to be 'active'
UPDATE public.profiles
SET status = 'active'
WHERE lower(email) IN (
  'administracion@kenova.xyz', 
  'santillan@kenova.xyz', 
  'francisco.santillan@cetis14.edu.mx'
);

-- Update the function that handles new user creation to be case-insensitive and more robust
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
  IF lower(new.email) IN ('administracion@kenova.xyz', 'santillan@kenova.xyz', 'francisco.santillan@cetis14.edu.mx') THEN
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
  )
  ON CONFLICT (id) DO NOTHING; -- Prevents errors if a profile somehow already exists
  RETURN new;
END;
$function$;

-- 1. Allow all authenticated users to read profiles
-- This is often necessary for Supabase Realtime to work correctly.
-- Your more specific policies for update/delete will still apply.
CREATE POLICY "Allow authenticated users to read profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- 2. Allow all authenticated users to read groups
CREATE POLICY "Allow authenticated users to read groups"
ON public.groups
FOR SELECT
TO authenticated
USING (true);

-- 3. Ensure the 'handle_new_user' function is up-to-date
-- This ensures the superadmin logic is correctly applied.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  IF new.email LIKE '%@cetis14.edu.mx' THEN
    INSERT INTO public.profiles (id, name, email, role, status)
    VALUES (new.id, new.raw_user_meta_data->>'name', new.email, 'superadmin', 'active');
  ELSE
    INSERT INTO public.profiles (id, name, email, role, status)
    VALUES (new.id, new.raw_user_meta_data->>'name', new.email, 'student', 'pending');
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

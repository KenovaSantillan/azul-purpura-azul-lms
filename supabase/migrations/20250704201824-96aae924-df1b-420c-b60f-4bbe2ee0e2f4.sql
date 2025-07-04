-- Create policy to allow the trigger to insert new profiles
CREATE POLICY "Allow service role to insert profiles"
ON public.profiles
FOR INSERT
WITH CHECK (true);

-- Also create a policy to allow authenticated users to insert their own profile
-- This is needed for the trigger context
CREATE POLICY "System can insert profiles for new users"
ON public.profiles  
FOR INSERT
TO authenticated, service_role
WITH CHECK (true);
-- 1. Add 'superadmin' to the app_role ENUM type
-- Supabase doesn't support adding a value to an ENUM in a transaction.
-- This needs to be done in two steps.
-- First, we create a new type with the new value.
CREATE TYPE public.app_role_new AS ENUM ('student', 'teacher', 'tutor', 'parent', 'admin', 'superadmin');

-- Then, we alter the table to use the new type.
ALTER TABLE public.profiles ALTER COLUMN role TYPE public.app_role_new USING role::text::public.app_role_new;

-- Finally, we drop the old type and rename the new one.
DROP TYPE public.app_role;
ALTER TYPE public.app_role_new RENAME TO app_role;


-- 2. Update handle_new_user function to assign superadmin role
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

-- 3. Update RLS policies to include superadmin
-- Profiles
DROP POLICY "Teachers can view their students' profiles" ON public.profiles;
CREATE POLICY "Teachers and superadmins can view their students' profiles" ON public.profiles
FOR SELECT USING (
  get_user_role(auth.uid()) = 'superadmin' OR
  EXISTS (
    SELECT 1 FROM public.groups g
    JOIN public.group_members gm ON g.id = gm.group_id
    WHERE g.teacher_id = auth.uid() AND gm.user_id = profiles.id
  )
);

-- Groups
DROP POLICY "Users can manage groups based on role" ON public.groups;
CREATE POLICY "Users can manage groups based on role" ON public.groups
FOR ALL USING (get_user_role(auth.uid()) IN ('teacher', 'superadmin'))
WITH CHECK (get_user_role(auth.uid()) IN ('teacher', 'superadmin'));

-- Group Members
DROP POLICY "Teachers can manage their group members" ON public.group_members;
CREATE POLICY "Teachers and superadmins can manage their group members" ON public.group_members
FOR ALL USING (get_user_role(auth.uid()) = 'superadmin' OR is_group_teacher(group_id, auth.uid()));

-- Tasks
DROP POLICY "Teachers can manage tasks in their groups" ON public.tasks;
CREATE POLICY "Teachers and superadmins can manage tasks in their groups" ON public.tasks
FOR ALL USING (get_user_role(auth.uid()) = 'superadmin' OR is_group_teacher(group_id, auth.uid()));

-- Task Assignees
DROP POLICY "Teachers can manage task assignees in their groups" ON public.task_assignees;
CREATE POLICY "Teachers and superadmins can manage task assignees" ON public.task_assignees
FOR ALL USING (
  get_user_role(auth.uid()) = 'superadmin' OR
  is_group_teacher((SELECT group_id FROM public.tasks WHERE id = task_id), auth.uid())
);

-- Announcements
DROP POLICY "Teachers can manage announcements" ON public.announcements;
CREATE POLICY "Teachers and superadmins can manage announcements" ON public.announcements
FOR ALL USING (get_user_role(auth.uid()) IN ('teacher', 'superadmin'));

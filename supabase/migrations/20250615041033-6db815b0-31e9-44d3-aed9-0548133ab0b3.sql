
-- 1. Create ENUM types for LMS domain
CREATE TYPE public.app_role AS ENUM ('student', 'teacher', 'tutor', 'parent');
CREATE TYPE public.grade AS ENUM ('1o', '2o', '3o', '4o', '5o', '6o');
CREATE TYPE public.letter AS ENUM ('A', 'B', 'C', 'D', 'E');
CREATE TYPE public.specialty AS ENUM ('Servicios de Hospedaje', 'Programación', 'Contabilidad', 'Construcción');
CREATE TYPE public.shift AS ENUM ('Matutino', 'Vespertino');
CREATE TYPE public.task_type AS ENUM ('collective', 'group', 'individual');
CREATE TYPE public.task_status AS ENUM ('pending', 'in-progress', 'completed');
CREATE TYPE public.announcement_priority AS ENUM ('low', 'medium', 'high');

-- 2. Create profiles table to store user data
CREATE TABLE public.profiles (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  role public.app_role NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments for supabase_admin
COMMENT ON TABLE public.profiles IS 'Stores user-specific information.';

-- Trigger to update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.handle_profile_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_update
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_profile_update();

-- Function to create a profile for a new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.email, (new.raw_user_meta_data->>'role')::public.app_role);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create a profile when a new user signs up
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- 3. Create other LMS tables
CREATE TABLE public.groups (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    grade public.grade NOT NULL,
    letter public.letter NOT NULL,
    specialty public.specialty NOT NULL,
    shift public.shift NOT NULL,
    teacher_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.groups IS 'Stores academic groups.';

CREATE TABLE public.group_members (
    group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    PRIMARY KEY (group_id, user_id)
);
COMMENT ON TABLE public.group_members IS 'Join table for groups and users (students).';

CREATE TABLE public.tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    type public.task_type NOT NULL,
    group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    due_date TIMESTAMPTZ,
    status public.task_status NOT NULL DEFAULT 'pending',
    created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.tasks IS 'Stores tasks for groups.';

CREATE TABLE public.task_assignees (
    task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, user_id)
);
COMMENT ON TABLE public.task_assignees IS 'Join table for tasks and assigned users.';

CREATE TABLE public.announcements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    group_id uuid REFERENCES public.groups(id) ON DELETE CASCADE, -- NULL for global announcements
    created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    priority public.announcement_priority NOT NULL DEFAULT 'medium'
);
COMMENT ON TABLE public.announcements IS 'Stores announcements for groups or all users.';

-- 4. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_assignees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- 5. Create helper functions for RLS
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS public.app_role AS $$
  SELECT role FROM public.profiles WHERE id = _user_id;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_group_member(_group_id uuid, _user_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members WHERE group_id = _group_id AND user_id = _user_id
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_group_teacher(_group_id uuid, _user_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.groups WHERE id = _group_id AND teacher_id = _user_id
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 6. Define RLS Policies
-- Profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Teachers can view their students' profiles" ON public.profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.groups g
    JOIN public.group_members gm ON g.id = gm.group_id
    WHERE g.teacher_id = auth.uid() AND gm.user_id = profiles.id
  )
);

-- Groups
CREATE POLICY "Users can manage groups based on role" ON public.groups
FOR ALL USING (is_group_teacher(id, auth.uid()) OR get_user_role(auth.uid()) = 'teacher')
WITH CHECK (get_user_role(auth.uid()) = 'teacher');

CREATE POLICY "Group members can view their groups" ON public.groups
FOR SELECT USING (is_group_member(id, auth.uid()));

-- Group Members
CREATE POLICY "Teachers can manage their group members" ON public.group_members
FOR ALL USING (is_group_teacher(group_id, auth.uid()));

CREATE POLICY "Users can view their own group membership" ON public.group_members
FOR SELECT USING (user_id = auth.uid());

-- Tasks
CREATE POLICY "Teachers can manage tasks in their groups" ON public.tasks
FOR ALL USING (is_group_teacher(group_id, auth.uid()));

CREATE POLICY "Assigned students can view tasks" ON public.tasks
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.task_assignees
    WHERE task_id = tasks.id AND user_id = auth.uid()
  )
);

-- Task Assignees
CREATE POLICY "Teachers can manage task assignees in their groups" ON public.task_assignees
FOR ALL USING (
  is_group_teacher((SELECT group_id FROM public.tasks WHERE id = task_id), auth.uid())
);

CREATE POLICY "Assigned students can view their assignment" ON public.task_assignees
FOR SELECT USING (user_id = auth.uid());

-- Announcements
CREATE POLICY "Teachers can manage announcements" ON public.announcements
FOR ALL USING (get_user_role(auth.uid()) = 'teacher');

CREATE POLICY "Users can view relevant announcements" ON public.announcements
FOR SELECT USING (
    group_id IS NULL OR 
    is_group_member(group_id, auth.uid()) OR
    is_group_teacher(group_id, auth.uid())
);

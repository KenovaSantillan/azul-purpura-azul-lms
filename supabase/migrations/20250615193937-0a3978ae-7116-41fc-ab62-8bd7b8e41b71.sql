
-- Perfeccionar políticas de RLS para el rol de Administrador

-- RLS para Administradores en la tabla 'profiles'
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE USING (get_user_role(auth.uid()) = 'admin');

-- RLS para Administradores en la tabla 'groups'
DROP POLICY IF EXISTS "Users can manage groups based on role" ON public.groups;
CREATE POLICY "Teachers and Admins can manage groups" ON public.groups FOR ALL USING (is_group_teacher(id, auth.uid()) OR get_user_role(auth.uid()) IN ('teacher', 'admin')) WITH CHECK (get_user_role(auth.uid()) IN ('teacher', 'admin'));
DROP POLICY IF EXISTS "Group members can view their groups" ON public.groups;
CREATE POLICY "Group members, teachers and admins can view groups" ON public.groups FOR SELECT USING (is_group_member(id, auth.uid()) OR is_group_teacher(id, auth.uid()) OR get_user_role(auth.uid()) = 'admin');

-- RLS para Administradores en la tabla 'group_members'
CREATE POLICY "Admins can manage all group members" ON public.group_members FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- RLS para Administradores en la tabla 'tasks'
CREATE POLICY "Admins can manage tasks" ON public.tasks FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- RLS para Administradores en la tabla 'task_assignees'
CREATE POLICY "Admins can manage task assignees" ON public.task_assignees FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- RLS para Administradores en la tabla 'announcements'
DROP POLICY IF EXISTS "Teachers can manage announcements" ON public.announcements;
CREATE POLICY "Teachers and Admins can manage announcements" ON public.announcements FOR ALL USING (get_user_role(auth.uid()) IN ('teacher', 'admin')) WITH CHECK (get_user_role(auth.uid()) IN ('teacher', 'admin'));
DROP POLICY IF EXISTS "Users can view relevant announcements" ON public.announcements;
CREATE POLICY "Users and admins can view relevant announcements" ON public.announcements FOR SELECT USING (group_id IS NULL OR is_group_member(group_id, auth.uid()) OR is_group_teacher(group_id, auth.uid()) OR get_user_role(auth.uid()) = 'admin');

-- RLS para Administradores en la tabla 'task_submissions'
CREATE POLICY "Admins can manage all submissions" ON public.task_submissions FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- RLS para Administradores en la tabla 'teams'
DROP POLICY IF EXISTS "La información del equipo es accesible para los miembros del grupo" ON public.teams;
CREATE POLICY "Team info accessible to group members and admins" ON public.teams FOR SELECT USING (is_group_member(group_id, auth.uid()) OR is_group_teacher(group_id, auth.uid()) OR get_user_role(auth.uid()) = 'admin');
DROP POLICY IF EXISTS "Los profesores pueden gestionar equipos en sus grupos" ON public.teams;
CREATE POLICY "Teachers and admins can manage teams" ON public.teams FOR ALL USING (is_group_teacher(group_id, auth.uid()) OR get_user_role(auth.uid()) = 'admin');

-- RLS para Administradores en la tabla 'team_members'
CREATE POLICY "Admins can manage all team members" ON public.team_members FOR ALL USING (get_user_role(auth.uid()) = 'admin');


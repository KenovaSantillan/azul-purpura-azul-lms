
-- Crear un nuevo tipo para los tipos de recursos
CREATE TYPE public.resource_type AS ENUM ('file', 'link');

-- Crear la tabla de recursos
CREATE TABLE public.resources (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    type public.resource_type NOT NULL,
    content text NOT NULL, -- URL para enlaces, ruta de archivo para archivos
    file_name text,
    file_type text,
    group_id uuid REFERENCES public.groups(id) ON DELETE SET NULL, -- Puede ser un recurso general
    uploaded_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Habilitar RLS en la tabla de recursos
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios autenticados pueden ver los recursos
CREATE POLICY "Authenticated users can view resources"
ON public.resources FOR SELECT
USING (
  auth.role() = 'authenticated' AND (
    group_id IS NULL -- Los recursos generales son visibles para todos
    OR
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' -- Los administradores ven todo
    OR
    is_group_member(group_id, auth.uid()) -- Los miembros del grupo pueden verlo
    OR
    is_group_teacher(group_id, auth.uid()) -- El profesor del grupo puede verlo
  )
);

-- Política: Los profesores y administradores pueden crear recursos
CREATE POLICY "Teachers and Admins can create resources"
ON public.resources FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('teacher', 'admin') AND
  uploaded_by = auth.uid()
);

-- Política: Los profesores y administradores pueden actualizar sus propios recursos
CREATE POLICY "Teachers and Admins can update their own resources"
ON public.resources FOR UPDATE
USING (
  auth.role() = 'authenticated' AND
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('teacher', 'admin') AND
  uploaded_by = auth.uid()
)
WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('teacher', 'admin')
);


-- Política: Los profesores y administradores pueden eliminar sus propios recursos
CREATE POLICY "Teachers and Admins can delete their own resources"
ON public.resources FOR DELETE
USING (
  auth.role() = 'authenticated' AND
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('teacher', 'admin') AND
  uploaded_by = auth.uid()
);

-- Crear un trigger para actualizar la columna updated_at
CREATE OR REPLACE FUNCTION public.handle_resource_update()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_resource_update
BEFORE UPDATE ON public.resources
FOR EACH ROW EXECUTE PROCEDURE public.handle_resource_update();

-- Crear un bucket de almacenamiento para los archivos de recursos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('resource_files', 'resource_files', true, 5242880, ARRAY['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'])
ON CONFLICT (id) DO NOTHING;

-- Políticas para el bucket de almacenamiento
CREATE POLICY "Allow read access to authenticated users on resource_files"
ON storage.objects FOR SELECT
TO authenticated
USING ( bucket_id = 'resource_files' );

CREATE POLICY "Allow insert for teachers and admins on resource_files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'resource_files' AND
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('teacher', 'admin')
);

CREATE POLICY "Allow update for owners on resource_files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'resource_files' AND
    owner = auth.uid() AND
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('teacher', 'admin')
);

CREATE POLICY "Allow delete for owners on resource_files"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'resource_files' AND
    owner = auth.uid() AND
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('teacher', 'admin')
);


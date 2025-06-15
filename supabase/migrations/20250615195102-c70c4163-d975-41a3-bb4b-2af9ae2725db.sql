
-- Primero, creamos un tipo de dato para el estatus del grupo (activo o archivado).
CREATE TYPE public.group_status AS ENUM ('active', 'archived');

-- Ahora, añadimos las columnas 'tutor_id' y 'status' a la tabla de grupos.
ALTER TABLE public.groups
ADD COLUMN tutor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
ADD COLUMN status public.group_status NOT NULL DEFAULT 'active';

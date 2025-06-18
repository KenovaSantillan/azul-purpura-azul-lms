
-- Crear tabla para actividades
CREATE TABLE public.activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_number TEXT NOT NULL UNIQUE, -- Número consecutivo con formato 001, 002, etc.
  name TEXT NOT NULL,
  development TEXT, -- Descripción/desarrollo de la actividad
  deliverable TEXT, -- Producto a entregar
  score NUMERIC(5,2), -- Puntaje
  due_date TIMESTAMP WITH TIME ZONE, -- Fecha y hora de entrega
  allow_late_submissions BOOLEAN DEFAULT true, -- On/off para recibir actividades tardías
  extra_materials JSONB DEFAULT '[]'::jsonb, -- Array de materiales extra
  links JSONB DEFAULT '[]'::jsonb, -- Array de enlaces
  group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS en la tabla de actividades
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Política para que los maestros puedan gestionar actividades de sus grupos
CREATE POLICY "Teachers can manage activities in their groups"
ON public.activities
FOR ALL
USING (
  is_group_teacher(group_id, auth.uid())
);

-- Política para que los estudiantes puedan ver actividades de sus grupos
CREATE POLICY "Students can view activities in their groups"
ON public.activities
FOR SELECT
USING (
  is_group_member(group_id, auth.uid())
);

-- Función para generar el próximo número de actividad
CREATE OR REPLACE FUNCTION public.get_next_activity_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  next_num INTEGER;
  formatted_num TEXT;
BEGIN
  -- Obtener el siguiente número basado en el máximo existente
  SELECT COALESCE(MAX(CAST(activity_number AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.activities;
  
  -- Formatear con ceros a la izquierda (3 dígitos)
  formatted_num := LPAD(next_num::TEXT, 3, '0');
  
  RETURN formatted_num;
END;
$$;

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_activity_update()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER activity_updated_at
  BEFORE UPDATE ON public.activities
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_activity_update();

-- Índices para mejorar rendimiento
CREATE INDEX idx_activities_group_id ON public.activities(group_id);
CREATE INDEX idx_activities_created_by ON public.activities(created_by);
CREATE INDEX idx_activities_activity_number ON public.activities(activity_number);

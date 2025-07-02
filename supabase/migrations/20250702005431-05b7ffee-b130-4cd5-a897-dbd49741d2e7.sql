-- Agregar campo de unidad a la tabla de actividades
ALTER TABLE public.activities 
ADD COLUMN unit INTEGER DEFAULT 1 CHECK (unit IN (1, 2, 3));

-- Añadir índice para mejorar el rendimiento de las consultas por unidad
CREATE INDEX idx_activities_unit ON public.activities(unit);

-- Comentarios para documentar el campo
COMMENT ON COLUMN public.activities.unit IS 'Unidad académica (1, 2, o 3) a la que pertenece la actividad';
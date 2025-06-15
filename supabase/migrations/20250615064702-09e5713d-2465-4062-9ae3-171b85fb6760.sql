
-- Paso 1: Añadir una columna JSONB para la rúbrica estructurada en la tabla de tareas
ALTER TABLE public.tasks
ADD COLUMN rubric_structured JSONB;

COMMENT ON COLUMN public.tasks.rubric_structured IS 'Rúbrica estructurada en formato JSON, ej: [{"id": "crit1", "description": "...", "points": 30}].';

-- Paso 2: Añadir una columna JSONB para las calificaciones detalladas en la tabla de entregas
ALTER TABLE public.task_submissions
ADD COLUMN score_details JSONB;

COMMENT ON COLUMN public.task_submissions.score_details IS 'Calificaciones detalladas por criterio de la rúbrica, ej: {"crit1": 25}.';

-- Paso 3: Renombrar la columna de calificación para mayor claridad y reflejar que es el total
ALTER TABLE public.task_submissions
RENAME COLUMN score TO total_score;

COMMENT ON COLUMN public.task_submissions.total_score IS 'La calificación total calculada para la entrega.';

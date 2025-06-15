
-- Crear tabla para los equipos
CREATE TABLE public.teams (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.teams IS 'Almacena los equipos creados dentro de los grupos para tareas grupales.';

-- Crear tabla para los miembros de los equipos
CREATE TABLE public.team_members (
    team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    PRIMARY KEY (team_id, user_id)
);
COMMENT ON TABLE public.team_members IS 'Almacena los miembros de cada equipo.';

-- Políticas de seguridad a nivel de fila (RLS) para teams
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "La información del equipo es accesible para los miembros del grupo"
ON public.teams
FOR SELECT
USING (is_group_member(group_id, auth.uid()));

CREATE POLICY "Los profesores pueden gestionar equipos en sus grupos"
ON public.teams
FOR ALL
USING (is_group_teacher(group_id, auth.uid()));

-- Políticas de seguridad a nivel de fila (RLS) para team_members
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Los miembros del equipo pueden ser vistos por los miembros del grupo"
ON public.team_members
FOR SELECT
USING (
  is_group_member(
    (SELECT group_id FROM public.teams WHERE id = team_id),
    auth.uid()
  )
);

CREATE POLICY "Los profesores pueden gestionar los miembros del equipo en sus grupos"
ON public.team_members
FOR ALL
USING (
  is_group_teacher(
    (SELECT group_id FROM public.teams WHERE id = team_id),
    auth.uid()
  )
);

-- Actualizar la tabla task_submissions
ALTER TABLE public.task_submissions
ADD COLUMN team_id uuid REFERENCES public.teams(id) ON DELETE SET NULL,
ADD COLUMN submission_hash TEXT;

COMMENT ON COLUMN public.task_submissions.team_id IS 'Enlace al equipo para entregas grupales.';
COMMENT ON COLUMN public.task_submissions.submission_hash IS 'Hash del contenido de la entrega para detección de plagio.';

-- Eliminar la restricción de unicidad anterior
ALTER TABLE public.task_submissions DROP CONSTRAINT IF EXISTS task_submissions_task_id_student_id_key;

-- Añadir nuevos índices parciales de unicidad
CREATE UNIQUE INDEX idx_unique_individual_submission ON public.task_submissions(task_id, student_id) WHERE (team_id IS NULL);
CREATE UNIQUE INDEX idx_unique_team_submission ON public.task_submissions(task_id, team_id) WHERE (team_id IS NOT NULL);

-- Añadir índice de unicidad para la detección de plagio
CREATE UNIQUE INDEX idx_unique_submission_hash_per_task ON public.task_submissions(task_id, submission_hash) WHERE (submission_hash IS NOT NULL);

-- Añadir nuevo valor al enum para el estado de la tarea
ALTER TYPE public.task_status ADD VALUE IF NOT EXISTS 'plagiarized';


-- Add score and submission control columns to the tasks table
ALTER TABLE public.tasks
ADD COLUMN max_score NUMERIC(4, 2),
ADD COLUMN allow_late_submissions BOOLEAN NOT NULL DEFAULT TRUE;

-- Add new enum values for task status
ALTER TYPE public.task_status ADD VALUE IF NOT EXISTS 'submitted';
ALTER TYPE public.task_status ADD VALUE IF NOT EXISTS 'graded';

-- Create a table for task submissions
CREATE TABLE public.task_submissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    content TEXT,
    attachments JSONB,
    score NUMERIC(4, 2),
    teacher_feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (task_id, student_id)
);

-- Add comments for clarity
COMMENT ON TABLE public.task_submissions IS 'Stores student submissions for tasks.';
COMMENT ON COLUMN public.task_submissions.content IS 'Text content of the submission.';
COMMENT ON COLUMN public.task_submissions.attachments IS 'JSON array of attachment objects, e.g., [{ "fileName": "doc.pdf", "url": "..." }].';
COMMENT ON COLUMN public.task_submissions.score IS 'Score given by the teacher for the submission.';
COMMENT ON COLUMN public.task_submissions.teacher_feedback IS 'Feedback from the teacher on the submission.';

-- Enable Row Level Security on the new table
ALTER TABLE public.task_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Teachers can manage submissions within their assigned groups.
CREATE POLICY "Teachers can manage submissions in their groups"
ON public.task_submissions
FOR ALL
USING (
  is_group_teacher((SELECT group_id FROM public.tasks WHERE id = task_id), auth.uid())
);

-- RLS Policy: Students can manage their own submissions.
CREATE POLICY "Students can manage their own submissions"
ON public.task_submissions
FOR ALL
USING (student_id = auth.uid());

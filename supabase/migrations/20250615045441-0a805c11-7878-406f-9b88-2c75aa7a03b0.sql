
-- Add a column to store the grading rubric for each task
ALTER TABLE public.tasks
ADD COLUMN rubric TEXT;

-- Add a comment for clarity
COMMENT ON COLUMN public.tasks.rubric IS 'Stores the grading criteria or rubric for the task, to be used by the AI grader.';


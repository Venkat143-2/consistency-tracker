ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS sort_order double precision NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS tasks_user_date_sort_idx ON public.tasks (user_id, task_date, sort_order);
UPDATE public.tasks t SET sort_order = sub.rn FROM (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id, task_date ORDER BY created_at) AS rn FROM public.tasks
) sub WHERE t.id = sub.id AND t.sort_order = 0;
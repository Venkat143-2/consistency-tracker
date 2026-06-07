
-- Remove client-side INSERT capability on achievements
DROP POLICY IF EXISTS "Users insert own achievements" ON public.achievements;

-- Trusted server-side claim function: validates progress before inserting
CREATE OR REPLACE FUNCTION public.claim_achievement(_mission_id uuid)
RETURNS public.achievements
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  m public.missions%ROWTYPE;
  existing public.achievements%ROWTYPE;
  total_completed int := 0;
  login_streak int := 0;
  task_streak int := 0;
  hit100 int := 0;
  progress int := 0;
  cur date;
  inserted public.achievements%ROWTYPE;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO m FROM public.missions WHERE id = _mission_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Mission not found';
  END IF;

  SELECT * INTO existing FROM public.achievements
    WHERE user_id = uid AND mission_id = _mission_id LIMIT 1;
  IF FOUND THEN
    RETURN existing;
  END IF;

  -- total completed tasks
  SELECT count(*) INTO total_completed FROM public.tasks
    WHERE user_id = uid AND completed = true;

  -- login streak (consecutive days with any completed task, ending today or yesterday)
  cur := CURRENT_DATE;
  IF NOT EXISTS (SELECT 1 FROM public.tasks WHERE user_id = uid AND completed = true AND task_date = cur) THEN
    cur := cur - 1;
  END IF;
  WHILE EXISTS (SELECT 1 FROM public.tasks WHERE user_id = uid AND completed = true AND task_date = cur) LOOP
    login_streak := login_streak + 1;
    cur := cur - 1;
  END LOOP;

  -- task streak (consecutive perfect days)
  cur := CURRENT_DATE;
  IF NOT EXISTS (
    SELECT 1 FROM public.tasks WHERE user_id = uid AND task_date = cur
    GROUP BY task_date HAVING count(*) > 0 AND count(*) FILTER (WHERE completed) = count(*)
  ) THEN
    cur := cur - 1;
  END IF;
  WHILE EXISTS (
    SELECT 1 FROM public.tasks WHERE user_id = uid AND task_date = cur
    GROUP BY task_date HAVING count(*) > 0 AND count(*) FILTER (WHERE completed) = count(*)
  ) LOOP
    task_streak := task_streak + 1;
    cur := cur - 1;
  END LOOP;

  -- ever had a 100% day
  IF EXISTS (
    SELECT 1 FROM public.tasks WHERE user_id = uid
    GROUP BY task_date HAVING count(*) > 0 AND count(*) FILTER (WHERE completed) = count(*)
  ) THEN
    hit100 := 1;
  END IF;

  progress := CASE m.category
    WHEN 'login_streak' THEN login_streak
    WHEN 'task_streak'  THEN task_streak
    WHEN 'total_tasks'  THEN total_completed
    WHEN 'consistency'  THEN CASE WHEN m.key = 'cons_once' THEN hit100 ELSE task_streak END
    ELSE 0
  END;

  IF progress < m.target THEN
    RAISE EXCEPTION 'Mission requirements not met (% / %)', progress, m.target;
  END IF;

  INSERT INTO public.achievements (user_id, mission_id, badge_name)
    VALUES (uid, _mission_id, m.badge_name)
    RETURNING * INTO inserted;
  RETURN inserted;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_achievement(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_achievement(uuid) TO authenticated;

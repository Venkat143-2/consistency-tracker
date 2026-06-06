
CREATE TABLE public.missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  target integer NOT NULL,
  badge_name text NOT NULL,
  tier text NOT NULL DEFAULT 'bronze',
  icon text NOT NULL DEFAULT 'flame',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.missions TO authenticated;
GRANT ALL ON public.missions TO service_role;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Missions readable by authenticated" ON public.missions FOR SELECT TO authenticated USING (true);

CREATE TABLE public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  mission_id uuid NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
  badge_name text NOT NULL,
  unlocked_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, mission_id)
);
GRANT SELECT, INSERT, DELETE ON public.achievements TO authenticated;
GRANT ALL ON public.achievements TO service_role;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own achievements" ON public.achievements FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own achievements" ON public.achievements FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

INSERT INTO public.missions (key, title, description, category, target, badge_name, tier, icon, sort_order) VALUES
-- Login streak
('login_1','First Step','Login and complete at least one task for 1 day','login_streak',1,'Bronze Flame','bronze','flame',10),
('login_5','Consistent Starter','Login and complete a task for 5 consecutive days','login_streak',5,'Consistent Starter','bronze','flame',11),
('login_7','Weekly Warrior','Login and complete a task for 7 consecutive days','login_streak',7,'Weekly Warrior','silver','flame',12),
('login_10','Focused Mind','Login and complete a task for 10 consecutive days','login_streak',10,'Focused Mind','silver','flame',13),
('login_15','Half Month Hero','Login and complete a task for 15 consecutive days','login_streak',15,'Half Month Hero','gold','flame',14),
('login_30','Monthly Master','Login and complete a task for 30 consecutive days','login_streak',30,'Monthly Master','gold','flame',15),
('login_90','Quarter Champion','Login and complete a task for 90 consecutive days','login_streak',90,'Quarter Champion','diamond','gem',16),
('login_180','Half Year Legend','Login and complete a task for 180 consecutive days','login_streak',180,'Half Year Legend','legendary','crown',17),
('login_365','Discipline King','Login and complete a task for 365 consecutive days','login_streak',365,'Discipline King','champion','trophy',18),
-- Task streak (100% days)
('task_5','Beginner','Complete all planned tasks for 5 days in a row','task_streak',5,'Beginner','bronze','sprout',20),
('task_10','Dedicated','Complete all planned tasks for 10 days in a row','task_streak',10,'Dedicated','silver','zap',21),
('task_20','Focus Machine','Complete all planned tasks for 20 days in a row','task_streak',20,'Focus Machine','silver','flame',22),
('task_30','Discipline Builder','Complete all planned tasks for 30 days in a row','task_streak',30,'Discipline Builder','gold','shield',23),
('task_50','Iron Will','Complete all planned tasks for 50 days in a row','task_streak',50,'Iron Will','gold','dumbbell',24),
('task_100','Unbreakable','Complete all planned tasks for 100 days in a row','task_streak',100,'Unbreakable','diamond','rocket',25),
('task_365','Legendary','Complete all planned tasks for 365 days in a row','task_streak',365,'Legendary','legendary','star',26),
-- Total tasks
('total_10','First Victory','Complete a total of 10 tasks','total_tasks',10,'First Victory','bronze','book',30),
('total_25','Productive','Complete a total of 25 tasks','total_tasks',25,'Productive','bronze','book',31),
('total_50','Achiever','Complete a total of 50 tasks','total_tasks',50,'Achiever','silver','book',32),
('total_100','Performer','Complete a total of 100 tasks','total_tasks',100,'Performer','silver','book',33),
('total_250','Elite','Complete a total of 250 tasks','total_tasks',250,'Elite','diamond','gem',34),
('total_500','Master','Complete a total of 500 tasks','total_tasks',500,'Master','legendary','crown',35),
('total_1000','Grandmaster','Complete a total of 1000 tasks','total_tasks',1000,'Grandmaster','champion','trophy',36),
-- Consistency
('cons_once','Green Start','Reach 100% daily consistency once','consistency',1,'Green Start','bronze','circle-check',40),
('cons_7','Perfect Week','Maintain 100% consistency for 7 days','consistency',7,'Perfect Week','silver','sparkles',41),
('cons_30','Perfect Month','Maintain 100% consistency for 30 days','consistency',30,'Perfect Month','gold','star',42),
('cons_100','Consistency Legend','Maintain 100% consistency for 100 days','consistency',100,'Consistency Legend','legendary','galaxy',43);

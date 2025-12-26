ALTER TABLE public.clinic_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read clinic_settings"
ON public.clinic_settings
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow clinic members to manage their own clinic_settings"
ON public.clinic_settings
FOR ALL
USING (
  (SELECT clinic_id FROM public.profiles WHERE id = auth.uid()) = clinic_id
);

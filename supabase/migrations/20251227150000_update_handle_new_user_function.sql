CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, clinic_id, roles)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email, -- Add this line
    (new.raw_user_meta_data->>'clinic_id')::uuid,
    ARRAY[COALESCE(new.raw_user_meta_data->>'role', 'doctor')]::text[]
  );
  RETURN new;
END;
$$;

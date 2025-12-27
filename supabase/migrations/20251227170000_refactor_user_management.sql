
-- Drop the trigger and function from the previous migration
DROP TRIGGER IF EXISTS on_profile_change ON public.profiles;
DROP FUNCTION IF EXISTS public.update_auth_user_on_profile_change();

-- 1. Make clinic_id nullable in profiles table
ALTER TABLE public.profiles
ALTER COLUMN clinic_id DROP NOT NULL;

-- 2. Remove redundant columns from profiles table
ALTER TABLE public.profiles
DROP COLUMN IF EXISTS email,
DROP COLUMN IF EXISTS full_name;

-- 3. Update the handle_new_user function
-- This function will now only handle the creation of a profile for a new user.
-- The full_name will be stored in auth.users.raw_user_meta_data and a new user will have the 'admin' role by default.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, clinic_id, roles)
  VALUES (
    new.id,
    (new.raw_user_meta_data->>'clinic_id')::uuid,
    -- Gelen tekil rolü diziye çevirir (varsayılan: admin)
    ARRAY[COALESCE(new.raw_user_meta_data->>'role', 'admin')]::text[]
  );

  -- Additionally, update the auth.users table to store the full_name in raw_user_meta_data
    UPDATE auth.users
    SET raw_user_meta_data = raw_user_meta_data || jsonb_build_object('full_name', new.raw_user_meta_data->>'full_name')
    WHERE id = new.id;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create a function to get user's full name from auth.users
CREATE OR REPLACE FUNCTION public.get_user_full_name(user_id uuid)
RETURNS TEXT AS $$
  SELECT raw_user_meta_data->>'full_name'
  FROM auth.users
  WHERE id = user_id;
$$ LANGUAGE sql STABLE;

-- 5. Create a function to get user's email from auth.users
CREATE OR REPLACE FUNCTION public.get_user_email(user_id uuid)
RETURNS TEXT AS $$
  SELECT email
  FROM auth.users
  WHERE id = user_id;
$$ LANGUAGE sql STABLE;

-- Note: After this migration, you will need to update your application code
-- to use get_user_full_name(user_id) and get_user_email(user_id) functions
-- or join with auth.users to get the full name and email.

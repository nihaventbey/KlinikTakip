
CREATE OR REPLACE FUNCTION public.update_auth_user_on_profile_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the email has changed
  IF OLD.email IS DISTINCT FROM NEW.email THEN
    UPDATE auth.users
    SET email = NEW.email
    WHERE id = NEW.id;
  END IF;

  -- Check if the full_name has changed
  IF OLD.full_name IS DISTINCT FROM NEW.full_name THEN
    UPDATE auth.users
    SET raw_user_meta_data = raw_user_meta_data || jsonb_build_object('full_name', NEW.full_name)
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_change
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_auth_user_on_profile_change();

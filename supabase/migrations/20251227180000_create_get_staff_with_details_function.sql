
CREATE OR REPLACE FUNCTION get_staff_with_details(p_clinic_id uuid)
RETURNS TABLE (
  id uuid,
  clinic_id uuid,
  specialty text,
  commission_rate integer,
  phone text,
  is_active boolean,
  created_at timestamp with time zone,
  tenant_id uuid,
  roles text[],
  full_name text,
  email text
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.clinic_id,
    p.specialty,
    p.commission_rate,
    p.phone,
    p.is_active,
    p.created_at,
    p.tenant_id,
    p.roles,
    u.raw_user_meta_data->>'full_name' as full_name,
    u.email
  FROM
    public.profiles p
  JOIN
    auth.users u ON p.id = u.id
  WHERE
    p.clinic_id = p_clinic_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

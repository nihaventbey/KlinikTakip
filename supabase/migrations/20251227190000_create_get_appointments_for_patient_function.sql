
CREATE OR REPLACE FUNCTION get_appointments_for_patient(p_patient_id uuid, p_clinic_id uuid)
RETURNS TABLE (
  id uuid,
  clinic_id uuid,
  patient_id uuid,
  doctor_id uuid,
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  status text,
  title text,
  type text,
  notes text,
  doctor_full_name text
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.clinic_id,
    a.patient_id,
    a.doctor_id,
    a.start_time,
    a.end_time,
    a.status,
    a.title,
    a.type,
    a.notes,
    u.raw_user_meta_data->>'full_name' as doctor_full_name
  FROM
    public.appointments a
  LEFT JOIN
    auth.users u ON a.doctor_id = u.id
  WHERE
    a.patient_id = p_patient_id AND a.clinic_id = p_clinic_id
  ORDER BY
    a.start_time DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

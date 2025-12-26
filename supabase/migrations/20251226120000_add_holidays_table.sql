CREATE TABLE holidays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (clinic_id, date)
);

-- RLS Policies for holidays
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read holidays"
ON holidays
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow clinic members to manage their own holidays"
ON holidays
FOR ALL
USING (
  (SELECT clinic_id FROM profiles WHERE id = auth.uid()) = clinic_id
);

-- Trigger to update updated_at timestamp
CREATE TRIGGER handle_updated_at
BEFORE UPDATE ON holidays
FOR EACH ROW
EXECUTE PROCEDURE moddatetime (updated_at);

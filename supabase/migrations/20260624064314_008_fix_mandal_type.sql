-- Fix: Add 'taluka' to allowed mandal types
ALTER TABLE mandals DROP CONSTRAINT IF EXISTS mandals_type_check;
ALTER TABLE mandals ADD CONSTRAINT mandals_type_check CHECK (type = ANY (ARRAY['mandal'::text, 'taluk'::text, 'taluka'::text, 'block'::text, 'tehsil'::text, 'circle'::text]));
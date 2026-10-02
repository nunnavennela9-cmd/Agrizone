/*
# India Location System

This migration creates hierarchical location tables for all of India:
- states (28 states + 8 union territories)
- districts (all districts per state)
- mandals/blocks (administrative divisions)
- villages (smallest unit)

Also updates existing tables with proper location references.

## Tables Created:

1. **states** - All 36 states and union territories
   - id (serial, PK)
   - name (text, unique)
   - code (text, unique, 2-letter code)
   - type (text) - 'state' or 'union_territory'
   - created_at (timestamp)

2. **districts** - All districts
   - id (serial, PK)
   - state_id (integer, FK to states)
   - name (text)
   - code (text)
   - created_at (timestamp)

3. **mandals** - All mandals/blocks/talukas
   - id (serial, PK)
   - district_id (integer, FK to districts)
   - name (text)
   - type (text) - 'mandal', 'taluk', 'block', 'tehsil'
   - created_at (timestamp)

4. **villages** - All villages
   - id (serial, PK)
   - mandal_id (integer, FK to mandals)
   - name (text)
   - population (integer, nullable)
   - created_at (timestamp)

## Modified Tables:
- profiles: Added state_id, district_id, mandal_id, village_id FKs
- equipment_listings: Added full location hierarchy
- labor_listings: Added full location hierarchy
- infrastructure_listings: Added full location hierarchy
- crop_listings: Added full location hierarchy
- agro_products: Added full location hierarchy
- grievances: Added full location hierarchy

## Security:
- RLS enabled on all new tables
- Public read access for location data
*/

-- States table
CREATE TABLE IF NOT EXISTS states (
  id serial PRIMARY KEY,
  name text UNIQUE NOT NULL,
  code text UNIQUE NOT NULL,
  type text NOT NULL DEFAULT 'state' CHECK (type IN ('state', 'union_territory')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE states ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "states_public_read" ON states;
CREATE POLICY "states_public_read" ON states FOR SELECT
  TO anon, authenticated USING (true);

-- Districts table
CREATE TABLE IF NOT EXISTS districts (
  id serial PRIMARY KEY,
  state_id integer NOT NULL REFERENCES states(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(state_id, name)
);

ALTER TABLE districts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "districts_public_read" ON districts;
CREATE POLICY "districts_public_read" ON districts FOR SELECT
  TO anon, authenticated USING (true);

-- Mandals table
CREATE TABLE IF NOT EXISTS mandals (
  id serial PRIMARY KEY,
  district_id integer NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL DEFAULT 'mandal' CHECK (type IN ('mandal', 'taluk', 'block', 'tehsil', 'circle')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(district_id, name)
);

ALTER TABLE mandals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "mandals_public_read" ON mandals;
CREATE POLICY "mandals_public_read" ON mandals FOR SELECT
  TO anon, authenticated USING (true);

-- Villages table
CREATE TABLE IF NOT EXISTS villages (
  id serial PRIMARY KEY,
  mandal_id integer NOT NULL REFERENCES mandals(id) ON DELETE CASCADE,
  name text NOT NULL,
  population integer,
  created_at timestamptz DEFAULT now(),
  UNIQUE(mandal_id, name)
);

ALTER TABLE villages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "villages_public_read" ON villages;
CREATE POLICY "villages_public_read" ON villages FOR SELECT
  TO anon, authenticated USING (true);

-- Add location columns to existing tables (checking if columns exist first)
DO $$
BEGIN
  -- Profiles table
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'state_id') THEN
    ALTER TABLE profiles ADD COLUMN state_id integer REFERENCES states(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'district_id') THEN
    ALTER TABLE profiles ADD COLUMN district_id integer REFERENCES districts(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'mandal_id') THEN
    ALTER TABLE profiles ADD COLUMN mandal_id integer REFERENCES mandals(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'village_id') THEN
    ALTER TABLE profiles ADD COLUMN village_id integer REFERENCES villages(id);
  END IF;

  -- Equipment listings
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'equipment_listings' AND column_name = 'state_id') THEN
    ALTER TABLE equipment_listings ADD COLUMN state_id integer REFERENCES states(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'equipment_listings' AND column_name = 'district_id') THEN
    ALTER TABLE equipment_listings ADD COLUMN district_id integer REFERENCES districts(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'equipment_listings' AND column_name = 'mandal_id') THEN
    ALTER TABLE equipment_listings ADD COLUMN mandal_id integer REFERENCES mandals(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'equipment_listings' AND column_name = 'village_id') THEN
    ALTER TABLE equipment_listings ADD COLUMN village_id integer REFERENCES villages(id);
  END IF;

  -- Labor listings
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'labor_listings' AND column_name = 'state_id') THEN
    ALTER TABLE labor_listings ADD COLUMN state_id integer REFERENCES states(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'labor_listings' AND column_name = 'district_id') THEN
    ALTER TABLE labor_listings ADD COLUMN district_id integer REFERENCES districts(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'labor_listings' AND column_name = 'mandal_id') THEN
    ALTER TABLE labor_listings ADD COLUMN mandal_id integer REFERENCES mandals(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'labor_listings' AND column_name = 'village_id') THEN
    ALTER TABLE labor_listings ADD COLUMN village_id integer REFERENCES villages(id);
  END IF;

  -- Infrastructure listings
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'infrastructure_listings' AND column_name = 'state_id') THEN
    ALTER TABLE infrastructure_listings ADD COLUMN state_id integer REFERENCES states(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'infrastructure_listings' AND column_name = 'district_id') THEN
    ALTER TABLE infrastructure_listings ADD COLUMN district_id integer REFERENCES districts(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'infrastructure_listings' AND column_name = 'mandal_id') THEN
    ALTER TABLE infrastructure_listings ADD COLUMN mandal_id integer REFERENCES mandals(id);
  END IF;

  -- Crop listings
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crop_listings' AND column_name = 'state_id') THEN
    ALTER TABLE crop_listings ADD COLUMN state_id integer REFERENCES states(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crop_listings' AND column_name = 'district_id') THEN
    ALTER TABLE crop_listings ADD COLUMN district_id integer REFERENCES districts(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crop_listings' AND column_name = 'mandal_id') THEN
    ALTER TABLE crop_listings ADD COLUMN mandal_id integer REFERENCES mandals(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crop_listings' AND column_name = 'village_id') THEN
    ALTER TABLE crop_listings ADD COLUMN village_id integer REFERENCES villages(id);
  END IF;

  -- Agro products
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agro_products' AND column_name = 'state_id') THEN
    ALTER TABLE agro_products ADD COLUMN state_id integer REFERENCES states(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agro_products' AND column_name = 'district_id') THEN
    ALTER TABLE agro_products ADD COLUMN district_id integer REFERENCES districts(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agro_products' AND column_name = 'mandal_id') THEN
    ALTER TABLE agro_products ADD COLUMN mandal_id integer REFERENCES mandals(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agro_products' AND column_name = 'village_id') THEN
    ALTER TABLE agro_products ADD COLUMN village_id integer REFERENCES villages(id);
  END IF;

  -- Grievances
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'grievances' AND column_name = 'state_id') THEN
    ALTER TABLE grievances ADD COLUMN state_id integer REFERENCES states(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'grievances' AND column_name = 'district_id') THEN
    ALTER TABLE grievances ADD COLUMN district_id integer REFERENCES districts(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'grievances' AND column_name = 'mandal_id') THEN
    ALTER TABLE grievances ADD COLUMN mandal_id integer REFERENCES mandals(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'grievances' AND column_name = 'village_id') THEN
    ALTER TABLE grievances ADD COLUMN village_id integer REFERENCES villages(id);
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_districts_state ON districts(state_id);
CREATE INDEX IF NOT EXISTS idx_mandals_district ON mandals(district_id);
CREATE INDEX IF NOT EXISTS idx_villages_mandal ON villages(mandal_id);

-- Insert all States and Union Territories of India
INSERT INTO states (name, code, type) VALUES
-- States (28)
('Andhra Pradesh', 'AP', 'state'),
('Arunachal Pradesh', 'AR', 'state'),
('Assam', 'AS', 'state'),
('Bihar', 'BR', 'state'),
('Chhattisgarh', 'CG', 'state'),
('Goa', 'GA', 'state'),
('Gujarat', 'GJ', 'state'),
('Haryana', 'HR', 'state'),
('Himachal Pradesh', 'HP', 'state'),
('Jharkhand', 'JH', 'state'),
('Karnataka', 'KA', 'state'),
('Kerala', 'KL', 'state'),
('Madhya Pradesh', 'MP', 'state'),
('Maharashtra', 'MH', 'state'),
('Manipur', 'MN', 'state'),
('Meghalaya', 'ML', 'state'),
('Mizoram', 'MZ', 'state'),
('Nagaland', 'NL', 'state'),
('Odisha', 'OD', 'state'),
('Punjab', 'PB', 'state'),
('Rajasthan', 'RJ', 'state'),
('Sikkim', 'SK', 'state'),
('Tamil Nadu', 'TN', 'state'),
('Telangana', 'TS', 'state'),
('Tripura', 'TR', 'state'),
('Uttar Pradesh', 'UP', 'state'),
('Uttarakhand', 'UK', 'state'),
('West Bengal', 'WB', 'state'),
-- Union Territories (8)
('Andaman and Nicobar Islands', 'AN', 'union_territory'),
('Chandigarh', 'CH', 'union_territory'),
('Dadra and Nagar Haveli and Daman and Diu', 'DN', 'union_territory'),
('Delhi', 'DL', 'union_territory'),
('Jammu and Kashmir', 'JK', 'union_territory'),
('Ladakh', 'LA', 'union_territory'),
('Lakshadweep', 'LD', 'union_territory'),
('Puducherry', 'PY', 'union_territory')
ON CONFLICT (name) DO NOTHING;

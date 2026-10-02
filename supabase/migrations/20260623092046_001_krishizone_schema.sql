/*
# KrishiZone Database Schema

This migration creates the complete data model for KrishiZone, a hyper-local farm logistics platform.

## Tables Created:

1. **profiles** - Extended user data linked to auth.users
   - id (uuid, PK, references auth.users)
   - full_name (text) - Farmer/operator name
   - phone (text) - Contact number
   - village (text) - User's village
   - zone_id (text) - Zone identifier (medchal, nalgonda, karimnagar)
   - user_type (text) - 'farmer', 'laborer', 'dealer', 'owner'
   - created_at, updated_at (timestamps)

2. **equipment_listings** - Agricultural equipment for rent
   - id (uuid, PK)
   - user_id (uuid, references profiles)
   - zone_id (text) - Zone identifier
   - name, specs (text) - Equipment details
   - price_per_hour (integer) - Rental rate
   - available (boolean) - Availability status
   - contact_phone (text)
   - created_at, updated_at

3. **labor_listings** - Daily wage workers
   - id (uuid, PK)
   - user_id (uuid, references profiles)
   - zone_id (text)
   - skills (text[]) - Array of skills
   - rate_per_day (integer)
   - available (boolean)
   - age (integer)
   - created_at, updated_at

4. **infrastructure_listings** - Community infrastructure (drying yards, tubewells)
   - id (uuid, PK)
   - user_id (uuid, references profiles)
   - zone_id (text)
   - infra_type (text) - 'drying_yard' or 'tubewell'
   - name, village (text)
   - capacity, current_usage (integer)
   - unit (text) - 'sq ft' or 'lph'
   - pipe_size (text, nullable) - For tubewells
   - price_info (text) - Rental/usage cost
   - available (boolean)
   - created_at, updated_at

5. **crop_listings** - Direct-to-market crop sales
   - id (uuid, PK)
   - user_id (uuid, references profiles)
   - zone_id (text)
   - crop_name (text)
   - quantity (integer) - In quintals
   - price_per_quintal (integer)
   - village (text)
   - verified (boolean) - Admin verification status
   - status (text) - 'available', 'sold', 'withdrawn'
   - created_at, updated_at

6. **agro_products** - Agro-input dealer products
   - id (uuid, PK)
   - user_id (uuid, references profiles)
   - zone_id (text)
   - product_name, product_type (text)
   - price (integer)
   - stock (integer)
   - max_stock (integer)
   - created_at, updated_at

7. **grievances** - Village issue tracking
   - id (uuid, PK)
   - user_id (uuid, references profiles)
   - zone_id (text)
   - title, description (text)
   - category (text)
   - village (text)
   - votes (integer)
   - status (text) - 'open', 'in_progress', 'resolved'
   - created_at, updated_at

## Security:
- RLS enabled on ALL tables
- Owner-scoped CRUD: users can only manage their own listings
- Public read access for listings (anyone can view available resources)
- Grievances: public read, owner create/update, open voting
*/

-- User profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  village text,
  zone_id text NOT NULL DEFAULT 'medchal',
  user_type text NOT NULL DEFAULT 'farmer' CHECK (user_type IN ('farmer', 'laborer', 'dealer', 'owner')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_read_own_profile" ON profiles;
CREATE POLICY "users_read_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;
CREATE POLICY "users_update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "users_insert_own_profile" ON profiles;
CREATE POLICY "users_insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

-- Equipment listings
CREATE TABLE IF NOT EXISTS equipment_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  zone_id text NOT NULL,
  name text NOT NULL,
  specs text,
  price_per_hour integer NOT NULL,
  available boolean NOT NULL DEFAULT true,
  contact_phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE equipment_listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "equipment_public_read" ON equipment_listings;
CREATE POLICY "equipment_public_read" ON equipment_listings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "equipment_owner_insert" ON equipment_listings;
CREATE POLICY "equipment_owner_insert" ON equipment_listings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "equipment_owner_update" ON equipment_listings;
CREATE POLICY "equipment_owner_update" ON equipment_listings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "equipment_owner_delete" ON equipment_listings;
CREATE POLICY "equipment_owner_delete" ON equipment_listings FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Labor listings
CREATE TABLE IF NOT EXISTS labor_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  zone_id text NOT NULL,
  skills text[] NOT NULL DEFAULT '{}',
  rate_per_day integer NOT NULL,
  age integer,
  available boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE labor_listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "labor_public_read" ON labor_listings;
CREATE POLICY "labor_public_read" ON labor_listings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "labor_owner_insert" ON labor_listings;
CREATE POLICY "labor_owner_insert" ON labor_listings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "labor_owner_update" ON labor_listings;
CREATE POLICY "labor_owner_update" ON labor_listings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "labor_owner_delete" ON labor_listings;
CREATE POLICY "labor_owner_delete" ON labor_listings FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Infrastructure listings
CREATE TABLE IF NOT EXISTS infrastructure_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  zone_id text NOT NULL,
  infra_type text NOT NULL CHECK (infra_type IN ('drying_yard', 'tubewell')),
  name text NOT NULL,
  village text NOT NULL,
  capacity integer NOT NULL,
  current_usage integer NOT NULL DEFAULT 0,
  unit text NOT NULL DEFAULT 'sq ft',
  pipe_size text,
  price_info text,
  available boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE infrastructure_listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "infra_public_read" ON infrastructure_listings;
CREATE POLICY "infra_public_read" ON infrastructure_listings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "infra_owner_insert" ON infrastructure_listings;
CREATE POLICY "infra_owner_insert" ON infrastructure_listings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "infra_owner_update" ON infrastructure_listings;
CREATE POLICY "infra_owner_update" ON infrastructure_listings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "infra_owner_delete" ON infrastructure_listings;
CREATE POLICY "infra_owner_delete" ON infrastructure_listings FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Crop listings
CREATE TABLE IF NOT EXISTS crop_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  zone_id text NOT NULL,
  crop_name text NOT NULL,
  quantity integer NOT NULL,
  price_per_quintal integer NOT NULL,
  village text NOT NULL,
  verified boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'withdrawn')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE crop_listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crop_public_read" ON crop_listings;
CREATE POLICY "crop_public_read" ON crop_listings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "crop_owner_insert" ON crop_listings;
CREATE POLICY "crop_owner_insert" ON crop_listings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "crop_owner_update" ON crop_listings;
CREATE POLICY "crop_owner_update" ON crop_listings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "crop_owner_delete" ON crop_listings;
CREATE POLICY "crop_owner_delete" ON crop_listings FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Agro products
CREATE TABLE IF NOT EXISTS agro_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  zone_id text NOT NULL,
  product_name text NOT NULL,
  product_type text NOT NULL,
  price integer NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  max_stock integer NOT NULL DEFAULT 100,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE agro_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "agro_public_read" ON agro_products;
CREATE POLICY "agro_public_read" ON agro_products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "agro_owner_insert" ON agro_products;
CREATE POLICY "agro_owner_insert" ON agro_products FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "agro_owner_update" ON agro_products;
CREATE POLICY "agro_owner_update" ON agro_products FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "agro_owner_delete" ON agro_products;
CREATE POLICY "agro_owner_delete" ON agro_products FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Grievances
CREATE TABLE IF NOT EXISTS grievances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  zone_id text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  village text NOT NULL,
  votes integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "grievances_public_read" ON grievances;
CREATE POLICY "grievances_public_read" ON grievances FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "grievances_owner_insert" ON grievances;
CREATE POLICY "grievances_owner_insert" ON grievances FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "grievances_owner_update" ON grievances;
CREATE POLICY "grievances_owner_update" ON grievances FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "grievances_owner_delete" ON grievances;
CREATE POLICY "grievances_owner_delete" ON grievances FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers for updated_at
DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS equipment_updated_at ON equipment_listings;
CREATE TRIGGER equipment_updated_at BEFORE UPDATE ON equipment_listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS labor_updated_at ON labor_listings;
CREATE TRIGGER labor_updated_at BEFORE UPDATE ON labor_listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS infra_updated_at ON infrastructure_listings;
CREATE TRIGGER infra_updated_at BEFORE UPDATE ON infrastructure_listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS crop_updated_at ON crop_listings;
CREATE TRIGGER crop_updated_at BEFORE UPDATE ON crop_listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS agro_updated_at ON agro_products;
CREATE TRIGGER agro_updated_at BEFORE UPDATE ON agro_products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS grievances_updated_at ON grievances;
CREATE TRIGGER grievances_updated_at BEFORE UPDATE ON grievances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_equipment_zone ON equipment_listings(zone_id);
CREATE INDEX IF NOT EXISTS idx_equipment_user ON equipment_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_labor_zone ON labor_listings(zone_id);
CREATE INDEX IF NOT EXISTS idx_labor_user ON labor_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_infra_zone ON infrastructure_listings(zone_id);
CREATE INDEX IF NOT EXISTS idx_infra_user ON infrastructure_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_crop_zone ON crop_listings(zone_id);
CREATE INDEX IF NOT EXISTS idx_crop_user ON crop_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_agro_zone ON agro_products(zone_id);
CREATE INDEX IF NOT EXISTS idx_agro_user ON agro_products(user_id);
CREATE INDEX IF NOT EXISTS idx_grievances_zone ON grievances(zone_id);
CREATE INDEX IF NOT EXISTS idx_grievances_user ON grievances(user_id);

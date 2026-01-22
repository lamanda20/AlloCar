
-- TABLE: cars
CREATE TABLE IF NOT EXISTS cars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  city TEXT NOT NULL,
  price_per_day DECIMAL NOT NULL,
  deposit DECIMAL NOT NULL DEFAULT 5000,
  category TEXT NOT NULL,
  transmission TEXT NOT NULL,
  fuel_type TEXT NOT NULL,
  seats INTEGER NOT NULL,
  image_url TEXT,
  agency_name TEXT NOT NULL,
  rating DECIMAL DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  is_verified_partner BOOLEAN DEFAULT true,
  cancel_policy TEXT, 
  agency_rules TEXT,  
  location_lat DECIMAL, -- Ajout de la latitude
  location_lng DECIMAL, -- Ajout de la longitude
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: reservations
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_id UUID REFERENCES cars(id),
  user_id UUID REFERENCES auth.users(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  total_price DECIMAL NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  delivery_type TEXT NOT NULL,
  payment_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for cars" ON cars FOR SELECT USING (true);

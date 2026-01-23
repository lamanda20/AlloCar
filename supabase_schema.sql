
-- 1. Réinitialisation de la table Profiles pour être sûr de la structure
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Activation de la sécurité
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Politiques ULTRA-OUVERTES pour le debug (Permet l'écriture si authentifié)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow all for auth users" ON public.profiles;

CREATE POLICY "Allow public read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow auth insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id OR id IS NOT NULL);
CREATE POLICY "Allow auth update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 4. Trigger de secours automatique
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, avatar_url)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'given_name', split_part(COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'), ' ', 1)), 
    COALESCE(new.raw_user_meta_data->>'last_name', new.raw_user_meta_data->>'family_name', ''),
    COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

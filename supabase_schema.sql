
-- 1. Nettoyage radical
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.profiles;

-- 2. Création de la table avec une structure simple
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Désactiver temporairement RLS pour tester ou mettre des politiques larges
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Politiques de sécurité (Tout le monde peut voir, l'utilisateur peut TOUT faire sur son profil)
CREATE POLICY "Allow public read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow individual insert" ON public.profiles FOR INSERT WITH CHECK (true); -- Très permissif pour le debug
CREATE POLICY "Allow individual update" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow individual delete" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- 5. Trigger de secours (Côté serveur)
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

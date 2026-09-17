CREATE TABLE public.profiles (
  id text PRIMARY KEY,
  handle text UNIQUE,
  avatar_url text,
  bio text,
  addresses text[] NOT NULL DEFAULT '{}',
  holdings_public boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.profiles TO anon;
GRANT SELECT ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are readable by everyone"
  ON public.profiles FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create scribe_notes table for scribe transcripts and summaries
CREATE TABLE IF NOT EXISTS public.scribe_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  title TEXT,
  transcript TEXT NOT NULL,
  summary TEXT NOT NULL
);

-- Enable RLS (we will use permissive policies for now since auth isn't configured yet)
ALTER TABLE public.scribe_notes ENABLE ROW LEVEL SECURITY;

-- Permissive policies (temporary) - anyone can read/write. Replace once auth is added.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'scribe_notes' AND policyname = 'Allow all select'
  ) THEN
    CREATE POLICY "Allow all select" ON public.scribe_notes FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'scribe_notes' AND policyname = 'Allow all insert'
  ) THEN
    CREATE POLICY "Allow all insert" ON public.scribe_notes FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'scribe_notes' AND policyname = 'Allow all update'
  ) THEN
    CREATE POLICY "Allow all update" ON public.scribe_notes FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'scribe_notes' AND policyname = 'Allow all delete'
  ) THEN
    CREATE POLICY "Allow all delete" ON public.scribe_notes FOR DELETE USING (true);
  END IF;
END $$;

-- Timestamp trigger to keep updated_at fresh
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_scribe_notes_updated_at ON public.scribe_notes;
CREATE TRIGGER trg_scribe_notes_updated_at
BEFORE UPDATE ON public.scribe_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
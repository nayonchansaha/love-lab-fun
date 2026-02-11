
CREATE TABLE public.confessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  crush TEXT,
  hearts INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.confessions ENABLE ROW LEVEL SECURITY;

-- Anyone can read confessions
CREATE POLICY "Anyone can read confessions"
  ON public.confessions FOR SELECT
  USING (true);

-- Anyone can insert confessions (anonymous)
CREATE POLICY "Anyone can insert confessions"
  ON public.confessions FOR INSERT
  WITH CHECK (true);

-- Anyone can update hearts count
CREATE POLICY "Anyone can update confession hearts"
  ON public.confessions FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Insert initial Bengali confessions
INSERT INTO public.confessions (text, crush, hearts) VALUES
  ('৩ বছর ধরে বেস্ট ফ্রেন্ডের উপর ক্রাশ, কিন্তু সে কিছুই জানে না 🥺', 'বেনামী', 24),
  ('ক্লাসের একজনকে নিয়ে কবিতা লিখি আর নোটবুকে লুকিয়ে রাখি 📓', NULL, 18),
  ('রোমান্টিক মুভি দেখলে চোখে পানি আসে, কিন্তু সবার সামনে ভান করি যে পছন্দ করি না 😭', NULL, 42),
  ('ওর কথা মনে করে পুরো প্লেলিস্ট চেঞ্জ করে ফেলেছি 🎵', NULL, 15);

ALTER PUBLICATION supabase_realtime ADD TABLE public.confessions;

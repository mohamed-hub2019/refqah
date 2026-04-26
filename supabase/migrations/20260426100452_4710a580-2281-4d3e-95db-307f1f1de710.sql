-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  contact_method TEXT,
  service TEXT NOT NULL,
  preferred_time TEXT,
  city_area TEXT NOT NULL,
  short_address TEXT,
  case_description TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous) can submit a booking
CREATE POLICY "Anyone can create a booking"
ON public.bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Timestamp update function (idempotent)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index for sorting by date
CREATE INDEX idx_bookings_created_at ON public.bookings(created_at DESC);
-- Migration to add admin user and venue status management enhancements
-- Building upon existing schema: 20241216120000_hallbooker_initial_schema.sql

-- 1. Add venue status enum and enhance venues table
CREATE TYPE public.venue_status AS ENUM ('active', 'suspended', 'under_review', 'pending');

-- Add status and related fields to venues table
ALTER TABLE public.venues 
ADD COLUMN status public.venue_status DEFAULT 'pending'::public.venue_status,
ADD COLUMN suspension_reason TEXT,
ADD COLUMN suspension_date TIMESTAMPTZ,
ADD COLUMN review_notes TEXT,
ADD COLUMN last_status_change TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- 2. Add booking dispute status - split into separate transaction
ALTER TYPE public.booking_status ADD VALUE 'disputed';

-- Commit the enum change before using it
COMMIT;
BEGIN;

-- Add dispute fields to bookings table
ALTER TABLE public.bookings
ADD COLUMN dispute_reason TEXT,
ADD COLUMN dispute_date TIMESTAMPTZ,
ADD COLUMN dispute_resolved BOOLEAN DEFAULT false;

-- 3. Create venue status history table
CREATE TABLE public.venue_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE,
    previous_status public.venue_status,
    new_status public.venue_status,
    changed_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    reason TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Add indexes for new fields
CREATE INDEX idx_venues_status ON public.venues(status);
CREATE INDEX idx_venues_last_status_change ON public.venues(last_status_change);
-- Remove the WHERE clause that uses the new enum value to avoid the error
CREATE INDEX idx_bookings_dispute_status ON public.bookings(status);
-- Create a separate index for disputed bookings after the enum is committed
CREATE INDEX idx_bookings_dispute_date ON public.bookings(dispute_date) WHERE dispute_date IS NOT NULL;
CREATE INDEX idx_venue_status_history_venue_id ON public.venue_status_history(venue_id);

-- 5. Enable RLS for new table
ALTER TABLE public.venue_status_history ENABLE ROW LEVEL SECURITY;

-- 6. Helper functions for venue status management
CREATE OR REPLACE FUNCTION public.is_admin_or_venue_owner(venue_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.venues v
    WHERE v.id = venue_uuid AND (
        v.owner_id = auth.uid() OR
        public.is_admin()
    )
)
$$;

CREATE OR REPLACE FUNCTION public.can_manage_venue_status(venue_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT public.is_admin()
$$;

-- 7. RLS Policies for venue status history
CREATE POLICY "admins_manage_venue_status_history" ON public.venue_status_history
FOR ALL USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "owners_view_venue_status_history" ON public.venue_status_history
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.venues v
        WHERE v.id = venue_id AND v.owner_id = auth.uid()
    )
);

-- 8. Update existing venues policy for status management
DROP POLICY IF EXISTS "venues_public_read" ON public.venues;
CREATE POLICY "venues_public_read" ON public.venues
FOR SELECT USING (
    status = 'active' OR 
    owner_id = auth.uid() OR 
    public.is_admin()
);

-- 9. Trigger function for venue status history
CREATE OR REPLACE FUNCTION public.track_venue_status_changes()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Only track status changes
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO public.venue_status_history (
            venue_id, 
            previous_status, 
            new_status, 
            changed_by,
            reason,
            notes
        )
        VALUES (
            NEW.id,
            OLD.status,
            NEW.status,
            auth.uid(),
            NEW.suspension_reason,
            NEW.review_notes
        );
        
        -- Update last status change timestamp
        NEW.last_status_change := CURRENT_TIMESTAMP;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger for venue status tracking
CREATE TRIGGER on_venue_status_change
    BEFORE UPDATE ON public.venues
    FOR EACH ROW EXECUTE FUNCTION public.track_venue_status_changes();

-- 10. Update existing mock data and add admin user
DO $$
DECLARE
    admin_id UUID := gen_random_uuid();
    existing_venue_ids UUID[];
BEGIN
    -- Create admin user
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES (
        admin_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
        'superadmin@hallbooker.com', crypt('admin123!', gen_salt('bf', 10)), now(), now(), now(),
        '{"full_name": "Super Admin", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
        false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null
    );

    -- Update existing venues with different statuses
    SELECT ARRAY_AGG(id) INTO existing_venue_ids
    FROM public.venues
    LIMIT 3;

    IF array_length(existing_venue_ids, 1) >= 3 THEN
        -- Set first venue as active
        UPDATE public.venues 
        SET status = 'active'::public.venue_status
        WHERE id = existing_venue_ids[1];

        -- Set second venue as under review
        UPDATE public.venues 
        SET status = 'under_review'::public.venue_status,
            review_notes = 'Reviewing compliance with safety standards'
        WHERE id = existing_venue_ids[2];

        -- Set third venue as suspended
        UPDATE public.venues 
        SET status = 'suspended'::public.venue_status,
            suspension_reason = 'Multiple customer complaints about cleanliness',
            suspension_date = CURRENT_TIMESTAMP
        WHERE id = existing_venue_ids[3];
    END IF;

    -- Add more sample venues with different statuses
    INSERT INTO public.venues (owner_id, name, description, venue_type, location, address, capacity, price_per_hour, status, amenities) VALUES
        ((SELECT id FROM public.user_profiles WHERE role = 'venue_owner' LIMIT 1), 
         'City Convention Center', 'Large convention center for conferences and exhibitions', 'conference_room', 'Downtown Chicago', '123 Convention Ave, Chicago, IL', 500, 800.00, 'active',
         ARRAY['WiFi', 'Parking', 'Catering', 'AV Equipment']),
        ((SELECT id FROM public.user_profiles WHERE role = 'venue_owner' LIMIT 1), 
         'Luxury Rooftop Terrace', 'Exclusive rooftop venue with city skyline views', 'rooftop_venue', 'Manhattan, NY', '456 Sky High St, New York, NY', 120, 650.00, 'pending',
         ARRAY['Outdoor Space', 'Bar', 'City Views', 'Photography']),
        ((SELECT id FROM public.user_profiles WHERE role = 'venue_owner' LIMIT 1), 
         'Historic Manor House', 'Elegant historic venue for weddings and special events', 'historic_building', 'Boston, MA', '789 Heritage Lane, Boston, MA', 180, 550.00, 'suspended',
         ARRAY['Historic Character', 'Garden', 'Parking', 'Catering Kitchen']);

    -- Create a disputed booking (now safe to use 'disputed' enum value)
    INSERT INTO public.bookings (customer_id, venue_id, event_date, start_time, end_time, guest_count, event_type, total_amount, status, dispute_reason, dispute_date)
    VALUES (
        (SELECT id FROM public.user_profiles WHERE role = 'customer' LIMIT 1),
        existing_venue_ids[1],
        '2024-03-15',
        '19:00',
        '23:00',
        100,
        'Corporate Gala',
        1800.00,
        'disputed',
        'Venue was not properly cleaned before event, additional decorations were damaged',
        CURRENT_TIMESTAMP
    );

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error updating venue statuses and creating admin: %', SQLERRM;
END $$;

-- 11. Function to get venue status statistics
CREATE OR REPLACE FUNCTION public.get_venue_status_stats()
RETURNS TABLE(
    total_venues BIGINT,
    active_venues BIGINT,
    pending_venues BIGINT,
    under_review_venues BIGINT,
    suspended_venues BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_venues,
        COUNT(*) FILTER (WHERE status = 'active') as active_venues,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_venues,
        COUNT(*) FILTER (WHERE status = 'under_review') as under_review_venues,
        COUNT(*) FILTER (WHERE status = 'suspended') as suspended_venues
    FROM public.venues;
END;
$$;

-- 12. Function to get booking status statistics  
CREATE OR REPLACE FUNCTION public.get_booking_status_stats()
RETURNS TABLE(
    total_bookings BIGINT,
    pending_bookings BIGINT,
    confirmed_bookings BIGINT,
    completed_bookings BIGINT,
    cancelled_bookings BIGINT,
    disputed_bookings BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_bookings,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_bookings,
        COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_bookings,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_bookings,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_bookings,
        COUNT(*) FILTER (WHERE status = 'disputed') as disputed_bookings
    FROM public.bookings;
END;
$$;

-- 13. Create the disputed bookings index after enum is committed
-- This can be run in a separate transaction or after the migration is complete
-- CREATE INDEX idx_bookings_dispute_filter ON public.bookings(status) WHERE status = 'disputed';
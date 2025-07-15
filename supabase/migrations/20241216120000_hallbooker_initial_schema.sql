-- Supabase Hall Booking Platform Initial Schema Migration
-- This migration creates the foundational database schema for a hall booking platform

-- 1. Extensions and Types
CREATE TYPE public.user_role AS ENUM ('customer', 'venue_owner', 'admin');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE public.venue_type AS ENUM ('banquet_hall', 'conference_room', 'outdoor_venue', 'historic_building', 'rooftop_venue', 'community_center');
CREATE TYPE public.message_priority AS ENUM ('normal', 'high', 'urgent');

-- 2. User Profiles Table (Auth Integration)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    location TEXT,
    role public.user_role DEFAULT 'customer'::public.user_role,
    avatar_url TEXT,
    preferences JSONB DEFAULT '{"emailNotifications": true, "smsNotifications": false, "marketingEmails": true}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Venues Table
CREATE TABLE public.venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    venue_type public.venue_type NOT NULL,
    location TEXT NOT NULL,
    address TEXT,
    capacity INTEGER NOT NULL,
    price_per_hour DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    amenities TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Bookings Table
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference TEXT NOT NULL UNIQUE,
    customer_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    guest_count INTEGER NOT NULL,
    event_type TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    status public.booking_status DEFAULT 'pending'::public.booking_status,
    special_requests TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Favorite Venues Table
CREATE TABLE public.favorite_venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, venue_id)
);

-- 6. Messages Table
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    subject TEXT,
    content TEXT NOT NULL,
    priority public.message_priority DEFAULT 'normal'::public.message_priority,
    is_read BOOLEAN DEFAULT false,
    has_attachment BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Reviews Table
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(booking_id)
);

-- 8. Activity Logs Table
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. Essential Indexes
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_venues_owner_id ON public.venues(owner_id);
CREATE INDEX idx_venues_location ON public.venues(location);
CREATE INDEX idx_venues_type ON public.venues(venue_type);
CREATE INDEX idx_venues_active ON public.venues(is_active);
CREATE INDEX idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX idx_bookings_venue_id ON public.bookings(venue_id);
CREATE INDEX idx_bookings_date ON public.bookings(event_date);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_favorite_venues_user_id ON public.favorite_venues(user_id);
CREATE INDEX idx_messages_recipient_read ON public.messages(recipient_id, is_read);
CREATE INDEX idx_reviews_venue_id ON public.reviews(venue_id);
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);

-- 10. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorite_venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 11. Helper Functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
)
$$;

CREATE OR REPLACE FUNCTION public.is_venue_owner(venue_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.venues v
    WHERE v.id = venue_uuid AND v.owner_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.can_access_booking(booking_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.bookings b
    JOIN public.venues v ON b.venue_id = v.id
    WHERE b.id = booking_uuid AND (
        b.customer_id = auth.uid() OR 
        v.owner_id = auth.uid() OR
        public.is_admin()
    )
)
$$;

CREATE OR REPLACE FUNCTION public.can_access_message(message_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.messages m
    WHERE m.id = message_uuid AND (
        m.sender_id = auth.uid() OR 
        m.recipient_id = auth.uid() OR
        public.is_admin()
    )
)
$$;

-- 12. RLS Policies
-- User Profiles
CREATE POLICY "users_view_own_profile" ON public.user_profiles
FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "users_update_own_profile" ON public.user_profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "users_insert_own_profile" ON public.user_profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Venues
CREATE POLICY "venues_public_read" ON public.venues
FOR SELECT USING (is_active = true OR owner_id = auth.uid() OR public.is_admin());

CREATE POLICY "venue_owners_manage_venues" ON public.venues
FOR ALL USING (public.is_venue_owner(id) OR public.is_admin())
WITH CHECK (owner_id = auth.uid() OR public.is_admin());

-- Bookings
CREATE POLICY "booking_access_control" ON public.bookings
FOR ALL USING (public.can_access_booking(id))
WITH CHECK (customer_id = auth.uid());

-- Favorite Venues
CREATE POLICY "users_manage_favorites" ON public.favorite_venues
FOR ALL USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Messages
CREATE POLICY "message_access_control" ON public.messages
FOR ALL USING (public.can_access_message(id))
WITH CHECK (sender_id = auth.uid());

-- Reviews
CREATE POLICY "reviews_public_read" ON public.reviews
FOR SELECT USING (true);

CREATE POLICY "customers_manage_reviews" ON public.reviews
FOR ALL USING (customer_id = auth.uid())
WITH CHECK (customer_id = auth.uid());

-- Activity Logs
CREATE POLICY "users_view_own_activities" ON public.activity_logs
FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "users_insert_activities" ON public.activity_logs
FOR INSERT WITH CHECK (user_id = auth.uid());

-- 13. Trigger Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'customer')::public.user_role
    );
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_venue_rating()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE public.venues
    SET rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM public.reviews
        WHERE venue_id = NEW.venue_id
    ),
    review_count = (
        SELECT COUNT(*)
        FROM public.reviews
        WHERE venue_id = NEW.venue_id
    )
    WHERE id = NEW.venue_id;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_booking_reference()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.booking_reference := 'HB' || LPAD((EXTRACT(EPOCH FROM NOW())::bigint % 999999)::text, 6, '0');
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_user_activity()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF TG_TABLE_NAME = 'bookings' THEN
            INSERT INTO public.activity_logs (user_id, activity_type, description, metadata)
            VALUES (NEW.customer_id, 'booking_created', 'New booking created', jsonb_build_object('booking_id', NEW.id));
        ELSIF TG_TABLE_NAME = 'favorite_venues' THEN
            INSERT INTO public.activity_logs (user_id, activity_type, description, metadata)
            VALUES (NEW.user_id, 'venue_favorited', 'Added venue to favorites', jsonb_build_object('venue_id', NEW.venue_id));
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        IF TG_TABLE_NAME = 'bookings' AND OLD.status != NEW.status THEN
            INSERT INTO public.activity_logs (user_id, activity_type, description, metadata)
            VALUES (NEW.customer_id, 'booking_status_changed', 'Booking status updated to ' || NEW.status, jsonb_build_object('booking_id', NEW.id, 'old_status', OLD.status, 'new_status', NEW.status));
        END IF;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- 14. Triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_review_created_or_updated
    AFTER INSERT OR UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_venue_rating();

CREATE TRIGGER on_booking_insert
    BEFORE INSERT ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.generate_booking_reference();

CREATE TRIGGER on_booking_activity
    AFTER INSERT OR UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.log_user_activity();

CREATE TRIGGER on_favorite_activity
    AFTER INSERT ON public.favorite_venues
    FOR EACH ROW EXECUTE FUNCTION public.log_user_activity();

-- 15. Mock Data
DO $$
DECLARE
    customer_id UUID := gen_random_uuid();
    venue_owner_id UUID := gen_random_uuid();
    admin_id UUID := gen_random_uuid();
    venue1_id UUID := gen_random_uuid();
    venue2_id UUID := gen_random_uuid();
    venue3_id UUID := gen_random_uuid();
    booking1_id UUID := gen_random_uuid();
    booking2_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (customer_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'customer@example.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Sarah Johnson", "role": "customer"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (venue_owner_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'owner@example.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Michael Chen", "role": "venue_owner"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (admin_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@example.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Insert venues
    INSERT INTO public.venues (id, owner_id, name, description, venue_type, location, address, capacity, price_per_hour, original_price, amenities, images, rating, review_count) VALUES
        (venue1_id, venue_owner_id, 'Grand Ballroom at The Plaza', 'Elegant ballroom perfect for weddings, corporate events, and special celebrations. Features crystal chandeliers, hardwood floors, and state-of-the-art sound system.', 'banquet_hall', 'Manhattan, NY', '768 5th Ave, New York, NY 10019', 300, 450.00, 500.00, 
         ARRAY['WiFi', 'Parking', 'Kitchen', 'Sound System', 'Air Conditioning'], 
         ARRAY['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop'], 
         4.8, 127),
        (venue2_id, venue_owner_id, 'Riverside Conference Center', 'Modern conference facility with panoramic river views. Ideal for corporate meetings, seminars, and business events.', 'conference_room', 'Brooklyn, NY', '1 Water St, Brooklyn, NY 11201', 150, 280.00, null, 
         ARRAY['WiFi', 'Projector', 'Catering', 'Parking'], 
         ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop'], 
         4.6, 89),
        (venue3_id, venue_owner_id, 'Garden Pavilion', 'Beautiful outdoor pavilion surrounded by lush gardens. Perfect for weddings, garden parties, and outdoor celebrations.', 'outdoor_venue', 'Queens, NY', '47-01 111th St, Corona, NY 11368', 200, 320.00, null, 
         ARRAY['Outdoor Space', 'Garden', 'Catering', 'Photography'], 
         ARRAY['https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop'], 
         4.7, 156);

    -- Insert bookings
    INSERT INTO public.bookings (id, customer_id, venue_id, event_date, start_time, end_time, guest_count, event_type, total_amount, status, special_requests) VALUES
        (booking1_id, customer_id, venue1_id, '2024-02-15', '18:00', '23:00', 150, 'Wedding Reception', 2250.00, 'confirmed', 'Need additional lighting setup and floral arrangements'),
        (booking2_id, customer_id, venue2_id, '2024-01-28', '14:00', '18:00', 75, 'Corporate Event', 1120.00, 'pending', 'Require vegetarian catering options');

    -- Insert favorite venues
    INSERT INTO public.favorite_venues (user_id, venue_id) VALUES
        (customer_id, venue1_id),
        (customer_id, venue3_id);

    -- Insert messages
    INSERT INTO public.messages (sender_id, recipient_id, booking_id, subject, content, priority, is_read) VALUES
        (customer_id, venue_owner_id, booking1_id, 'Question about Grand Ballroom booking', 'Hi, I have some questions about the lighting setup for my upcoming wedding. Could you please provide more details about the available options?', 'normal', false),
        (venue_owner_id, customer_id, booking2_id, 'Booking confirmation pending', 'We are reviewing your booking request and will get back to you within 24 hours with confirmation.', 'high', true);

    -- Insert reviews
    INSERT INTO public.reviews (booking_id, venue_id, customer_id, rating, comment) VALUES
        (booking1_id, venue1_id, customer_id, 5, 'Absolutely amazing venue! The staff was professional and the space was perfect for our wedding.');

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error inserting mock data: %', SQLERRM;
END $$;
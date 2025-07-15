-- Migration to add admin utility functions
-- Building upon existing schema: 20241217120000_add_admin_and_venue_status.sql

-- 1. Function to get user role statistics
CREATE OR REPLACE FUNCTION public.get_user_role_stats()
RETURNS TABLE(
    total_users BIGINT,
    customer_users BIGINT,
    venue_owner_users BIGINT,
    admin_users BIGINT,
    active_users BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE role = 'customer') as customer_users,
        COUNT(*) FILTER (WHERE role = 'venue_owner') as venue_owner_users,
        COUNT(*) FILTER (WHERE role = 'admin') as admin_users,
        COUNT(*) FILTER (WHERE preferences->>'is_active' IS NULL OR preferences->>'is_active' = 'true') as active_users
    FROM public.user_profiles;
END;
$$;

-- 2. Function to get comprehensive venue statistics
CREATE OR REPLACE FUNCTION public.get_venue_analytics()
RETURNS TABLE(
    total_venues BIGINT,
    active_venues BIGINT,
    pending_venues BIGINT,
    suspended_venues BIGINT,
    total_bookings BIGINT,
    total_revenue NUMERIC,
    avg_rating NUMERIC,
    top_venue_type TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(v.*) as total_venues,
        COUNT(v.*) FILTER (WHERE v.status = 'active') as active_venues,
        COUNT(v.*) FILTER (WHERE v.status = 'pending' OR v.status = 'under_review') as pending_venues,
        COUNT(v.*) FILTER (WHERE v.status = 'suspended') as suspended_venues,
        COUNT(b.*) as total_bookings,
        COALESCE(SUM(b.total_amount), 0) as total_revenue,
        ROUND(AVG(v.rating), 2) as avg_rating,
        (
            SELECT v2.venue_type::TEXT
            FROM public.venues v2
            GROUP BY v2.venue_type
            ORDER BY COUNT(*) DESC
            LIMIT 1
        ) as top_venue_type
    FROM public.venues v
    LEFT JOIN public.bookings b ON v.id = b.venue_id;
END;
$$;

-- 2a. Create a specific function for venue status stats to match UI expectations
CREATE OR REPLACE FUNCTION public.get_venue_status_stats()
RETURNS TABLE(
    total_venues BIGINT,
    active_venues BIGINT,
    under_review_venues BIGINT,
    suspended_venues BIGINT,
    total_bookings BIGINT,
    total_revenue NUMERIC,
    avg_rating NUMERIC,
    top_venue_type TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(v.*) as total_venues,
        COUNT(v.*) FILTER (WHERE v.status = 'active') as active_venues,
        COUNT(v.*) FILTER (WHERE v.status = 'under_review' OR v.status = 'pending') as under_review_venues,
        COUNT(v.*) FILTER (WHERE v.status = 'suspended') as suspended_venues,
        COUNT(b.*) as total_bookings,
        COALESCE(SUM(b.total_amount), 0) as total_revenue,
        ROUND(AVG(v.rating), 2) as avg_rating,
        (
            SELECT v2.venue_type::TEXT
            FROM public.venues v2
            GROUP BY v2.venue_type
            ORDER BY COUNT(*) DESC
            LIMIT 1
        ) as top_venue_type
    FROM public.venues v
    LEFT JOIN public.bookings b ON v.id = b.venue_id;
END;
$$;

-- 3. Function to get booking revenue by period
CREATE OR REPLACE FUNCTION public.get_booking_revenue_stats(
    period_start DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    period_end DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
    period_revenue NUMERIC,
    period_bookings BIGINT,
    confirmed_bookings BIGINT,
    pending_bookings BIGINT,
    cancelled_bookings BIGINT,
    disputed_bookings BIGINT,
    avg_booking_value NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(b.total_amount), 0) as period_revenue,
        COUNT(b.*) as period_bookings,
        COUNT(b.*) FILTER (WHERE b.status = 'confirmed') as confirmed_bookings,
        COUNT(b.*) FILTER (WHERE b.status = 'pending') as pending_bookings,
        COUNT(b.*) FILTER (WHERE b.status = 'cancelled') as cancelled_bookings,
        COUNT(b.*) FILTER (WHERE b.status = 'disputed') as disputed_bookings,
        ROUND(AVG(b.total_amount), 2) as avg_booking_value
    FROM public.bookings b
    WHERE b.event_date BETWEEN period_start AND period_end;
END;
$$;

-- 4. Function to get venue owner performance metrics
CREATE OR REPLACE FUNCTION public.get_venue_owner_metrics(owner_uuid UUID)
RETURNS TABLE(
    total_venues BIGINT,
    active_venues BIGINT,
    total_bookings BIGINT,
    total_revenue NUMERIC,
    avg_venue_rating NUMERIC,
    completion_rate NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(v.*) as total_venues,
        COUNT(v.*) FILTER (WHERE v.status = 'active') as active_venues,
        COUNT(b.*) as total_bookings,
        COALESCE(SUM(b.total_amount), 0) as total_revenue,
        ROUND(AVG(v.rating), 2) as avg_venue_rating,
        CASE 
            WHEN COUNT(b.*) > 0 THEN 
                ROUND((COUNT(b.*) FILTER (WHERE b.status = 'completed')::NUMERIC / COUNT(b.*)) * 100, 2)
            ELSE 0 
        END as completion_rate
    FROM public.venues v
    LEFT JOIN public.bookings b ON v.id = b.venue_id
    WHERE v.owner_id = owner_uuid;
END;
$$;

-- 5. Function to get system health metrics
CREATE OR REPLACE FUNCTION public.get_system_health_metrics()
RETURNS TABLE(
    total_users BIGINT,
    active_users BIGINT,
    total_venues BIGINT,
    active_venues BIGINT,
    total_bookings BIGINT,
    disputed_bookings BIGINT,
    unread_messages BIGINT,
    system_alerts BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM public.user_profiles) as total_users,
        (SELECT COUNT(*) FROM public.user_profiles WHERE preferences->>'is_active' IS NULL OR preferences->>'is_active' = 'true') as active_users,
        (SELECT COUNT(*) FROM public.venues) as total_venues,
        (SELECT COUNT(*) FROM public.venues WHERE status = 'active') as active_venues,
        (SELECT COUNT(*) FROM public.bookings) as total_bookings,
        (SELECT COUNT(*) FROM public.bookings WHERE status = 'disputed') as disputed_bookings,
        (SELECT COUNT(*) FROM public.messages WHERE is_read = false) as unread_messages,
        (SELECT COUNT(*) FROM public.venues WHERE status = 'suspended') as system_alerts;
END;
$$;

-- 6. Function to get recent activity summary
CREATE OR REPLACE FUNCTION public.get_recent_activity_summary(
    limit_count INTEGER DEFAULT 50
)
RETURNS TABLE(
    activity_id UUID,
    user_full_name TEXT,
    user_email TEXT,
    activity_type TEXT,
    description TEXT,
    created_at TIMESTAMPTZ,
    metadata JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        al.id as activity_id,
        up.full_name as user_full_name,
        up.email as user_email,
        al.activity_type,
        al.description,
        al.created_at,
        al.metadata
    FROM public.activity_logs al
    JOIN public.user_profiles up ON al.user_id = up.id
    ORDER BY al.created_at DESC
    LIMIT limit_count;
END;
$$;

-- 7. Function to create admin user programmatically
CREATE OR REPLACE FUNCTION public.create_admin_user(
    admin_email TEXT,
    admin_full_name TEXT,
    admin_password TEXT
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT,
    user_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_user_id UUID;
    existing_user_id UUID;
BEGIN
    -- Check if user already exists
    SELECT id INTO existing_user_id 
    FROM public.user_profiles 
    WHERE email = admin_email;
    
    IF existing_user_id IS NOT NULL THEN
        RETURN QUERY SELECT false, 'User with this email already exists', existing_user_id;
        RETURN;
    END IF;
    
    -- Generate new UUID for the user
    new_user_id := gen_random_uuid();
    
    BEGIN
        -- Insert into auth.users
        INSERT INTO auth.users (
            id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
            created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
            is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
            recovery_token, recovery_sent_at, email_change_token_new, email_change,
            email_change_sent_at, email_change_token_current, email_change_confirm_status,
            reauthentication_token, reauthentication_sent_at, phone, phone_change,
            phone_change_token, phone_change_sent_at
        ) VALUES (
            new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
            admin_email, crypt(admin_password, gen_salt('bf', 10)), now(), now(), now(),
            jsonb_build_object('full_name', admin_full_name, 'role', 'admin'),
            '{"provider": "email", "providers": ["email"]}'::jsonb,
            false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null
        );
        
        -- The user_profiles entry should be created automatically via trigger
        -- But let's verify and insert if needed
        INSERT INTO public.user_profiles (id, email, full_name, role)
        VALUES (new_user_id, admin_email, admin_full_name, 'admin'::public.user_role)
        ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            full_name = EXCLUDED.full_name,
            role = EXCLUDED.role;
        
        RETURN QUERY SELECT true, 'Admin user created successfully', new_user_id;
        
    EXCEPTION
        WHEN unique_violation THEN
            RETURN QUERY SELECT false, 'User already exists', null::UUID;
        WHEN OTHERS THEN
            RETURN QUERY SELECT false, 'Failed to create admin user: ' || SQLERRM, null::UUID;
    END;
END;
$$;

-- 8. Function to cleanup test data
CREATE OR REPLACE FUNCTION public.cleanup_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    test_user_ids UUID[];
BEGIN
    -- Get all test user IDs
    SELECT ARRAY_AGG(id) INTO test_user_ids
    FROM auth.users
    WHERE email LIKE '%@example.com' OR email LIKE '%test%';

    IF test_user_ids IS NOT NULL THEN
        -- Delete in dependency order
        DELETE FROM public.activity_logs WHERE user_id = ANY(test_user_ids);
        DELETE FROM public.reviews WHERE customer_id = ANY(test_user_ids);
        DELETE FROM public.messages WHERE sender_id = ANY(test_user_ids) OR recipient_id = ANY(test_user_ids);
        DELETE FROM public.favorite_venues WHERE user_id = ANY(test_user_ids);
        DELETE FROM public.venue_status_history WHERE venue_id IN (SELECT id FROM public.venues WHERE owner_id = ANY(test_user_ids));
        DELETE FROM public.bookings WHERE customer_id = ANY(test_user_ids);
        DELETE FROM public.venues WHERE owner_id = ANY(test_user_ids);
        DELETE FROM public.user_profiles WHERE id = ANY(test_user_ids);
        DELETE FROM auth.users WHERE id = ANY(test_user_ids);
    END IF;
END;
$$;

-- 9. Create additional admin user for testing
DO $$
DECLARE
    admin_result RECORD;
BEGIN
    -- Create a test admin user
    SELECT * INTO admin_result FROM public.create_admin_user(
        'admin@hallbooker.com',
        'Hall Booker Admin',
        'admin123!'
    );
    
    IF admin_result.success THEN
        -- Log the admin creation
        INSERT INTO public.activity_logs (user_id, activity_type, description, metadata)
        VALUES (
            admin_result.user_id,
            'admin_created',
            'Admin user created via migration',
            jsonb_build_object('created_by', 'system', 'email', 'admin@hallbooker.com')
        );
    END IF;
    
    RAISE NOTICE 'Admin user creation result: %', admin_result.message;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error creating admin user: %', SQLERRM;
END $$;

-- 10. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_role_active ON public.user_profiles(role) WHERE preferences->>'is_active' IS NULL OR preferences->>'is_active' = 'true';
CREATE INDEX IF NOT EXISTS idx_venues_owner_status ON public.venues(owner_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_status_date ON public.bookings(status, event_date);
CREATE INDEX IF NOT EXISTS idx_activity_logs_type_date ON public.activity_logs(activity_type, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_read ON public.messages(recipient_id, is_read);
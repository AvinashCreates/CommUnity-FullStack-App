-- Create default admin user with proper setup
-- First, let's ensure we have a function to create the default admin

-- Function to safely create default admin
CREATE OR REPLACE FUNCTION create_default_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Check if admin user already exists
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'admin@community.local' 
  LIMIT 1;
  
  -- If admin doesn't exist, we'll create the user record directly
  -- Note: The actual auth user will be created via the application
  IF admin_user_id IS NULL THEN
    -- Create a placeholder admin user_id for our tables
    admin_user_id := gen_random_uuid();
    
    -- Create admin profile (will be updated when real user is created)
    INSERT INTO public.profiles (user_id, name, email, phone, address)
    VALUES (
      admin_user_id, 
      'System Administrator', 
      'admin@community.local',
      '+1234567890',
      'Community Management Office'
    )
    ON CONFLICT (user_id) DO UPDATE SET
      name = EXCLUDED.name,
      email = EXCLUDED.email,
      phone = EXCLUDED.phone,
      address = EXCLUDED.address;
    
    -- Assign admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Create some sample data for the admin dashboard
    -- Sample announcements
    INSERT INTO public.announcements (
      title, content, type, priority, location, authority, attachment_url
    ) VALUES 
    (
      'Welcome to Community Portal',
      'Welcome to our new Community Issue Management Portal. Report issues, stay informed with announcements, and connect with local vendors.',
      'general',
      'high',
      'Community Wide',
      'System Administrator',
      null
    ),
    (
      'Emergency Contact Information',
      'For urgent issues requiring immediate attention, please contact our emergency hotline at 911 or our non-emergency line at (555) 123-4567.',
      'emergency',
      'high',
      'Community Wide',
      'Emergency Services',
      null
    )
    ON CONFLICT DO NOTHING;
    
    -- Sample vendors
    INSERT INTO public.vendors (
      name, description, category, phone, email, address, services, hours, verified, rating, reviews_count
    ) VALUES 
    (
      'Green Valley Landscaping',
      'Professional landscaping and garden maintenance services for residential and commercial properties.',
      'Landscaping',
      '(555) 123-0001',
      'info@greenvalleylandscaping.com',
      '123 Garden St, Community City, CC 12345',
      ARRAY['Lawn Maintenance', 'Tree Trimming', 'Garden Design', 'Irrigation Systems'],
      'Mon-Fri 8AM-6PM, Sat 9AM-4PM',
      true,
      4.8,
      24
    ),
    (
      'Reliable Plumbing Co',
      '24/7 emergency plumbing services with experienced licensed plumbers.',
      'Plumbing',
      '(555) 123-0002',
      'service@reliableplumbing.com',
      '456 Water St, Community City, CC 12345',
      ARRAY['Emergency Repairs', 'Pipe Installation', 'Drain Cleaning', 'Water Heater Service'],
      '24/7 Emergency Service',
      true,
      4.9,
      18
    ),
    (
      'Community Electric Solutions',
      'Licensed electricians providing safe and reliable electrical services.',
      'Electrical',
      '(555) 123-0003',
      'contact@communityelectric.com',
      '789 Electric Ave, Community City, CC 12345',
      ARRAY['Electrical Repairs', 'Panel Upgrades', 'Lighting Installation', 'Safety Inspections'],
      'Mon-Fri 7AM-7PM, Weekend Emergency Service',
      true,
      4.7,
      31
    )
    ON CONFLICT DO NOTHING;
    
  END IF;
END;
$$;

-- Execute the function to create default admin setup
SELECT create_default_admin();
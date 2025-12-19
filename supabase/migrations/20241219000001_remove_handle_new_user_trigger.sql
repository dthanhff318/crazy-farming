-- Drop trigger and function for handle_new_user if exists
-- This is replaced by explicit create_new_user edge function call

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

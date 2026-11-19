-- Phase 2 REBUILD: Drop all existing public tables for a clean spec-compliant schema
-- This drops every table in the public schema
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  LOOP
    EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE;';
  END LOOP;
END $$;

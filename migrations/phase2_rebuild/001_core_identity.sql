-- Phase 2 REBUILD - Group 1: Core identity and users
-- Tables: profiles, user_roles, student_profiles, tutor_profiles, professional_profiles,
--         professional_credentials, institutions, institution_verifications,
--         institution_representatives, institution_members

-- profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  display_name TEXT,
  username TEXT,
  profile_photo_url TEXT,
  cover_photo_url TEXT,
  biography TEXT,
  user_category TEXT NOT NULL DEFAULT 'general_learner',
  institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
  programme TEXT,
  examination_level TEXT,
  courses TEXT[],
  professional_qualifications TEXT[],
  skills TEXT[],
  interests TEXT[],
  experience TEXT,
  general_location TEXT,
  website TEXT,
  social_links TEXT[],
  full_name TEXT,
  account_type TEXT,
  role TEXT,
  bio TEXT,
  graduation_year TEXT,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_category ON public.profiles(user_category);
CREATE INDEX idx_profiles_institution ON public.profiles(institution_id);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- user_roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role TEXT NOT NULL,
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- student_profiles
CREATE TABLE public.student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  programme TEXT,
  examination_level TEXT,
  enrolled_courses TEXT[],
  examination_session_id UUID REFERENCES public.examination_sessions(id) ON DELETE SET NULL,
  institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_student_profiles_profile ON public.student_profiles(profile_id);
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

-- tutor_profiles
CREATE TABLE public.tutor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  qualifications TEXT[],
  expertise TEXT[],
  available_hours TEXT,
  preferred_mentee_categories TEXT[],
  verification_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_tutor_profiles_profile ON public.tutor_profiles(profile_id);
ALTER TABLE public.tutor_profiles ENABLE ROW LEVEL SECURITY;

-- professional_profiles
CREATE TABLE public.professional_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  qualifications TEXT[],
  expertise TEXT[],
  experience TEXT,
  available_hours TEXT,
  preferred_mentee_categories TEXT[],
  verification_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_professional_profiles_profile ON public.professional_profiles(profile_id);
ALTER TABLE public.professional_profiles ENABLE ROW LEVEL SECURITY;

-- professional_credentials
CREATE TABLE public.professional_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  credential_type TEXT NOT NULL,
  credential_name TEXT NOT NULL,
  issuing_body TEXT,
  certificate_number TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending',
  verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  document_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_prof_cred_profile ON public.professional_credentials(profile_id);
ALTER TABLE public.professional_credentials ENABLE ROW LEVEL SECURITY;

-- institutions
CREATE TABLE public.institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  logo_url TEXT,
  location TEXT,
  description TEXT,
  official_representative UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  verification_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_institutions_name ON public.institutions(name);
CREATE INDEX idx_institutions_type ON public.institutions(type);
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;

-- institution_verifications
CREATE TABLE public.institution_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_inst_verify_inst ON public.institution_verifications(institution_id);
ALTER TABLE public.institution_verifications ENABLE ROW LEVEL SECURITY;

-- institution_representatives
CREATE TABLE public.institution_representatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'coordinator',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(institution_id, user_id)
);
CREATE INDEX idx_inst_rep_inst ON public.institution_representatives(institution_id);
CREATE INDEX idx_inst_rep_user ON public.institution_representatives(user_id);
ALTER TABLE public.institution_representatives ENABLE ROW LEVEL SECURITY;

-- institution_members
CREATE TABLE public.institution_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(institution_id, user_id)
);
CREATE INDEX idx_inst_members_inst ON public.institution_members(institution_id);
CREATE INDEX idx_inst_members_user ON public.institution_members(user_id);
ALTER TABLE public.institution_members ENABLE ROW LEVEL SECURITY;

-- Updated timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_user_roles_updated BEFORE UPDATE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_student_profiles_updated BEFORE UPDATE ON public.student_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_tutor_profiles_updated BEFORE UPDATE ON public.tutor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_professional_profiles_updated BEFORE UPDATE ON public.professional_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_professional_credentials_updated BEFORE UPDATE ON public.professional_credentials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_institutions_updated BEFORE UPDATE ON public.institutions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_institution_verifications_updated BEFORE UPDATE ON public.institution_verifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_institution_representatives_updated BEFORE UPDATE ON public.institution_representatives
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_institution_members_updated BEFORE UPDATE ON public.institution_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

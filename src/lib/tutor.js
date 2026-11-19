/**
 * VALENCE Tutor Application & Qualification (Phase 6)
 *
 * Client helpers for the tutor application flow, private certificate
 * uploads, admin verification and the 20-question / 45-minute timed
 * qualification exam. All writes go through Supabase Postgres RPC
 * functions (SECURITY DEFINER) which enforce ownership and the
 * ATSWA (AAT) / ICAN (AAT + ACA) certificate requirements.
 */

import { supabase } from './supabase';

export const TUTOR_CERTIFICATE_BUCKET = 'tutor-certificates';

/** Certificate requirements per teaching programme. */
export const CERTIFICATE_REQUIREMENTS = {
  ATSWA: ['AAT'],
  ICAN: ['AAT', 'ACA'],
};

/** Upload a certificate document to the private tutor-certificates bucket. */
export async function uploadTutorCertificate(file, tutorProfileId) {
  if (!supabase) return { error: 'Supabase Storage is not configured.' };
  const { data: sessionData } = await supabase.auth.getSession();
  const uid = sessionData?.session?.user?.id;
  if (!uid) return { error: 'Not authenticated.' };
  const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf';
  const fileName = `${uid}/certificates/${tutorProfileId}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from(TUTOR_CERTIFICATE_BUCKET)
    .upload(fileName, file, { contentType: file.type });
  if (error) return { error: error.message };
  return { fileName };
}

/** Submit a new tutor application (creates the tutor profile + assessment). */
export async function createTutorApplication({ qualifications, expertise, availableHours, preferredMenteeCategories }) {
  const { data, error } = await supabase.rpc('create_tutor_application', {
    p_qualifications: qualifications || [],
    p_expertise: expertise || [],
    p_available_hours: availableHours || '',
    p_preferred_mentee_categories: preferredMenteeCategories || [],
  });
  if (error) throw new Error(error.message || 'Unable to submit the tutor application.');
  if (data?.error) throw new Error(data.error);
  return data;
}

/** Record a certificate document already uploaded to private storage. */
export async function addTutorCertificate({ tutorProfileId, certificateType, certificateName, issuingBody, certificateNumber, documentUrl }) {
  const { data, error } = await supabase.rpc('add_tutor_certificate', {
    p_tutor_profile_id: tutorProfileId,
    p_certificate_type: certificateType,
    p_certificate_name: certificateName,
    p_issuing_body: issuingBody || '',
    p_certificate_number: certificateNumber || '',
    p_document_url: documentUrl,
  });
  if (error) throw new Error(error.message || 'Unable to record the certificate.');
  if (data?.error) throw new Error(data.error);
  return data;
}

/** Fetch the caller's own tutor application (or null). */
export async function fetchMyTutorProfile() {
  const { data, error } = await supabase
    .from('tutor_profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);
  if (error) throw new Error(error.message || 'Unable to load your tutor profile.');
  return data?.[0] || null;
}

/** Certificates belonging to a tutor profile. */
export async function fetchTutorCertificates(tutorProfileId) {
  const { data, error } = await supabase
    .from('tutor_certificates')
    .select('*')
    .eq('tutor_profile_id', tutorProfileId)
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message || 'Unable to load certificates.');
  return data || [];
}

/** The tutor's qualification assessment definition + score. */
export async function fetchTutorAssessment(tutorProfileId) {
  const { data, error } = await supabase
    .from('tutor_assessments')
    .select('*')
    .eq('tutor_profile_id', tutorProfileId)
    .order('created_at', { ascending: false })
    .limit(1);
  if (error) throw new Error(error.message || 'Unable to load the assessment.');
  return data?.[0] || null;
}

/** The 20 exam questions (option-index answers kept server-side only in correct_answer). */
export async function fetchAssessmentQuestions() {
  const { data, error } = await supabase
    .from('assessment_questions')
    .select('id, question_text, options, category, explanation')
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message || 'Unable to load the exam questions.');
  return data || [];
}

/** The caller's assessment attempts (exam history). */
export async function fetchAssessmentAttempts(tutorProfileId) {
  const { data, error } = await supabase
    .from('assessment_attempts')
    .select('id, score, passed, started_at, submitted_at')
    .eq('tutor_profile_id', tutorProfileId)
    .order('started_at', { ascending: false })
    .limit(10);
  if (error) throw new Error(error.message || 'Unable to load your attempts.');
  return data || [];
}

/** Start a timed exam attempt. Returns attempt_id + the 45-min configuration. */
export async function startAssessment(tutorProfileId) {
  const { data, error } = await supabase.rpc('start_tutor_assessment', {
    p_tutor_profile_id: tutorProfileId,
  });
  if (error) throw new Error(error.message || 'Unable to start the assessment.');
  if (data?.error) throw new Error(data.error);
  return data;
}

/** Submit the attempt. The server enforces the 45-minute limit and scores. */
export async function submitAssessment(attemptId, answers) {
  const { data, error } = await supabase.rpc('submit_tutor_assessment', {
    p_attempt_id: attemptId,
    p_answers: answers,
  });
  if (error) throw new Error(error.message || 'Unable to submit the assessment.');
  if (data?.error) throw new Error(data.error);
  return data;
}

/* ---------------- Admin verification ---------------- */

/** All tutor applications pending verification (admin). */
export async function fetchTutorApplications(status = 'pending') {
  const { data, error } = await supabase
    .from('tutor_profiles')
    .select('*')
    .eq('verification_status', status)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message || 'Unable to load tutor applications.');
  return data || [];
}

/** Approve or reject a tutor application (admin only, enforced server-side). */
export async function verifyTutor(tutorProfileId, action, programme) {
  const { data, error } = await supabase.rpc('verify_tutor', {
    p_tutor_profile_id: tutorProfileId,
    p_action: action,
    p_programme: programme,
  });
  if (error) throw new Error(error.message || 'Unable to verify the tutor.');
  if (data?.error) throw new Error(data.error);
  return data;
}

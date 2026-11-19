// Phase 14: Scholarships, Internships, Graduate Jobs, CPE/CPD Webinars &
// VALENCE PRO Verified Professional Hub.

import { supabase } from './supabase.js';

function unwrap(result, fallbackMessage = 'Request failed') {
  if (result.error) throw new Error(result.error.message || fallbackMessage);
  return result.data;
}

/* ------------------------------------------------------------------ */
/* Opportunities: scholarships, internships, graduate jobs           */
/* ------------------------------------------------------------------ */

export async function fetchOpportunities(category = null, limit = 50, offset = 0) {
  const { data, error } = await supabase.rpc('fetch_opportunities', {
    p_category: category,
    p_limit: limit,
    p_offset: offset,
  });
  return unwrap({ data, error }, 'Failed to load opportunities');
}

export async function fetchOpportunityDetails(opportunityId) {
  const { data, error } = await supabase.rpc('fetch_opportunity_details', {
    p_opportunity_id: opportunityId,
  });
  return unwrap({ data, error }, 'Failed to load opportunity');
}

export async function submitOpportunityApplication(opportunityId, applicationText, documentUrls = null) {
  const { data, error } = await supabase.rpc('submit_opportunity_application', {
    p_opportunity_id: opportunityId,
    p_application_text: applicationText,
    p_document_urls: documentUrls,
  });
  if (data && data.error) throw new Error(data.error);
  return unwrap({ data, error }, 'Failed to submit application');
}

export async function withdrawOpportunityApplication(applicationId) {
  const { data, error } = await supabase.rpc('withdraw_opportunity_application', {
    p_application_id: applicationId,
  });
  if (data && data.error) throw new Error(data.error);
  return unwrap({ data, error }, 'Failed to withdraw application');
}

export async function fetchMyOpportunityApplications(limit = 50) {
  const { data, error } = await supabase.rpc('fetch_my_opportunity_applications', {
    p_limit: limit,
  });
  return unwrap({ data, error }, 'Failed to load your applications');
}

/* ------------------------------------------------------------------ */
/* Admin: opportunity management + application review                */
/* ------------------------------------------------------------------ */

export async function manageOpportunity(payload) {
  const { data, error } = await supabase.rpc('manage_opportunity', payload);
  if (data && data.error) throw new Error(data.error);
  return unwrap({ data, error }, 'Failed to save opportunity');
}

export async function fetchOpportunityApplications(opportunityId = null) {
  const { data, error } = await supabase.rpc('fetch_opportunity_applications', {
    p_opportunity_id: opportunityId,
  });
  return unwrap({ data, error }, 'Failed to load applications');
}

export async function reviewOpportunityApplication(applicationId, decision) {
  const { data, error } = await supabase.rpc('review_opportunity_application', {
    p_application_id: applicationId,
    p_decision: decision,
  });
  if (data && data.error) throw new Error(data.error);
  return unwrap({ data, error }, 'Failed to review application');
}

/* ------------------------------------------------------------------ */
/* CPE / CPD Webinars                                                */
/* ------------------------------------------------------------------ */

export async function fetchCpdWebinars(limit = 50) {
  const { data, error } = await supabase.rpc('fetch_cpd_webinars', { p_limit: limit });
  return unwrap({ data, error }, 'Failed to load webinars');
}

export async function registerCpdWebinar(webinarId) {
  const { data, error } = await supabase.rpc('register_cpd_webinar', {
    p_webinar_id: webinarId,
  });
  if (data && data.error) throw new Error(data.error);
  return unwrap({ data, error }, 'Failed to register');
}

export async function fetchMyCpdRegistrations(limit = 50) {
  const { data, error } = await supabase.rpc('fetch_my_cpd_registrations', {
    p_limit: limit,
  });
  return unwrap({ data, error }, 'Failed to load your registrations');
}

/* ------------------------------------------------------------------ */
/* Admin: CPD webinar management + attendance                         */
/* ------------------------------------------------------------------ */

export async function manageCpdWebinar(payload) {
  const { data, error } = await supabase.rpc('manage_cpd_webinar', payload);
  if (data && data.error) throw new Error(data.error);
  return unwrap({ data, error }, 'Failed to save webinar');
}

export async function fetchCpdWebinarRegistrations(webinarId) {
  const { data, error } = await supabase.rpc('fetch_cpd_webinar_registrations', {
    p_webinar_id: webinarId,
  });
  return unwrap({ data, error }, 'Failed to load registrations');
}

export async function markCpdAttendance(webinarId, profileId, attended) {
  const { data, error } = await supabase.rpc('mark_cpd_attendance', {
    p_webinar_id: webinarId,
    p_profile_id: profileId,
    p_attended: attended,
  });
  if (data && data.error) throw new Error(data.error);
  return unwrap({ data, error }, 'Failed to record attendance');
}

/* ------------------------------------------------------------------ */
/* VALENCE PRO verified professional hub                             */
/* ------------------------------------------------------------------ */

export async function manageProfessionalProfile(payload) {
  const { data, error } = await supabase.rpc('manage_professional_profile', payload);
  if (data && data.error) throw new Error(data.error);
  return unwrap({ data, error }, 'Failed to save professional profile');
}

export async function fetchProfessionalProfileByProfile() {
  const { data, error } = await supabase.rpc('fetch_professional_profile_by_profile');
  return unwrap({ data, error }, 'Failed to load professional profile');
}

export async function fetchProfessionalDirectory(limit = 50, offset = 0) {
  const { data, error } = await supabase.rpc('fetch_professional_directory', {
    p_limit: limit,
    p_offset: offset,
  });
  return unwrap({ data, error }, 'Failed to load professional directory');
}

export async function submitProfessionalCredential(payload) {
  const { data, error } = await supabase.rpc('submit_professional_credential', payload);
  if (data && data.error) throw new Error(data.error);
  return unwrap({ data, error }, 'Failed to submit credential');
}

export async function fetchMyProfessionalCredentials() {
  const { data, error } = await supabase.rpc('fetch_my_professional_credentials');
  return unwrap({ data, error }, 'Failed to load credentials');
}

export async function fetchProfessionalCredentials(status = 'pending') {
  const { data, error } = await supabase.rpc('fetch_professional_credentials', {
    p_status: status,
  });
  return unwrap({ data, error }, 'Failed to load credential queue');
}

export async function reviewProfessionalCredential(credentialId, approved) {
  const { data, error } = await supabase.rpc('review_professional_credential', {
    p_credential_id: credentialId,
    p_approved: approved,
  });
  if (data && data.error) throw new Error(data.error);
  return unwrap({ data, error }, 'Failed to review credential');
}

export async function submitProfessionalVerification(payload) {
  const { data, error } = await supabase.rpc('submit_professional_verification', payload);
  if (data && data.error) throw new Error(data.error);
  return unwrap({ data, error }, 'Failed to request verification');
}

export async function fetchProfessionalVerificationQueue(status = 'pending') {
  const { data, error } = await supabase.rpc('fetch_professional_verification_queue', {
    p_status: status,
  });
  return unwrap({ data, error }, 'Failed to load verification queue');
}

export async function reviewProfessionalVerification(verificationId, approved, notes = null) {
  const { data, error } = await supabase.rpc('review_professional_verification', {
    p_verification_id: verificationId,
    p_approved: approved,
    p_notes: notes,
  });
  if (data && data.error) throw new Error(data.error);
  return unwrap({ data, error }, 'Failed to review verification');
}

export async function fetchMyProfessionalVerification() {
  const { data, error } = await supabase.rpc('fetch_my_professional_verification');
  return unwrap({ data, error }, 'Failed to load your verification');
}

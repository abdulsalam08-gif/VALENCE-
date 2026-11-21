// Phase 14: Scholarships, Internships & Graduate Jobs.

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

// Announcements library: official vs community posts, 7 audience scopes,
// likes, comments, shares/reposts, bookmarks, reporting & admin moderation.

import { supabase } from './supabase.js';

function unwrap(result) {
  if (result.error) throw new Error(result.error.message || 'Something went wrong');
  return result.data;
}

/* ------------------------------------------------------------------ */
/* Write                                                               */
/* ------------------------------------------------------------------ */

export async function createAnnouncement({
  title, content, audience, category, isOfficial,
  studyGroupId, institutionId, programme, course, status,
}) {
  const { data, error } = await supabase.rpc('create_announcement', {
    p_title: title,
    p_content: content,
    p_audience: audience || 'public',
    p_category: category || null,
    p_is_official: !!isOfficial,
    p_study_group_id: studyGroupId || null,
    p_institution_id: institutionId || null,
    p_programme: programme || null,
    p_course: course || null,
    p_status: status || 'published',
  });
  if (error) throw new Error(error.message || 'Failed to create announcement');
  return data;
}

export async function updateAnnouncement(id, patch) {
  const { data, error } = await supabase.rpc('update_announcement', {
    p_id: id,
    p_title: patch.title ?? null,
    p_content: patch.content ?? null,
    p_category: patch.category ?? null,
    p_audience: patch.audience ?? null,
    p_study_group_id: patch.studyGroupId ?? null,
    p_institution_id: patch.institutionId ?? null,
    p_programme: patch.programme ?? null,
    p_course: patch.course ?? null,
    p_status: patch.status ?? null,
  });
  if (error) throw new Error(error.message || 'Failed to update announcement');
  return data;
}

export async function deleteAnnouncement(id) {
  const { data, error } = await supabase.rpc('delete_announcement', { p_id: id });
  if (error) throw new Error(error.message || 'Failed to delete announcement');
  return data;
}

/* ------------------------------------------------------------------ */
/* Interactions                                                        */
/* ------------------------------------------------------------------ */

export async function toggleAnnouncementLike(id) {
  const { data, error } = await supabase.rpc('toggle_announcement_like', { p_id: id });
  if (error) throw new Error(error.message || 'Failed to update like');
  return data;
}

export async function toggleAnnouncementBookmark(id) {
  const { data, error } = await supabase.rpc('toggle_announcement_bookmark', { p_id: id });
  if (error) throw new Error(error.message || 'Failed to update bookmark');
  return data;
}

export async function addAnnouncementComment(id, content, parentCommentId) {
  const { data, error } = await supabase.rpc('add_announcement_comment', {
    p_id: id,
    p_content: content,
    p_parent_comment_id: parentCommentId || null,
  });
  if (error) throw new Error(error.message || 'Failed to post comment');
  return data;
}

export async function deleteAnnouncementComment(commentId) {
  const { data, error } = await supabase.rpc('delete_announcement_comment', { p_comment_id: commentId });
  if (error) throw new Error(error.message || 'Failed to delete comment');
  return data;
}

export async function shareAnnouncement(id, sharedTo) {
  const { data, error } = await supabase.rpc('share_announcement', {
    p_id: id,
    p_shared_to: sharedTo || null,
  });
  if (error) throw new Error(error.message || 'Failed to share');
  return data;
}

export async function reportAnnouncement(id, reason) {
  const { data, error } = await supabase.rpc('report_announcement', {
    p_id: id,
    p_reason: reason,
  });
  if (error) throw new Error(error.message || 'Failed to submit report');
  return data;
}

/* ------------------------------------------------------------------ */
/* Read                                                                */
/* ------------------------------------------------------------------ */

export async function fetchAnnouncements() {
  const { data, error } = await supabase.rpc('fetch_announcements');
  if (error) throw new Error(error.message || 'Failed to load announcements');
  return data || [];
}

export async function fetchAnnouncementDetail(id) {
  const { data, error } = await supabase.rpc('fetch_announcement_detail', { p_id: id });
  if (error) throw new Error(error.message || 'Failed to load announcement');
  return data;
}

export async function fetchAnnouncementComments(id) {
  const { data, error } = await supabase.rpc('fetch_announcement_comments', { p_id: id });
  if (error) throw new Error(error.message || 'Failed to load comments');
  return data || [];
}

/* ------------------------------------------------------------------ */
/* Admin moderation                                                    */
/* ------------------------------------------------------------------ */

export async function moderateAnnouncement(id, action) {
  const { data, error } = await supabase.rpc('moderate_announcement', { p_id: id, p_action: action });
  if (error) throw new Error(error.message || 'Failed to moderate');
  return data;
}

export async function reviewAnnouncementReport(reportId, action) {
  const { data, error } = await supabase.rpc('review_announcement_report', {
    p_report_id: reportId,
    p_action: action,
  });
  if (error) throw new Error(error.message || 'Failed to review report');
  return data;
}

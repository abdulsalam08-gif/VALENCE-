// Community library: discovery, follows/blocks, study groups, forums, mentorship, events.

import { supabase } from './supabase.js';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function unwrap(result) {
  if (result.error) throw new Error(result.error.message || 'Something went wrong');
  return result.data;
}

/* ------------------------------------------------------------------ */
/* Discovery                                                           */
/* ------------------------------------------------------------------ */

export async function fetchDiscoveryProfiles() {
  const { data, error } = await supabase.rpc('fetch_discovery_profiles');
  if (error) throw new Error(error.message || 'Failed to load profiles');
  return data || [];
}

/* ------------------------------------------------------------------ */
/* Follows & blocks                                                    */
/* ------------------------------------------------------------------ */

export async function toggleFollow(profileId) {
  const { data, error } = await supabase.rpc('toggle_follow', { p_profile_id: profileId });
  if (error) throw new Error(error.message || 'Failed to update follow');
  return data;
}

export async function toggleBlock(profileId) {
  const { data, error } = await supabase.rpc('toggle_block', { p_profile_id: profileId });
  if (error) throw new Error(error.message || 'Failed to update block');
  return data;
}

/* ------------------------------------------------------------------ */
/* Study groups                                                        */
/* ------------------------------------------------------------------ */

export async function fetchStudyGroups() {
  const { data, error } = await supabase.rpc('fetch_study_groups');
  if (error) throw new Error(error.message || 'Failed to load study groups');
  return data || [];
}

export async function joinStudyGroup(groupId) {
  const { data, error } = await supabase.rpc('join_study_group', { p_group_id: groupId });
  if (error) throw new Error(error.message || 'Failed to join group');
  return data;
}

export async function leaveStudyGroup(groupId) {
  const { data, error } = await supabase.rpc('leave_study_group', { p_group_id: groupId });
  if (error) throw new Error(error.message || 'Failed to leave group');
  return data;
}

/* ------------------------------------------------------------------ */
/* Forums                                                              */
/* ------------------------------------------------------------------ */

export async function fetchForumCategories() {
  const { data, error } = await supabase.rpc('fetch_forum_categories');
  if (error) throw new Error(error.message || 'Failed to load forum categories');
  return data || [];
}

export async function fetchForumThreads(categoryId) {
  const { data, error } = await supabase.rpc('fetch_forum_threads', { p_category_id: categoryId });
  if (error) throw new Error(error.message || 'Failed to load threads');
  return data || [];
}

export async function fetchThreadReplies(threadId) {
  const { data, error } = await supabase.rpc('fetch_thread_replies', { p_thread_id: threadId });
  if (error) throw new Error(error.message || 'Failed to load replies');
  return data || [];
}

export async function createForumThread(categoryId, title, content) {
  const { data, error } = await supabase.rpc('create_forum_thread', {
    p_category_id: categoryId,
    p_title: title,
    p_content: content,
  });
  if (error) throw new Error(error.message || 'Failed to create thread');
  return data;
}

export async function createForumReply(threadId, content) {
  const { data, error } = await supabase.rpc('create_forum_reply', {
    p_thread_id: threadId,
    p_content: content,
  });
  if (error) throw new Error(error.message || 'Failed to post reply');
  return data;
}

export async function reportContent(targetType, targetId, reason, description) {
  const { data, error } = await supabase.rpc('report_content', {
    p_target_type: targetType,
    p_target_id: targetId,
    p_reason: reason,
    p_description: description,
  });
  if (error) throw new Error(error.message || 'Failed to submit report');
  return data;
}

/* ------------------------------------------------------------------ */
/* Mentorship                                                          */
/* ------------------------------------------------------------------ */

export async function fetchMentorshipProfiles() {
  const { data, error } = await supabase.rpc('fetch_mentorship_profiles');
  if (error) throw new Error(error.message || 'Failed to load mentors');
  return data || [];
}

export async function requestMentorship(mentorProfileId, message) {
  const { data, error } = await supabase.rpc('request_mentorship', {
    p_mentor_profile_id: mentorProfileId,
    p_message: message,
  });
  if (error) throw new Error(error.message || 'Failed to send request');
  return data;
}

/* ------------------------------------------------------------------ */
/* Events                                                              */
/* ------------------------------------------------------------------ */

export async function fetchPlatformEvents() {
  const { data, error } = await supabase.rpc('fetch_platform_events');
  if (error) throw new Error(error.message || 'Failed to load events');
  return data || [];
}

export async function registerForEvent(eventId) {
  const { data, error } = await supabase.rpc('register_for_event', { p_event_id: eventId });
  if (error) throw new Error(error.message || 'Failed to register');
  return data;
}

/**
 * VALENCE ADMIN RBAC + PLATFORM CMS — Phase 16 client helpers
 *
 * All admin operations go through Supabase Postgres RPC functions
 * (SECURITY DEFINER, error-JSON returns, gated via is_admin_user() server-side).
 * The client cannot forge roles, settings, FAQ content or audit records.
 *
 * Groups:
 *   RBAC:      has_admin_role
 *   CMS:       manage_platform_setting, fetch_all_platform_settings,
 *              manage_delivery_zone, manage_faq, fetch_faqs
 *   EXAM:      manage_exam_session, fetch_exam_authority_console, sync_exam_calendar
 *   PODIUM:    fetch_podium_ledger
 *   MODERATION: fetch_moderation_queue, fetch_announcement_moderation_queue,
 *              resolve_moderation_report, resolve_announcement_report
 *   AUDIT:     fetch_admin_audit_logs
 */

import { supabase } from './supabase';

/** Run an RPC and throw a friendly Error on failure or on an error-JSON body. */
async function rpc(name, params = {}) {
  const { data, error } = await supabase.rpc(name, params);
  if (error) {
    const detail =
      error.message ||
      (error.details ? JSON.stringify(error.details) : `Unable to run ${name}.`);
    throw new Error(detail);
  }
  if (data?.error) throw new Error(data.error);
  return data;
}

/* ---------------- RBAC ---------------- */

/** Check whether the current user holds a role (super_admin implicitly passes). */
export async function checkAdminRole(role) {
  return rpc('has_admin_role', { p_role: role ?? null });
}

/* ---------------- CMS: platform settings ---------------- */

/** Upsert a single platform setting (setting_value is JSON — pass number/string/bool). */
export async function savePlatformSetting(settingKey, settingValue) {
  return rpc('manage_platform_setting', {
    p_setting_key: settingKey,
    p_setting_value: settingValue ?? null,
  });
}

/** Fetch all platform settings as an array: [{id, setting_key, setting_value, description, updated_at}]. */
export async function fetchAllPlatformSettings() {
  const data = await rpc('fetch_all_platform_settings');
  return Array.isArray(data) ? data : [];
}

/* ---------------- CMS: delivery zones ---------------- */

/** Create (no zone_id) or update (with zone_id) a delivery zone. */
export async function saveDeliveryZone({ zoneId = null, name, states = [], feeNgn = 0, isFree = false }) {
  return rpc('manage_delivery_zone', {
    p_zone_id: zoneId,
    p_name: name,
    p_states: states ?? [],
    p_fee_ngn: feeNgn ?? 0,
    p_is_free: isFree ?? false,
  });
}

/* ---------------- CMS: FAQs ---------------- */

/** Create (no faq_id) or update (with faq_id) a FAQ. */
export async function saveFaq({ faqId = null, question, answer, category = 'general', sortOrder = 0, isActive = true }) {
  return rpc('manage_faq', {
    p_faq_id: faqId,
    p_question: question,
    p_answer: answer,
    p_category: category,
    p_sort_order: sortOrder,
    p_is_active: isActive,
  });
}

/** Fetch active FAQs (optionally filtered by category). Returns a flat array. */
export async function fetchFaqs(category = null) {
  const data = await rpc('fetch_faqs', { p_category: category ?? null });
  return Array.isArray(data) ? data : [];
}

/* ---------------- Exam Authority ---------------- */

/** Update an exam session (all fields optional; only provided fields are written). */
export async function saveExamSession(sessionId, fields) {
  return rpc('manage_exam_session', { p_session_id: sessionId, ...fields });
}

/** Fetch the Central Exam Authority console: { sessions: [...] }. */
export async function fetchExamAuthorityConsole() {
  const data = await rpc('fetch_exam_authority_console');
  return data?.sessions ?? [];
}

/** Mark an exam session's calendar event as synced (Google Workspace automation hook). */
export async function syncExamCalendar(sessionId, calendarEventId = null) {
  return rpc('sync_exam_calendar', {
    p_session_id: sessionId,
    p_calendar_event_id: calendarEventId,
  });
}

/* ---------------- Podium ledger ---------------- */

/** Fetch the podium payout ledger: { competition_name, ledger: [...] }. */
export async function fetchPodiumLedger(competitionId = null) {
  const data = await rpc('fetch_podium_ledger', { p_competition_id: competitionId ?? null });
  return { competitionName: data?.competition_name ?? 'All competitions', ledger: data?.ledger ?? [] };
}

/* ---------------- Moderation ---------------- */

/** Fetch pending content reports: { content_reports: [...] }. */
export async function fetchModerationQueue() {
  const data = await rpc('fetch_moderation_queue');
  return data?.content_reports ?? [];
}

/** Fetch pending announcement reports: { announcement_reports: [...] }. */
export async function fetchAnnouncementModerationQueue() {
  const data = await rpc('fetch_announcement_moderation_queue');
  return data?.announcement_reports ?? [];
}

/** Resolve a content report: action 'uphold' or 'dismiss'. */
export async function resolveModerationReport(reportId, action, notes = '') {
  return rpc('resolve_moderation_report', {
    p_report_id: reportId,
    p_action: action,
    p_notes: notes,
  });
}

/** Resolve an announcement report: action 'uphold' (also removes the post) or 'dismiss'. */
export async function resolveAnnouncementReport(reportId, action, notes = '') {
  return rpc('resolve_announcement_report', {
    p_report_id: reportId,
    p_action: action,
    p_notes: notes,
  });
}

/* ---------------- Audit ---------------- */

/** Fetch admin audit logs: { logs: [...] }. */
export async function fetchAdminAuditLogs(limit = 100, offset = 0) {
  const data = await rpc('fetch_admin_audit_logs', { p_limit: limit, p_offset: offset });
  return data?.logs ?? [];
}

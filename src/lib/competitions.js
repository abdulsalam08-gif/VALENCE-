// Phase 13 competition system: VALENCE National Inter-School Challenge.
// Competition management, school/team registration, attempts, auto/manual
// marking, approval, awards/certificates/Hall of Fame, leaderboards, Arena
// 1v1/2v2, appeals and audited podium disbursement.

import { supabase } from './supabase.js';

function unwrap(result, fallbackMessage = 'Competition action failed') {
  if (result.error) throw new Error(result.error.message || fallbackMessage);
  return result.data;
}

/* ------------------------------------------------------------------ */
/* Read                                                                */
/* ------------------------------------------------------------------ */

export async function fetchCompetitions(limit = 50, offset = 0) {
  const { data, error } = await supabase.rpc('fetch_competitions', {
    p_limit: limit,
    p_offset: offset,
  });
  return unwrap({ data, error }, 'Failed to load competitions');
}

export async function fetchCompetitionDetails(competitionId) {
  const { data, error } = await supabase.rpc('fetch_competition_details', {
    p_competition_id: competitionId,
  });
  return unwrap({ data, error }, 'Failed to load competition details');
}

export async function fetchLeaderboard(competitionId, type = 'individual') {
  const { data, error } = await supabase.rpc('fetch_leaderboard', {
    p_competition_id: competitionId,
    p_type: type,
  });
  return unwrap({ data, error }, 'Failed to load leaderboard');
}

export async function fetchMyResults(competitionId = null) {
  const { data, error } = await supabase.rpc('fetch_my_results', {
    p_competition_id: competitionId,
  });
  return unwrap({ data, error }, 'Failed to load your results');
}

export async function fetchHallOfFame(limit = 50) {
  const { data, error } = await supabase.rpc('fetch_hall_of_fame', { p_limit: limit });
  return unwrap({ data, error }, 'Failed to load Hall of Fame');
}

export async function fetchSchoolTopStudents(institutionId) {
  const { data, error } = await supabase.rpc('fetch_school_top_students', {
    p_institution_id: institutionId,
  });
  return unwrap({ data, error }, 'Failed to load Top VALENCE Students');
}

export async function fetchArenaMatches(competitionId) {
  const { data, error } = await supabase.rpc('fetch_arena_matches', {
    p_competition_id: competitionId,
  });
  return unwrap({ data, error }, 'Failed to load Arena matches');
}

export async function fetchAuditLogs(competitionId = null) {
  const { data, error } = await supabase.rpc('fetch_audit_logs', {
    p_competition_id: competitionId,
  });
  return unwrap({ data, error }, 'Failed to load audit logs');
}

export async function fetchQuestionBank(bankId) {
  const { data, error } = await supabase.rpc('fetch_question_bank', { p_bank_id: bankId });
  return unwrap({ data, error }, 'Failed to load question bank');
}

/* ------------------------------------------------------------------ */
/* Admin: competitions, schools, teams, registrations                 */
/* ------------------------------------------------------------------ */

export async function manageCompetition(payload) {
  const { data, error } = await supabase.rpc('manage_competition', payload);
  return unwrap({ data, error }, 'Failed to save competition');
}

export async function registerSchoolCompetition(competitionId, institutionId) {
  const { data, error } = await supabase.rpc('register_school_competition', {
    p_competition_id: competitionId,
    p_institution_id: institutionId,
  });
  return unwrap({ data, error }, 'Failed to register school');
}

export async function createCompetitionTeam(payload) {
  const { data, error } = await supabase.rpc('create_competition_team', payload);
  return unwrap({ data, error }, 'Failed to create team');
}

export async function registerCompetitant(competitionId, teamId, profileId) {
  const { data, error } = await supabase.rpc('register_competitant', {
    p_competition_id: competitionId,
    p_team_id: teamId,
    p_profile_id: profileId,
  });
  return unwrap({ data, error }, 'Failed to register competitor');
}

export async function withdrawRegistration(registrationId) {
  const { data, error } = await supabase.rpc('withdraw_registration', {
    p_registration_id: registrationId,
  });
  return unwrap({ data, error }, 'Failed to withdraw registration');
}

export async function addCompetitionRound(payload) {
  const { data, error } = await supabase.rpc('add_competition_round', payload);
  return unwrap({ data, error }, 'Failed to add round');
}

export async function createQuestionBank(competitionId, subjectId, name, description) {
  const { data, error } = await supabase.rpc('create_question_bank', {
    p_competition_id: competitionId,
    p_subject_id: subjectId,
    p_name: name,
    p_description: description || null,
  });
  return unwrap({ data, error }, 'Failed to create question bank');
}

export async function addQuestion(bankId, questionText, marks, difficulty, syllabusReference, options) {
  const { data, error } = await supabase.rpc('add_question', {
    p_bank_id: bankId,
    p_question_text: questionText,
    p_marks: marks,
    p_difficulty: difficulty,
    p_syllabus_reference: syllabusReference || null,
    p_options: options || [],
  });
  return unwrap({ data, error }, 'Failed to add question');
}

/* ------------------------------------------------------------------ */
/* Attempts                                                            */
/* ------------------------------------------------------------------ */

export async function startAttempt(competitionId, profileId) {
  const { data, error } = await supabase.rpc('start_attempt', {
    p_competition_id: competitionId,
    p_profile_id: profileId,
  });
  return unwrap({ data, error }, 'Failed to start attempt');
}

export async function getAttemptQuestions(attemptId) {
  const { data, error } = await supabase.rpc('get_attempt_questions', {
    p_attempt_id: attemptId,
  });
  return unwrap({ data, error }, 'Failed to load questions');
}

export async function submitAttempt(attemptId, answers) {
  const { data, error } = await supabase.rpc('submit_attempt', {
    p_attempt_id: attemptId,
    p_answers: answers || [],
  });
  return unwrap({ data, error }, 'Failed to submit attempt');
}

/* ------------------------------------------------------------------ */
/* Marking, approval, appeals, rewards                                 */
/* ------------------------------------------------------------------ */

export async function assignMarker(competitionId, markerProfileId) {
  const { data, error } = await supabase.rpc('assign_marker', {
    p_competition_id: competitionId,
    p_marker_profile_id: markerProfileId,
  });
  return unwrap({ data, error }, 'Failed to assign marker');
}

export async function fetchMarkingQueue(competitionId) {
  const { data, error } = await supabase.rpc('fetch_marking_queue', {
    p_competition_id: competitionId,
  });
  return unwrap({ data, error }, 'Failed to load marking queue');
}

export async function manualMarkAttempt(attemptId, markerProfileId, totalMarks, moderatorReviewed = false) {
  const { data, error } = await supabase.rpc('manual_mark_attempt', {
    p_attempt_id: attemptId,
    p_marker_profile_id: markerProfileId,
    p_total_marks: totalMarks,
    p_moderator_reviewed: moderatorReviewed,
  });
  return unwrap({ data, error }, 'Failed to mark attempt');
}

export async function approveResult(resultId) {
  const { data, error } = await supabase.rpc('approve_result', { p_result_id: resultId });
  return unwrap({ data, error }, 'Failed to approve result');
}

export async function submitAppeal(resultId, appealReason) {
  const { data, error } = await supabase.rpc('submit_appeal', {
    p_result_id: resultId,
    p_appeal_reason: appealReason,
  });
  return unwrap({ data, error }, 'Failed to submit appeal');
}

export async function reviewAppeal(appealId, decision, decisionNotes = null) {
  const { data, error } = await supabase.rpc('review_appeal', {
    p_appeal_id: appealId,
    p_decision: decision,
    p_decision_notes: decisionNotes,
  });
  return unwrap({ data, error }, 'Failed to review appeal');
}

export async function disburseReward(rewardId) {
  const { data, error } = await supabase.rpc('disburse_reward', { p_reward_id: rewardId });
  return unwrap({ data, error }, 'Failed to disburse reward');
}

export async function recomputeLeaderboard(competitionId) {
  const { data, error } = await supabase.rpc('recompute_leaderboard', {
    p_competition_id: competitionId,
  });
  return unwrap({ data, error }, 'Failed to recompute leaderboard');
}

/* ------------------------------------------------------------------ */
/* Arena                                                               */
/* ------------------------------------------------------------------ */

export async function createArenaMatch(competitionId, teamAId, teamBId, matchFormat = '1v1', scheduledAt = null) {
  const { data, error } = await supabase.rpc('create_arena_match', {
    p_competition_id: competitionId,
    p_team_a_id: teamAId,
    p_team_b_id: teamBId,
    p_match_format: matchFormat,
    p_scheduled_at: scheduledAt,
  });
  return unwrap({ data, error }, 'Failed to schedule Arena match');
}

export async function completeArenaMatch(matchId, winnerTeamId) {
  const { data, error } = await supabase.rpc('complete_arena_match', {
    p_match_id: matchId,
    p_winner_team_id: winnerTeamId,
  });
  return unwrap({ data, error }, 'Failed to complete match');
}

export async function logAuditAction(competitionId, action, details = null) {
  const { data, error } = await supabase.rpc('log_audit_action', {
    p_competition_id: competitionId,
    p_action: action,
    p_details: details,
  });
  return unwrap({ data, error }, 'Failed to write audit log');
}

-- Phase 10 — Official vs Community Announcements system
-- 7 backend-enforced audience visibility scopes, likes, comments, reposts/shares,
-- bookmarks, reporting & admin moderation.
--
-- Tables already exist from Phase 2:
--   announcement_posts, announcement_likes, announcement_comments,
--   announcement_bookmarks, announcement_shares, announcement_attachments,
--   announcement_reports  +  announcement_scope enum (7 values).
-- The Phase 2 `can_view_announcement()` helper was stale (referenced a non-existent
-- `announcements` table and wrong columns). This migration realigns it to
-- `announcement_posts`, enforces visibility in RLS, and adds the RPC layer.

-- 1) Realign can_view_announcement() to announcement_posts + Phase 9 user_follows.
CREATE OR REPLACE FUNCTION public.can_view_announcement(p_ann_id uuid, p_uid uuid DEFAULT NULL)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $func$
    SELECT EXISTS (
        SELECT 1
        FROM public.announcement_posts a
        LEFT JOIN public.profiles viewer ON viewer.id = COALESCE(p_uid, auth.uid())
        WHERE a.id = p_ann_id
          AND (
            public.is_admin(COALESCE(p_uid, auth.uid()))
            OR a.profile_id = COALESCE(p_uid, auth.uid())
            OR (
              a.status = 'published'
              AND (
                a.audience = 'public'
                OR (
                  COALESCE(p_uid, auth.uid()) IS NOT NULL
                  AND (
                    (a.audience = 'connections' AND EXISTS (
                        SELECT 1 FROM public.user_follows f
                        WHERE f.follower_profile_id = COALESCE(p_uid, auth.uid())
                          AND f.followed_profile_id = a.profile_id
                    ))
                    OR (a.audience = 'study_group' AND a.study_group_id IS NOT NULL
                        AND public.is_study_group_member(a.study_group_id, COALESCE(p_uid, auth.uid())))
                    OR (a.audience = 'institution' AND a.institution_id IS NOT NULL
                        AND viewer.institution_id IS NOT NULL
                        AND viewer.institution_id = a.institution_id)
                    OR (a.audience = 'programme' AND a.programme IS NOT NULL
                        AND viewer.programme IS NOT NULL
                        AND viewer.programme = a.programme)
                    OR (a.audience = 'course')
                    OR (a.audience = 'professional' AND viewer.account_type IN ('professional','tutor','admin'))
                  )
                )
              )
            )
          )
    );
$func$;

-- 2) RLS: replace permissive SELECT policies on announcement_posts with enforced visibility.
DROP POLICY IF EXISTS ann_posts_select_public ON public.announcement_posts;
DROP POLICY IF EXISTS ann_posts_select_own ON public.announcement_posts;
CREATE POLICY ann_posts_select_visible ON public.announcement_posts
    FOR SELECT TO public
    USING (public.can_view_announcement(announcement_posts.id));

-- 3) RLS SELECT on the interaction tables, gated by parent-announcement visibility.
CREATE POLICY ann_likes_select_visible ON public.announcement_likes
    FOR SELECT TO public
    USING (public.can_view_announcement(announcement_likes.announcement_id));

CREATE POLICY ann_comments_select_visible ON public.announcement_comments
    FOR SELECT TO public
    USING (public.can_view_announcement(announcement_comments.announcement_id));

CREATE POLICY ann_bookmarks_select_visible ON public.announcement_bookmarks
    FOR SELECT TO public
    USING (public.can_view_announcement(announcement_bookmarks.announcement_id));

CREATE POLICY ann_shares_select_visible ON public.announcement_shares
    FOR SELECT TO public
    USING (public.can_view_announcement(announcement_shares.announcement_id));

CREATE POLICY ann_attachments_select_visible ON public.announcement_attachments
    FOR SELECT TO public
    USING (public.can_view_announcement(announcement_attachments.announcement_id));

-- Reports: admin or the reporting profile only.
CREATE POLICY ann_reports_select_auth ON public.announcement_reports
    FOR SELECT TO public
    USING (
        public.is_admin_user()
        OR announcement_reports.reporter_profile_id IN (
            SELECT id FROM public.profiles WHERE user_id = auth.uid()
        )
    );

-- 4) RPCs (deployed separately, one CREATE FUNCTION per call).
--    create_announcement, update_announcement, delete_announcement,
--    toggle_announcement_like, toggle_announcement_bookmark,
--    add_announcement_comment, delete_announcement_comment,
--    share_announcement, report_announcement,
--    fetch_announcements, fetch_announcement_detail, fetch_announcement_comments,
--    moderate_announcement, review_announcement_report.

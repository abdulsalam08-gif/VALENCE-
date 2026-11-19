/**
 * VALENCE ADVERTISE — Phase 15 client helpers (Verified Partner Directory + Ads)
 *
 * All writes go through Supabase Postgres RPC functions (SECURITY DEFINER,
 * error-JSON returns) which are the only path allowed to insert advertisers,
 * campaigns, payments, impressions, clicks and enquiries under RLS. The client
 * cannot forge prices, totals or verification status.
 *
 * Flow:
 *   manage_advertiser            -> create/update the advertiser profile (category-gated)
 *   submit_advertiser_verification -> submit proof (venue / ISBN / anti-piracy) for Admin review
 *   fetch_my_advertiser          -> own profile + verification + campaign summary
 *   manage_advertising_campaign  -> create a campaign (server recomputes total)
 *   create_advertising_payment   -> server issues a Paystack reference for the campaign
 *   openPaystackCheckout         -> inline Paystack checkout (paystack.js)
 *   verify_advertising_payment   -> server-verified Paystack confirmation -> campaign active
 *   record_ad_impression / _click -> live CTR telemetry (server-upserted daily)
 *   submit_advertising_enquiry   -> in-app student enquiry to a campaign
 */

import { supabase } from './supabase';
import {
  openPaystackCheckout,
  generatePaymentReference,
  isPaystackConfigured,
} from './paystack';

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

/** List the public advertising packages (default ₦10,000/week). */
export async function fetchAdPackages() {
  const data = await rpc('fetch_advertising_packages');
  return Array.isArray(data) ? data : [];
}

/** The 9 approved Sponsored placements. */
export async function fetchAdPlacements() {
  const data = await rpc('fetch_advertising_placements');
  return Array.isArray(data) ? data : [];
}

/** The Verified Partner Directory (verified advertisers, optional category filter). */
export async function fetchAdvertiserDirectory({ category = null, limit = 50, offset = 0 } = {}) {
  const data = await rpc('fetch_advertiser_directory', {
    p_category: category || null,
    p_limit: limit,
    p_offset: offset,
  });
  return Array.isArray(data) ? data : [];
}

/** The caller's own advertiser + verification status + campaign summary. */
export async function fetchMyAdvertiser() {
  try {
    return await rpc('fetch_my_advertiser');
  } catch (err) {
    if (/Profile not found|Set up your advertiser/i.test(err.message)) {
      return { advertiser: null, verification: null, campaign_count: 0, enquiry_count: 0 };
    }
    throw err;
  }
}

/**
 * Create or update the caller's advertiser profile.
 * @param {object} advertiser Advertiser fields (centre_name, category, address, ...)
 */
export async function saveAdvertiser(advertiser) {
  return rpc('manage_advertiser', {
    p_advertiser_id: advertiser.id || null,
    p_centre_name: advertiser.centre_name,
    p_category: advertiser.category,
    p_address: advertiser.address || '',
    p_contact_details: advertiser.contact_details || '',
    p_website: advertiser.website || '',
    p_social_links: advertiser.social_links || null,
    p_business_description: advertiser.business_description || '',
    p_areas_of_specialisation: advertiser.areas_of_specialisation || null,
    p_programmes_offered: advertiser.programmes_offered || null,
    p_credentials: advertiser.credentials || '',
    p_isbn_or_publisher: advertiser.isbn_or_publisher || '',
    p_logo_url: advertiser.logo_url || null,
  });
}

/** Submit a verification request (venue proof / ISBN / anti-piracy evidence). */
export async function submitAdvertiserVerification({ verificationType, details = '', documentUrl = null }) {
  return rpc('submit_advertiser_verification', {
    p_verification_type: verificationType,
    p_details: details,
    p_document_url: documentUrl,
  });
}

/** Admin: the advertiser verification queue (default 'pending'). */
export async function fetchAdvertiserVerificationQueue(status = 'pending') {
  const data = await rpc('fetch_advertiser_verification_queue', { p_status: status });
  return Array.isArray(data) ? data : [];
}

/** Admin: approve or reject an advertiser verification request. */
export async function reviewAdvertiserVerification({ verificationId, approved, notes = null }) {
  return rpc('review_advertiser_verification', {
    p_verification_id: verificationId,
    p_approved: approved,
    p_notes: notes,
  });
}

/**
 * Create (or update) an advertising campaign. The server recomputes the total
 * as weeks × placement_count × package.price_ngn and requires a verified advertiser.
 */
export async function saveAdCampaign({
  advertiserId,
  packageId,
  campaignName,
  bannerUrl = null,
  copyText = '',
  contactLink = null,
  targetAudiences = null,
  placements = null,
  weeks = 1,
}) {
  return rpc('manage_advertising_campaign', {
    p_advertiser_id: advertiserId,
    p_package_id: packageId,
    p_campaign_name: campaignName,
    p_banner_url: bannerUrl,
    p_copy_text: copyText,
    p_contact_link: contactLink,
    p_target_audiences: targetAudiences,
    p_placements: placements,
    p_weeks: weeks,
  });
}

/** The caller's own campaigns (with impressions/clicks/CTR). */
export async function fetchMyAdCampaigns() {
  const data = await rpc('fetch_my_advertising_campaigns');
  return Array.isArray(data) ? data : [];
}

/** Admin/public: campaigns by status (e.g. 'active'). */
export async function fetchAdCampaigns(status = null) {
  const data = await rpc('fetch_advertising_campaigns', { p_status: status || null });
  return Array.isArray(data) ? data : [];
}

/** Ask the server to issue a Paystack payment reference for a pending campaign. */
export async function createAdPayment(campaignId) {
  return rpc('create_advertising_payment', { p_campaign_id: campaignId });
}

/**
 * Server-verified Paystack confirmation. The server schedules a pg_net verification
 * job and returns {status:'verifying'}; retry until finalized (mirrors storeOrders).
 */
export async function confirmAdPayment({ paymentId, reference, amountNgn }) {
  const maxAttempts = 10;
  const delayMs = 2500;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const data = await rpc('verify_advertising_payment', {
      p_payment_id: paymentId,
      p_reference: reference,
      p_amount: Number(amountNgn),
    });
    if (data?.status === 'verifying') {
      if (attempt < maxAttempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }
      throw new Error('Paystack verification is taking longer than expected. Please retry from your Advertiser Hub.');
    }
    return data;
  }
  throw new Error('Unable to verify the advertising payment.');
}

/** Record an ad impression (live telemetry; no-op-safe for inactive campaigns). */
export async function recordAdImpression(campaignId) {
  return rpc('record_ad_impression', { p_campaign_id: campaignId });
}

/** Record an ad click; returns the campaign contact link. */
export async function recordAdClick(campaignId) {
  return rpc('record_ad_click', { p_campaign_id: campaignId });
}

/** Live CTR + enquiry analytics for the caller's advertiser (or a specific advertiser id). */
export async function fetchAdAnalytics(advertiserId = null) {
  try {
    return await rpc('fetch_advertising_analytics', { p_advertiser_id: advertiserId || null });
  } catch (err) {
    return { campaigns: [], totals: { impressions: 0, clicks: 0, ctr: 0, enquiries: 0 } };
  }
}

/** A student sends an in-app enquiry / purchase request to an active campaign. */
export async function submitAdEnquiry({ campaignId, message = '', contactMode = 'enquiry' }) {
  return rpc('submit_advertising_enquiry', {
    p_campaign_id: campaignId,
    p_message: message,
    p_contact_mode: contactMode,
  });
}

/** Advertiser: the inbound enquiry inbox for all their campaigns. */
export async function fetchMyAdEnquiries() {
  try {
    const data = await rpc('fetch_my_advertising_enquiries');
    return Array.isArray(data) ? data : [];
  } catch (err) {
    return [];
  }
}

/** Promotional banners (admin-managed, public read). */
export async function fetchPromotionalBanners() {
  try {
    const data = await rpc('fetch_promotional_banners');
    return Array.isArray(data) ? data : [];
  } catch (err) {
    return [];
  }
}

/**
 * Full in-app campaign booking flow:
 *   1. create the campaign (server computes total)
 *   2. ask the server for a Paystack reference
 *   3. open the Paystack embed checkout
 *   4. on success, confirm server-side (retrying async verification)
 *
 * Returns { campaign, payment, server_verified }.
 */
export async function bookAdCampaign({ campaign, email, name, onCheckoutClose }) {
  const created = await saveAdCampaign(campaign);
  const payment = await createAdPayment(created.campaign_id);

  if (!isPaystackConfigured()) {
    // No public key configured — mark as locally booked (server_verified false).
    // The campaign still exists and can be paid later from the Advertiser Hub.
    return {
      campaign: created,
      payment,
      server_verified: false,
      fallback: true,
    };
  }

  const reference = payment.reference || generatePaymentReference();

  return new Promise((resolve, reject) => {
    openPaystackCheckout({
      email,
      name,
      amountNgn: payment.amount_ngn,
      reference,
      onSuccess: async (response) => {
        try {
          const verified = await confirmAdPayment({
            paymentId: payment.payment_id,
            reference,
            amountNgn: payment.amount_ngn,
          });
          resolve({ campaign: created, payment, server_verified: true, response, verified });
        } catch (err) {
          reject(err);
        }
      },
      onClose: () => {
        if (typeof onCheckoutClose === 'function') onCheckoutClose(payment);
      },
    });
  });
}

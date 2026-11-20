import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePlatform } from '../context/PlatformContext';
import PortalGatewayPage from './PortalGatewayPage';
import AdminPortalPage from './AdminPortalPage';
import { ADMIN_ROLES } from '../lib/auth';

export default function AdminPortalRoute() {
  const { user, adminRoles, isHydrating } = usePlatform();

  if (isHydrating) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="v-card p-6 text-center text-[#9AA4B2] text-sm">
          Loading your session...
        </div>
      </div>
    );
  }

  // Not signed in → show the admin sign-in gateway
  if (!user) return <PortalGatewayPage defaultPortal="admin" />;

  // Signed in but not an admin → back to the public site.
  // Accept either a user_roles assignment OR an account_type of 'admin'
  // (account_type is available immediately from user metadata, avoiding the
  // race where RBAC roles are still loading when this guard first runs).
  const accountIsAdmin = user?.user_metadata?.account_type === 'admin';
  const isAdmin = accountIsAdmin || adminRoles.some((r) => ADMIN_ROLES.some((ar) => ar.value === r));
  if (!isAdmin) return <Navigate to="/" replace />;

  return <AdminPortalPage />;
}

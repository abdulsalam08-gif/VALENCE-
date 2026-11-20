import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePlatform } from '../../context/PlatformContext';

export function RequireAuth({ children }) {
  const { user, isHydrating } = usePlatform();
  const location = useLocation();

  if (isHydrating) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="v-card p-6 text-center text-[#9AA4B2] text-sm">
          Loading your session...
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to the sign-in gateway. Redirecting to /portal/student here
    // would loop back into this same guard when the session hasn't hydrated,
    // producing a blank page — /signin is the safe sign-in entry point.
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export function RequireRole({ roles, children, fallback = null }) {
  const { user, adminRoles, isHydrating } = usePlatform();

  if (isHydrating) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="v-card p-6 text-center text-[#9AA4B2] text-sm">
          Verifying your access...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  const hasRole = roles.some((r) => adminRoles.includes(r) || user.user_metadata?.account_type === r);
  if (!hasRole) {
    return fallback || <Navigate to="/" replace />;
  }

  return children;
}

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, useCart, usePublicData, useUi } from '../context/PlatformContext';
import PortalGatewayPage from './PortalGatewayPage';
import AdvertiserHubPage from './AdvertiserHubPage';

export default function AdvertiserHubRoute() {
  const { user } = useAuth();
  const { isHydrating } = usePublicData();
  if (isHydrating) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="v-card p-6 text-center text-[#9AA4B2] text-sm">
          Loading your session...
        </div>
      </div>
    );
  }

  // Not signed in → show the advertiser sign-in / signup gateway
  if (!user) return <PortalGatewayPage defaultPortal="advertiser" />;

  return <AdvertiserHubPage />;
}

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { PlatformProvider } from './context/PlatformContext';
import PublicLayout from './components/layout/PublicLayout';
import { RouteSkeleton } from './components/ui/Skeleton';
import HomePage from './pages/HomePage';

const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProgrammesPage = lazy(() => import('./pages/ProgrammesPage'));
const AtswaPage = lazy(() => import('./pages/AtswaPage'));
const IcanPage = lazy(() => import('./pages/IcanPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const StudyMaterialsPage = lazy(() => import('./pages/StudyMaterialsPage'));
const StorePage = lazy(() => import('./pages/StorePage'));
const ConnectPage = lazy(() => import('./pages/ConnectPage'));
const CompetitionsPage = lazy(() => import('./pages/CompetitionsPage'));
const OpportunitiesPage = lazy(() => import('./pages/OpportunitiesPage'));
const TuitionCentresPage = lazy(() => import('./pages/TuitionCentresPage'));
const AdvertisePage = lazy(() => import('./pages/AdvertisePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PortalGatewayPage = lazy(() => import('./pages/PortalGatewayPage'));

export default function App() {
  return (
    <ToastProvider>
      <PlatformProvider>
        <BrowserRouter>
          <Suspense fallback={<RouteSkeleton />}>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/programmes" element={<ProgrammesPage />} />
                <Route path="/programmes/tertiary" element={<ProgrammesPage focusTertiary />} />
                <Route path="/programmes/atswa" element={<AtswaPage />} />
                <Route path="/programmes/ican" element={<IcanPage />} />
                <Route path="/programmes/ican/:levelSlug" element={<IcanPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/study-materials" element={<StudyMaterialsPage />} />
                <Route path="/store" element={<StorePage />} />
                <Route path="/connect" element={<ConnectPage />} />
                <Route path="/competitions" element={<CompetitionsPage />} />
                <Route path="/opportunities" element={<OpportunitiesPage />} />
                <Route path="/tuition-centres" element={<TuitionCentresPage />} />
                <Route path="/advertise" element={<AdvertisePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/portal/:portalType" element={<PortalGatewayPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </PlatformProvider>
    </ToastProvider>
  );
}

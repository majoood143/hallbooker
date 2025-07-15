import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import VenueDiscoverySearchPage from "pages/venue-discovery-search";
import AdminManagementPanelPage from "pages/admin-management-panel";
import UserDashboardPage from "pages/user-dashboard";
import VenueOwnerDashboardPage from "pages/venue-owner-dashboard";
import BookingManagementPaymentPage from "pages/booking-management-payment";
import VenueDetailsBookingPage from "pages/venue-details-booking";
import AllUsersManagementPage from "pages/all-users-management";
import VenueOwnersManagementPage from "pages/venue-owners-management";
import CustomersManagementPage from "pages/customers-management";
import PendingApprovalsManagementPage from "pages/pending-approvals-management";
import AllVenuesManagementPage from "pages/all-venues-management";
import PendingReviewsManagementPage from "pages/pending-reviews-management";
import VenueStatusManagementPage from "pages/venue-status-management";
import PaymentGatewaySettingsPage from "pages/payment-gateway-settings";
import PlatformSettingsConfigurationPage from "pages/platform-settings-configuration";
import SystemConfigurationManagementPage from "pages/system-configuration-management";
import NotFound from "pages/NotFound";
import Login from "components/auth/Login";
import Signup from "components/auth/Signup";
import ForgotPassword from "components/auth/ForgotPassword";
import AdminTestPanel from "components/admin/AdminTestPanel";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<VenueDiscoverySearchPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/venue-discovery-search" element={<VenueDiscoverySearchPage />} />
        <Route path="/admin-management-panel" element={<AdminManagementPanelPage />} />
        <Route path="/user-dashboard" element={<UserDashboardPage />} />
        <Route path="/venue-owner-dashboard" element={<VenueOwnerDashboardPage />} />
        <Route path="/booking-management-payment" element={<BookingManagementPaymentPage />} />
        <Route path="/venue-details-booking" element={<VenueDetailsBookingPage />} />
        <Route path="/all-users-management" element={<AllUsersManagementPage />} />
        <Route path="/venue-owners-management" element={<VenueOwnersManagementPage />} />
        <Route path="/customers-management" element={<CustomersManagementPage />} />
        <Route path="/pending-approvals-management" element={<PendingApprovalsManagementPage />} />
        <Route path="/all-venues-management" element={<AllVenuesManagementPage />} />
        <Route path="/pending-reviews-management" element={<PendingReviewsManagementPage />} />
        <Route path="/venue-status-management" element={<VenueStatusManagementPage />} />
        <Route path="/payment-gateway-settings" element={<PaymentGatewaySettingsPage />} />
        <Route path="/platform-settings-configuration" element={<PlatformSettingsConfigurationPage />} />
        <Route path="/system-configuration-management" element={<SystemConfigurationManagementPage />} />
        <Route path="/admin-test-panel" element={<AdminTestPanel />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
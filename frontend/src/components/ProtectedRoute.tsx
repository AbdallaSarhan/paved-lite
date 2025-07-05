import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import authService from "../services/authService";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();
  const location = useLocation();

  console.log("ProtectedRoute Debug:", {
    isAuthenticated,
    user,
    location: location.pathname,
    hasRole: user?.role,
    hasName: user?.name,
    hasDescription: user?.description,
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated but has no role, redirect to /choose-role (unless already there)
  if (
    user &&
    (!user.role || user.role === "") &&
    location.pathname !== "/choose-role"
  ) {
    console.log("Redirecting to choose-role: no role");
    return <Navigate to="/choose-role" replace />;
  }

  // If user has a role but hasn't completed profile setup, redirect to /profile-setup
  // Only check this if they're not already on the profile-setup page
  if (
    user &&
    user.role &&
    location.pathname !== "/profile-setup" &&
    location.pathname !== "/choose-role"
  ) {
    // Check if profile is incomplete based on role
    const isProfileIncomplete =
      user.role === "publisher"
        ? !user.name ||
          !user.description ||
          !user.newsletter_name ||
          !user.subscriber_count ||
          !user.category ||
          !user.publishing_frequency
        : !user.name ||
          !user.description ||
          !user.company_name ||
          !user.industry ||
          !user.target_audience ||
          !user.budget;

    console.log("Profile completion check:", {
      role: user.role,
      isProfileIncomplete,
      publisherFields: {
        name: user.name,
        description: user.description,
        newsletter_name: user.newsletter_name,
        subscriber_count: user.subscriber_count,
        category: user.category,
        publishing_frequency: user.publishing_frequency,
      },
      advertiserFields: {
        name: user.name,
        description: user.description,
        company_name: user.company_name,
        industry: user.industry,
        target_audience: user.target_audience,
        budget: user.budget,
      },
    });

    if (isProfileIncomplete) {
      console.log("Redirecting to profile-setup: profile incomplete");
      return <Navigate to="/profile-setup" replace />;
    }
  }

  console.log("Allowing access to:", location.pathname);
  return <>{children}</>;
};

export default ProtectedRoute;

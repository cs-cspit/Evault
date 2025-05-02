import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import secureStorage from "@/utils/secureStorage";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  // Get authentication data from secureStorage
  const isAuthenticated = secureStorage.getItem('token') !== null;
  const userUID = secureStorage.getItem('userUID');
  const userType = secureStorage.getItem('userType'); // 'client', 'lawyer', 'judge'
  const walletAddress = secureStorage.getItem('walletAddress');

  // Define route types
  const isAdminRoute = location.pathname.startsWith('/admin') && !location.pathname.includes('register-new-case');
  const isJudgeRoute = location.pathname.startsWith('/judge');
  const isLawyerRoute = location.pathname.startsWith('/lawyer');
  const isCaseDetailsRoute = location.pathname.startsWith('/case-details');
  const isGetCaseDetailsRoute = location.pathname.startsWith('/get-case-details');
  const isRegisterNewCaseRoute = location.pathname.includes('register-new-case');

  // Check if the admin route is for the current user
  const isOwnAdminRoute = location.pathname.includes(`/admin/${userType}/${userUID}`);

  // If not authenticated at all, redirect to login
  if (!isAuthenticated || !userUID || !userType) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If wallet address is required but not present
  if (isAuthenticated && !walletAddress) {
    return <Navigate to="/connect-wallet" state={{ from: location }} replace />;
  }

  // Role-based access control
  switch (userType) {
    case 'judge':
      // Judges have access to all routes
      return children;

    case 'lawyer':
      // Lawyers can't access admin/judge routes except register-new-case and their own admin route
      if ((isAdminRoute && !isOwnAdminRoute) || isJudgeRoute) {
        return <Navigate to="/" replace />;
      }
      // Lawyers can access case details, register new case, their own routes, and general protected routes
      if (isLawyerRoute || isCaseDetailsRoute || isGetCaseDetailsRoute || isRegisterNewCaseRoute || isOwnAdminRoute) {
        return children;
      }
      return children;

    case 'client':
      // Clients can access their own admin route and case details
      if (isOwnAdminRoute || isCaseDetailsRoute || isGetCaseDetailsRoute) {
        return children;
      }
      // Clients can't access other admin routes, judge routes, lawyer routes, or register new case
      if ((isAdminRoute && !isOwnAdminRoute) || isJudgeRoute || isLawyerRoute || isRegisterNewCaseRoute) {
        return <Navigate to="/" replace />;
      }
      return children;

    default:
      // Unknown user type, redirect to login
      return <Navigate to="/login" state={{ from: location }} replace />;
  }
};

export default ProtectedRoute;
import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../constants/routes.js';
import { useAuth } from '../hooks/useAuth.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

function ProtectedRoute({
  children,
  redirectTo = ROUTES.LOGIN,
  allowedRoles,
  fallback = <LoadingSpinner fullScreen label="Checking access" />,
}) {
  const { currentUser, userProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return fallback;
  }

  if (!currentUser) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(userProfile?.role)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
}

export default ProtectedRoute;

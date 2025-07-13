import { Navigate } from "react-router-dom";
// protected route for authorized user
const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};

export default ProtectedRoute;

import { Navigate, Outlet } from "react-router-dom";
import AuthService from "../../api/AuthService";

function ProtectedRoute({ allowedRoles }) {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}
export default ProtectedRoute;
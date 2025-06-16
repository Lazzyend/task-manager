import { Navigate, Outlet } from "react-router-dom";

import { currentUser } from "../../store/authSlice/authSelector";
import { Path } from "../../types/path";
import { useSelector } from "react-redux";

type RouteControllerByPermissionProps = {
  fallbackPath?: string;
};

const SecureRoute = ({
  fallbackPath = Path.LOGIN,
}: RouteControllerByPermissionProps) => {
  const userSession = useSelector(currentUser);

  if (!userSession) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <Outlet />;
};

export default SecureRoute;

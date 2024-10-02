import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetInitialToken } from "../../helpers/getToken";

interface ProtectedRouteProps {
  element: React.ComponentType;
}

const AdminProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element: Component,
}) => {
  const navigate = useNavigate();
  const token = GetInitialToken("adminToken");

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  return <Component />;
};

export default AdminProtectedRoute;

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetInitialToken } from "../../helpers/getToken";

interface ProtectedRouteProps {
  element: React.ComponentType;
}

const CompanyProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element: Component,
}) => {
  const navigate = useNavigate();
  const token = GetInitialToken("companyToken");

  useEffect(() => {
    if (!token) {
      navigate("/company/login");
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  return <Component />;
};

export default CompanyProtectedRoute;

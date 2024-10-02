import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetInitialToken } from "../../helpers/getToken";

interface ProtectedRouteProps {
  element: React.ComponentType;
}

const UserVerifyRoute: React.FC<ProtectedRouteProps> = ({
  element: Component,
}) => {
  const navigate = useNavigate();
  const token = GetInitialToken("userToken");

  useEffect(() => {
    if (token) {
      navigate("/home");
    }
  }, [token, navigate]);

  if (token) {
    return null;
  }

  return <Component />;
};

export default UserVerifyRoute;

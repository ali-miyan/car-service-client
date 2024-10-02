import { Route, Routes } from "react-router-dom";
import Login from "../pages/adminPages/LoginPage";
import AdminVerifyRoute from "./protectedRoutes/AdminVerifyRoute";
import AdminProtectedRoute from "./protectedRoutes/AdminProtectedRoute";
import Dashboard from "../pages/adminPages/HomePage";
import ServicesList from "../pages/adminPages/ServicePage";
import Notification from "../pages/adminPages/NotificationPage";
import CompanyDetail from "../pages/adminPages/CompanyDetailsPage";
import AddService from "../pages/adminPages/AddService";
import UsersDetails from "../pages/adminPages/UsersDetailsPage";
import NotFound from "../components/common/404";

const AdminRoutes = () => (
  <>
    <Routes>

      <Route 
      path="login"
      element={<AdminVerifyRoute element={Login} />} 
      />
      <Route
        path="home"
        element={<AdminProtectedRoute element={Dashboard} />}
      />
      <Route
        path="services"
        element={<AdminProtectedRoute element={ServicesList} />}
      />
      <Route
        path="add-service"
        element={<AdminProtectedRoute element={AddService} />}
      />
      <Route
        path="notification"
        element={<AdminProtectedRoute element={Notification} />}
      />
      <Route
        path="detail-page/:id"
        element={<AdminProtectedRoute element={CompanyDetail} />}
      />
      <Route
        path="users"
        element={<AdminProtectedRoute element={UsersDetails} />}
      />
      <Route
      path="*"
      element={<NotFound />} 
      />
      
    </Routes>
  </>
);

export default AdminRoutes;

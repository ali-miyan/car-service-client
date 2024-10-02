import { Route, Routes } from "react-router-dom";
import Home from "../pages/userPages/Home";
import ChangePassword from "../pages/userPages/ChangePassword";
import NewPasswordPage from "../pages/userPages/NewPasswordPage";
import Profile from "../pages/userPages/UserProfile";
import Protect from "./protectedRoutes/UserProtectedRoute";
import Verify from "./protectedRoutes/UserVerifyRoute";
import ForBusiness from "../pages/userPages/ForBusinessPage";
import Services from "../pages/userPages/ServicePage";
import AboutCompany from "../pages/userPages/AboutCompany";
import SelectedService from "../pages/userPages/SelectedServicePage";
import SetSpot from "../pages/userPages/SetSpotPage";
import SchedulePage from "../pages/userPages/SchedulePage";
import AtHome from "../pages/userPages/AtHome";
import AtServiceCenter from "../pages/userPages/AtServiceCenter";
import CheckoutPage from "../pages/userPages/CheckoutPage";
import SuccessPage from "../pages/userPages/SuccessPage";
import FailurePage from "../pages/userPages/FailurePage";
import OrderDetails from "../pages/userPages/OrderDetails";
import LiveTrackPage from "../pages/userPages/LiveTrackPage";
import AboutUs from "../pages/userPages/AboutUsPage";
import NotFound from "../components/common/404";

const UserRoutes = () => (
  <Routes>

    <Route 
      path="/"
      element={<Verify element={Home} />} 
    />
    <Route 
      path="/home"
      element={<Protect element={Home} />} 
    />
    <Route 
      path="/services"
      element={<Services />} 
    />
    <Route 
      path="/about-us"
      element={<AboutUs />} 
    />
    <Route 
      path="/profile"
      element={<Protect element={Profile} />} 
    />
    <Route 
      path="/for-business"
      element={<ForBusiness />} />
    <Route
      path="/change-password"
      element={<Verify element={ChangePassword} />}
    />
    <Route
      path="/reset-password/:token"
      element={<Verify element={NewPasswordPage} />}
    />
    <Route 
      path="/about-company/:id" 
      element={<AboutCompany />} 
    />
    <Route 
      path="/selected-service/:id" 
      element={<SelectedService />} 
    />
    <Route 
      path="/set-spot/:id" 
      element={<Protect element={SetSpot} />} 
    />
    <Route
      path="/service-schedule/:id"
      element={<Protect element={SchedulePage} />}
    />
    <Route 
      path="/service-at-home/:id" 
      element={<Protect element={AtHome} />} 
    />
    <Route
      path="/service-at-center/:id"
      element={<Protect element={AtServiceCenter} />}
    />
    <Route
     path="/checkout/:id"
     element={<Protect element={CheckoutPage} />}
    />
    <Route
      path="/checkout-success"
      element={<Protect element={SuccessPage} />}
    />
    <Route
      path="/checkout-failure"
      element={<Protect element={FailurePage} />}
    />
    <Route
      path="/order-details/:id"
      element={<Protect element={OrderDetails} />}
    />
    <Route
      path="/live-track/:id"
      element={<Protect element={LiveTrackPage} />}
    />
    <Route 
      path="*" 
      element={<NotFound />} 
    />
    
  </Routes>
);

export default UserRoutes;

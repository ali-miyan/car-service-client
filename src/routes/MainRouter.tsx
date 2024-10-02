import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FormProvider } from "../context/RegisterContext";
import { LocationProvider } from "../context/MapContext";
import Loader from "../components/common/Loader";
const AdminRoutes = lazy(() => import("./AdminRoutes"));
const UserRoutes = lazy(() => import("./UserRoutes"));
const CompanyRoutes = lazy(() => import("./CompanyRoutes"));

const Router = () => {
  return (
    <BrowserRouter>
      <FormProvider>
        <LocationProvider>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/*" element={<UserRoutes />} />
              <Route path="/admin/*" element={<AdminRoutes />} />
              <Route path="/company/*" element={<CompanyRoutes />} />
            </Routes>
          </Suspense>
        </LocationProvider>
      </FormProvider>
    </BrowserRouter>
  );
};

export default Router;

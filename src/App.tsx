import { Provider } from "react-redux";
import Router from "./routes/MainRouter";
import store, { persistor } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import { Toast } from "./components/common/Toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "react-notifications-component/dist/theme.css";

function App() {
  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_REACT_GOOGLE_TOKEN}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Router />
            <Toast />
          </PersistGate>
        </Provider>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;

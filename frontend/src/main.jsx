import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./hooks/useAuth";
import { DeviceProvider } from "./hooks/useDevice";
import ErrorBoundary from "./components/ErrorBoundary";
import App from "./App";
import "./index.css";
import { initializeExperiments } from "./experiments";

initializeExperiments();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <DeviceProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </DeviceProvider>
      </ErrorBoundary>
    </HelmetProvider>
  </React.StrictMode>
);

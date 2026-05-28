import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import { Toaster } from "react-hot-toast";
import { useAppData } from "./context/AppContext";

/* ─── Protect routes that require login ─── */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuth } = useAppData();
  return isAuth ? <>{children}</> : <Navigate to="/login" replace />;
};

/* ─── Redirect logged-in users away from auth pages ─── */
const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuth } = useAppData();
  return isAuth ? <Navigate to="/" replace /> : <>{children}</>;
};

const App = () => {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111827",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      />

      <Routes>
        {/* Protected */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Guest only */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <GuestRoute>
              <ForgotPassword />
            </GuestRoute>
          }
        />

        <Route
          path="/reset-password/:token"
          element={
            <GuestRoute>
              <ResetPassword />
            </GuestRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
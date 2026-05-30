import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SelectRole from "./pages/SelectRole";

import PublicRoute from "./components/publicRoute";
import ProtectedRoute from "./components/protectedRoute";

import { Toaster } from "react-hot-toast";
import { useAppData } from "./context/AppContext";

const App = () => {
  const { loading } = useAppData();

  if (loading) {
    return (
      <h1 className="text-2xl font-bold text-red-500 text-center mt-56">
        Loading...
      </h1>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />
          <Route
            path="/reset-password/:token"
            element={<ResetPassword />}
          />
        </Route>

        {/* Select Role */}
        <Route
          path="/select-role"
          element={<SelectRole />}
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>

      <Toaster position="top-right" />
    </BrowserRouter>
  );
};

export default App;
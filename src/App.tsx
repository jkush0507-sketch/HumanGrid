import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import VerifyOTP from "./pages/VerifyOTP";
import Dashboard from "./pages/Dashboard";
import SOS from "./pages/SOS";
import Map from "./pages/Map";
import AIChat from "./pages/AIChat";

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      <Route
        path="/verify-otp"
        element={<VerifyOTP />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/sos"
        element={<SOS />}
      />

      <Route
        path="/map"
        element={<Map />}
      />

      <Route
        path="/ai"
        element={<AIChat />}
      />

    </Routes>
  );
}

export default App;
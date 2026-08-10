import VerifyOTP from "./pages/VerifyOTP";
import { Routes, Route } from "react-router-dom";
import AIChat from "./pages/AIChat";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SOS from "./pages/SOS";
import Map from "./pages/Map";

import Signup from "./components/Signup";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/sos" element={<SOS />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/map" element={<Map />} />
      <Route path="/ai" element={<AIChat />} />
    </Routes>
  );
}

export default App;
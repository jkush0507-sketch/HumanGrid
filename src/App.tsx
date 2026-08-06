import { Routes, Route } from "react-router-dom";

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
      <Route path="/map" element={<Map />} />
    </Routes>
  );
}

export default App;
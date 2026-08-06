import { useState } from "react";
import "./SOSButton.css";

const SOSButton = () => {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState("Fetching location...");

  const handleOpen = () => {
    setOpen(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(
            `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`
          );
        },
        () => setLocation("Location unavailable — please enable GPS")
      );
    } else {
      setLocation("Geolocation not supported");
    }
  };

  return (
    <>
      <button className="sos-button" onClick={handleOpen}>
        SOS
      </button>

      {open && (
        <div className="sos-overlay" onClick={() => setOpen(false)}>
          <div className="sos-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Emergency Help</h3>
            <p className="sos-location">{location}</p>

            <div className="sos-options">
              <a href="tel:102" className="sos-option ambulance">
                🚑 Call Ambulance
              </a>
              <a href="tel:100" className="sos-option police">
                🚓 Call Police
              </a>
              <a href="tel:101" className="sos-option fire">
                🔥 Call Fire Brigade
              </a>
            </div>

            <button className="sos-close" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SOSButton;
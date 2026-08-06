import { findNearby } from "../utils/findNearby";

const NearbyServices = () => {
  return (
    <section>
      <h2>Nearby Services</h2>

      <button onClick={() => findNearby("hospital")}>
        Find Hospitals
      </button>

      <button onClick={() => findNearby("police station")}>
        Find Police Stations
      </button>

      <button onClick={() => findNearby("blood bank")}>
        Find Blood Banks
      </button>
    </section>
  );
};

export default NearbyServices;
export const findNearby = (serviceType: string) => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      const url = `https://www.google.com/maps/search/${encodeURIComponent(
        serviceType
      )}/@${latitude},${longitude},14z`;

      window.open(url, "_blank");
    },
    () => {
      alert("Please enable location access.");
    }
  );
};
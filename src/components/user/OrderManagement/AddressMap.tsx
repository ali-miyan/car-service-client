import ReactMapGL, {
  GeolocateControl,
  Marker,
  NavigationControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Geocoder from "../../company/Geocoder";
const MAPBOX_TOKEN = import.meta.env.VITE_REACT_APP_MAPBOX_TOKEN;

const AddressMap: React.FC = () => {

  const handleDragEnd = async (event: { lngLat: any }) => {
    const { lngLat } = event;
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat["lng"]},${lngLat["lat"]}.json?access_token=${MAPBOX_TOKEN}`
      );
      if (!response.ok) {
        throw new Error("Reverse geocoding request failed.");
      }
      const data = await response.json();
      console.log("Reverse geocoding result:", data);

      const formattedAddress = data.features[0].place_name;
      console.log("Formatted Address:", formattedAddress.split(","));
    } catch (error) {
      console.error("Error fetching reverse geocoding data:", error);
    }
  };

  const onLocate = async (event: any) => {
    const { coords } = event;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.longitude},${coords.latitude}.json?access_token=${MAPBOX_TOKEN}`
      );
      if (!response.ok) {
        throw new Error("Reverse geocoding request failed.");
      }
      const data = await response.json();
      console.log("Reverse geocoding result:", data);

      const formattedAddress = data.features[0].place_name;
      console.log("Formatted Address:", formattedAddress.split(","));
    } catch (error) {
      console.error("Error fetching reverse geocoding data:", error);
    }
  };

  return (
    <ReactMapGL
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={{
        longitude: 75.9643,
        latitude: 11.1457,
        zoom: 8,
      }}
      mapStyle="mapbox://styles/mapbox/outdoors-v12"
      style={{ width: "360px", height: "360px", margin: "0 auto" }}
    >
      <Marker
        latitude={75.9643}
        longitude={11.1457}
        draggable
        onDragEnd={handleDragEnd}
      />
      <NavigationControl position="bottom-left" />
      <GeolocateControl
        position="top-left"
        trackUserLocation
        onGeolocate={onLocate}
      />
      <Geocoder />
      <div
        style={{
          position: "absolute",
          bottom: 1,
          left: 10,
          backgroundColor: "white",
          padding: "5px",
          borderRadius: "5px",
        }}
      >
        <p>Address:</p>
      </div>
    </ReactMapGL>
  );
};

export default AddressMap;

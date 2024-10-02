import ReactMapGL, { GeolocateControl, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Geocoder from "./Geocoder";
import { useLocation } from "../../context/MapContext";

const MAPBOX_TOKEN = import.meta.env.VITE_REACT_APP_MAPBOX_TOKEN;

const MapComponent: React.FC<{ mapChanged: (data: boolean) => void }> = ({
  mapChanged,
}) => {
  const {
    latitude,
    longitude,
    address,
    setLatitude,
    setLongitude,
    setAddress,
  } = useLocation();

  const handleDragEnd = async (event: { lngLat: any }) => {
    const { lngLat } = event;

    setLatitude(lngLat["lat"]);
    setLongitude(lngLat["lng"]);

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat["lng"]},${lngLat["lat"]}.json?access_token=${MAPBOX_TOKEN}`
      );
      if (!response.ok) {
        throw new Error("Reverse geocoding request failed.");
      }
      const data = await response.json();
      const formattedAddress = data.features[0].place_name;
      setAddress(formattedAddress.split(","));

      mapChanged(true);
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
      const formattedAddress = data.features[0].place_name;
      setAddress(formattedAddress.split(","));
    } catch (error) {
      console.error("Error fetching reverse geocoding data:", error);
    }

    setLatitude(coords.latitude);
    setLongitude(coords.longitude);
    mapChanged(true);
  };

  return (
    <ReactMapGL
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={{
        longitude: longitude,
        latitude: latitude,
        zoom: 8,
      }}
      mapStyle="mapbox://styles/mapbox/outdoors-v12"
      style={{ width: "420px", height: "360px", margin: "0 auto" }}
    >
      <Marker
        latitude={latitude}
        longitude={longitude}
        draggable
        onDragEnd={handleDragEnd}
      />
      <GeolocateControl
        position="top-left"
        trackUserLocation
        onGeolocate={onLocate}
      />
      <Geocoder />
      <div className="absolute z-50 bottom-0 bg-white shadow-xl  border-2 border-black text-sm font-bai-regular p-2 ">
        <p>
          <span className="uppercase font-bai-bold">Address:</span> {address}
        </p>
      </div>
    </ReactMapGL>
  );
};

export default MapComponent;

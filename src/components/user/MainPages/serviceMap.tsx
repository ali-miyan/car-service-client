import React, { useState, useEffect, useRef } from "react";
import ReactMapGL, {
  GeolocateControl,
  NavigationControl,
  Marker,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useLocation } from "../../../context/MapContext";
import Geocoder from "../../company/Geocoder";
import { useGetCompaniesQuery } from "../../../store/slices/companyApiSlice";
import { Link } from "react-router-dom";
import { calculateDistance } from "../../../helpers/getDistance";

const MAPBOX_TOKEN = import.meta.env.VITE_REACT_APP_MAPBOX_TOKEN;

const ServiceMap: React.FC = () => {
  const {
    latitude: userLatitude,
    longitude: userLongitude,
    address,
    setLatitude,
    setLongitude,
  } = useLocation();

  const { data: posts } = useGetCompaniesQuery({});

  const geolocateControlRef = useRef<any>(null);
  const mapRef = useRef<any>(null);
  const routeRef = useRef<any>(null);

  const [sortedPosts, setSortedPosts] = useState<any[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<any | null>(null);

  const onLocate = async (event: any) => {
    const { coords } = event;
    try {
      setLatitude(coords.latitude);
      setLongitude(coords.longitude);
    } catch (error) {
      console.error("Error setting user location:", error);
    }
  };

  useEffect(() => {
    if (posts && userLatitude && userLongitude) {
      const sorted = posts.slice().sort((a: any, b: any) => {
        const distanceA = calculateDistance(
          userLatitude,
          userLongitude,
          a.address.latitude,
          a.address.longitude
        );
        const distanceB = calculateDistance(
          userLatitude,
          userLongitude,
          b.address.latitude,
          b.address.longitude
        );
        return distanceA - distanceB;
      });
      setSortedPosts(sorted);
    }
  }, [posts, userLatitude, userLongitude]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (geolocateControlRef.current) {
        geolocateControlRef.current.trigger();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [geolocateControlRef]);

  const setPath = (center: any) => {
    setSelectedCenter(center); // Set the selected center
    const map = mapRef.current.getMap();

    if (routeRef.current) {
      map.removeLayer("route");
      map.removeSource("route");
      routeRef.current = null;
    }

    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${userLongitude},${userLatitude};${center.address.longitude},${center.address.latitude}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const route = data.routes[0].geometry;

        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: route,
          },
        });

        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#888",
            "line-width": 8,
          },
        });

        routeRef.current = "route";
      })
      .catch((error) => console.error("Error fetching route:", error));

    // Re-sort the companies with the selected one at the top
    if (sortedPosts) {
      const newSortedPosts = sortedPosts.slice().sort((a: any, b: any) => {
        if (a._id === center._id) return -1; // Bring clicked company to the top
        if (b._id === center._id) return 1;
        const distanceA = calculateDistance(
          userLatitude,
          userLongitude,
          a.address.latitude,
          a.address.longitude
        );
        const distanceB = calculateDistance(
          userLatitude,
          userLongitude,
          b.address.latitude,
          b.address.longitude
        );
        return distanceA - distanceB;
      });
      setSortedPosts(newSortedPosts);
    }
  };

  return (
    <>
      <ReactMapGL
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: userLongitude || 0,
          latitude: userLatitude || 0,
          zoom: 10,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{
          width: "100%",
          height: "100%",
          margin: "0 auto",
          border: "3px solid #d8d8d8",
        }}
        ref={mapRef}
      >
        <NavigationControl position="bottom-left" />
        <GeolocateControl
          ref={geolocateControlRef}
          position="top-left"
          trackUserLocation
          onGeolocate={onLocate}
        />
        <Geocoder />
        {sortedPosts &&
          sortedPosts.map((center: any) => (
            <Marker
              key={center._id}
              latitude={center.address.latitude}
              longitude={center.address.longitude}
              anchor="bottom"
            >
              <div
                className="flex flex-col items-center font-bai-regular cursor-pointer"
                onClick={() => setPath(center)}
              >
                <img
                  src={center.logo}
                  alt="Car Service Center"
                  className="w-20 h-20 border border-gray-500"
                />
              </div>
            </Marker>
          ))}
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
          <p>Address: {address}</p>
        </div>
      </ReactMapGL>
      <div
        className="absolute font-bai-regular top-11 sm:top-13 sm:left-16 w-72 h-56 bg-white border shadow-lg overflow-y-auto p-2"
        style={{
          maxHeight: "200px",
        }}
      >
        <h3 className="font-bold font-bai-bold text-center underline underline-offset-4 uppercase mb-4">
          Service Centers near me
        </h3>
        {sortedPosts ? (
          sortedPosts.map((center: any) => (
            <div
              key={center._id}
              className={`mb-2 p-2 cursor-pointer border hover:bg-red-50 ${
                selectedCenter?._id === center._id ? "bg-red-50" : ""
              }`}
              onClick={() => setPath(center)}
            >
              <Link to={`/about-company/${center._id}`}>
                <div className="flex items-center cursor-pointer">
                  <img
                    src={center.logo}
                    alt="Car Service Center"
                    className="w-9 h-9 mr-2"
                  />
                  <div className="text-sm">
                    <div className="font-bold">{center.companyName}</div>
                    <div className="text-gray-600">
                      {center.address.address}
                    </div>
                    <div className="text-gray-600 text-xs">
                      Distance:{" "}
                      {calculateDistance(
                        userLatitude,
                        userLongitude,
                        center.address.latitude,
                        center.address.longitude
                      ).toFixed(2)}{" "}
                      km
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </>
  );
};

export default ServiceMap;

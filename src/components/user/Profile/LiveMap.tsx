import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import polyline from "polyline";
import { useBookingSocket } from "../../../service/socketService";
import { getInitialToken } from "../../../helpers/getToken";

mapboxgl.accessToken = import.meta.env.VITE_REACT_APP_MAPBOX_TOKEN

const MapboxMap = ({
  liveLongitude,
  liveLatittude,
  userDetails,
  companyDetails,
}: any) => {
  const token = getInitialToken("userToken");

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [liveMarker, setLiveMarker] = useState<mapboxgl.Marker | null>(null);
  const [companyToLiveRouteSource, setCompanyToLiveRouteSource] = useState<mapboxgl.GeoJSONSource | null>(null);
  const socket = useBookingSocket(token as string);

  useEffect(() => {
    if (socket) {
      socket.on(
        "location_updated",
        async (data: { longitude: number; latitude: number }) => {
          console.log(data, "data live");

          if (map && liveMarker) {
            liveMarker.setLngLat([data.longitude, data.latitude]);
            map.setCenter([data.longitude, data.latitude]);

            try {
              const companyToLiveResponse = await axios.get(
                `https://api.mapbox.com/directions/v5/mapbox/driving/${companyDetails.longitude},${companyDetails.latitude};${data.longitude},${data.latitude}?access_token=${mapboxgl.accessToken}`
              );

              console.log(
                "Updated Company to Live Route Response:",
                companyToLiveResponse.data
              );

              const companyToLivePolyline =
                companyToLiveResponse.data.routes[0]?.geometry;
              if (companyToLivePolyline) {
                const companyToLiveRoute = polyline.decode(
                  companyToLivePolyline
                );
                const companyToLiveCoordinates = companyToLiveRoute.map(
                  ([lat, lng]) => [lng, lat]
                );

                if (companyToLiveRouteSource) {
                  companyToLiveRouteSource.setData({
                    type: "Feature",
                    properties: {},
                    geometry: {
                      type: "LineString",
                      coordinates: companyToLiveCoordinates,
                    },
                  });
                }
              }
            } catch (error) {
              console.error("Error fetching updated route:", error);
            }
          }
        }
      );
    }
    return () => {
      if (socket) {
        socket.off("location_updated");
      }
    };
  }, [socket, map, liveMarker, companyDetails, companyToLiveRouteSource]);

  useEffect(() => {
    if (!mapContainer.current) return;

    const mapInstance:any = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [userDetails.longitude, userDetails.latitude],
      zoom: 12,
    });

    mapInstance.on("load", () => {
      new mapboxgl.Marker({ color: "blue" })
        .setLngLat([userDetails.longitude, userDetails.latitude])
        .setPopup(new mapboxgl.Popup().setText("User Location"))
        .addTo(mapInstance);

      const companyIcon = document.createElement("div");
      companyIcon.style.backgroundImage = `url(${companyDetails.image})`;
      companyIcon.style.backgroundSize = "contain";
      companyIcon.style.backgroundRepeat = "no-repeat";
      companyIcon.style.width = "90px";
      companyIcon.style.height = "90px";
      companyIcon.title = companyDetails.name;

      new mapboxgl.Marker(companyIcon)
        .setLngLat([companyDetails.longitude, companyDetails.latitude])
        .setPopup(new mapboxgl.Popup().setText(companyDetails.name))
        .addTo(mapInstance);

      const homeIcon = document.createElement("div");
      homeIcon.style.backgroundImage = `url('/assets/pointer-with-icon-car-free-vector-removebg-preview.png')`; 
      homeIcon.style.backgroundSize = "contain";
      homeIcon.style.backgroundRepeat = "no-repeat";
      homeIcon.style.width = "70px";
      homeIcon.style.height = "70px";
      homeIcon.title = "Car Location";

      const initialLiveMarker = new mapboxgl.Marker(homeIcon)
        .setLngLat([liveLongitude, liveLatittude])
        .setPopup(new mapboxgl.Popup().setText("Driver Location"))
        .addTo(mapInstance);

      setLiveMarker(initialLiveMarker);

      const fetchRoutes = async () => {
        try {
          const userToCompanyResponse = await axios.get(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${userDetails.longitude},${userDetails.latitude};${companyDetails.longitude},${companyDetails.latitude}?access_token=${mapboxgl.accessToken}`
          );

          const companyToLiveResponse = await axios.get(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${companyDetails.longitude},${companyDetails.latitude};${liveLongitude},${liveLatittude}?access_token=${mapboxgl.accessToken}`
          );

          console.log(
            "User to Company Route Response:",
            userToCompanyResponse.data
          );
          console.log(
            "Company to Live Route Response:",
            companyToLiveResponse.data
          );

          const userToCompanyPolyline =
            userToCompanyResponse.data.routes[0]?.geometry;
          if (userToCompanyPolyline) {
            const userToCompanyRoute = polyline.decode(userToCompanyPolyline);
            const userToCompanyCoordinates = userToCompanyRoute.map(
              ([lat, lng]) => [lng, lat]
            );

            if (!mapInstance.getSource("user-to-company-route")) {
              mapInstance.addSource("user-to-company-route", {
                type: "geojson",
                data: {
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "LineString",
                    coordinates: userToCompanyCoordinates,
                  },
                },
              });

              mapInstance.addLayer({
                id: "user-to-company-route",
                type: "line",
                source: "user-to-company-route",
                layout: {
                  "line-join": "round",
                  "line-cap": "round",
                },
                paint: {
                  "line-color": "#0400ff",
                  "line-width": 5,
                },
              });
            } else {
              mapInstance.getSource("user-to-company-route").setData({
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: userToCompanyCoordinates,
                },
              });
            }
          }

          const companyToLivePolyline =
            companyToLiveResponse.data.routes[0]?.geometry;
          if (companyToLivePolyline) {
            const companyToLiveRoute = polyline.decode(companyToLivePolyline);
            const companyToLiveCoordinates = companyToLiveRoute.map(
              ([lat, lng]) => [lng, lat]
            );

            if (!mapInstance.getSource("company-to-live-route")) {
              mapInstance.addSource("company-to-live-route", {
                type: "geojson",
                data: {
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "LineString",
                    coordinates: companyToLiveCoordinates,
                  },
                },
              });

              mapInstance.addLayer({
                id: "company-to-live-route",
                type: "line",
                source: "company-to-live-route",
                layout: {
                  "line-join": "round",
                  "line-cap": "round",
                },
                paint: {
                  "line-color": "#ff0000",
                  "line-width": 5,
                },
              });

              setCompanyToLiveRouteSource(
                mapInstance.getSource(
                  "company-to-live-route"
                ) as mapboxgl.GeoJSONSource
              );
            } else {
              mapInstance.getSource("company-to-live-route").setData({
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: companyToLiveCoordinates,
                },
              });
            }
          }
        } catch (error) {
          console.error("Error fetching routes:", error);
        }
      };

      fetchRoutes();
    });

    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, [liveLongitude, liveLatittude, userDetails, companyDetails]);

  return <div ref={mapContainer} className="w-full h-full" />;
};

export default MapboxMap;

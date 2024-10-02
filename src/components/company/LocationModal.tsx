import React, { useEffect, useState } from "react";
import MiniMap from "./MapBox";
import { useLocation } from "../../context/MapContext";
import { useForm } from "../../context/RegisterContext";

const LocationModal: React.FC<{
  onClose: () => void;
  setIsAddressFilled?: () => void;
  handleAddress?: (prop: object) => void;
}> = ({ setIsAddressFilled, onClose, handleAddress }) => {

  const { address, latitude, longitude } = useLocation();
  const { setFormData } = useForm();

  const [message, setMessage] = useState<string | null>(null);
  const [locationData, setLocationData] = useState<any>({
    address: "",
    city: "",
    streetRegion: "",
    postcode: "",
    country: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    if (address && latitude && longitude) {
      setLocationData({
        address: address[0] || "",
        city: address[4] || "",
        streetRegion: address[2] || "",
        postcode: address[1] || "",
        country: address[6] || "",
        latitude: latitude || "",
        longitude: longitude || "",
      });
    }
  }, [address, latitude, longitude]);

  const mapChanged = (data: boolean) => {
    setMessage(data ? null : "Please select a location on the map.");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(locationData, "logadders");

    if (
      !locationData.latitude ||
      !locationData.longitude ||
      !locationData.city
    ) {
      setMessage("Please select a location on the map.");
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      address: locationData,
    }));

    if (handleAddress) {
      handleAddress(locationData);
    }
    if (setIsAddressFilled) {
      setIsAddressFilled();
    }
    onClose();
  };

  return (
    <div className=" md:flex-row justify-center lowercase items-center  font-bai-medium">
      <div className="w-full">
        <MiniMap mapChanged={mapChanged} />
      </div>
      <form
        className="p-3 rounded-lg text-gray-700 w-full"
        onSubmit={handleSubmit}
      >
        {message && (
          <p className="text-red-500 font-bai-regular lowercase text-xs my-1">
            {message}
          </p>
        )}

        <div className="mb-5">
          <button
            type="submit"
            className="bg-red-800 hover:bg-red-900 text-white font-bai-regular font-bold p-2 px-4 rounded w-full"
          >
            SUBMIT
          </button>
        </div>
      </form>
    </div>
  );
};

export default LocationModal;

import React from "react";
import {
  FaStar,
  FaStarHalfAlt,
  FaClock,
  FaMapMarkerAlt,
  FaTools,
  FaBuilding,
} from "react-icons/fa";

const ServiceCard = ({
  id,
  company,
  selectedHours,
  servicePlace,
  image,
  serviceData,
  servicePackage,
  ratings,
}:any) => {
  const service = React.useMemo(
    () => serviceData.find((service:any) => service.id === id),
    [id, serviceData]
  );

  const totalRatings = ratings?.length;
  const averageRating = totalRatings
    ? (
        ratings.reduce((acc:any, { stars }:any) => acc + stars, 0) / totalRatings
      ).toFixed(1)
    : 0;

  const fullStars = Math.floor(Number(averageRating));
  const hasHalfStar = Number(averageRating) % 1 >= 0.5;

  return (
    <div className="bg-white border border-gray-300 rounded-lg hover:shadow-xl transform hover:scale-99 transition duration-300 overflow-hidden">
      <div className="absolute top-2 right-0 bg-gradient-to-r from-red-900 to-pink-700 text-white z-50 text-xs font-semibold py-1.5 px-3 rounded-l-full shadow-md flex items-center space-x-1">
        <FaClock size={14} />
        <span>{servicePackage.detail.workingHours} hours</span>
      </div>
      <div className="relative">
        <img src={image} alt="Service" className="w-full h-48 object-cover" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-80"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-2xl font-bold capitalize">{service?.name}</h2>
          <p className="text-sm opacity-75">{company?.companyName}</p>
        </div>
      </div>
      <div className="px-6 py-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <img
              src={company?.logo}
              alt="Company Logo"
              className="w-16 h-16 object-contain rounded-full border-2 border-gray-200"
            />
            <div className="ml-3">
              <p className="font-bold text-gray-800">{company?.companyName}</p>
              <p className="text-sm text-gray-600">Since {company?.year}</p>
            </div>
          </div>
          <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
            {[...Array(fullStars)].map((_, index) => (
              <FaStar key={index} className="text-yellow-400 text-sm" />
            ))}
            {hasHalfStar && (
              <FaStarHalfAlt className="text-yellow-400 text-sm" />
            )}
            {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map(
              (_, index) => (
                <FaStar
                  key={`empty-${index}`}
                  className="text-gray-300 text-sm"
                />
              )
            )}
            <span className="text-gray-600 text-sm font-semibold ml-1">
              {averageRating}
            </span>
          </div>
        </div>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <FaBuilding className="mr-2 text-[#ab0000]" />
            <span className="font-semibold">Price:</span>
            <span className="ml-1">₹{servicePackage?.detail.price}</span>
          </div>
          <div className="flex items-center">
            <FaClock className="mr-2 text-[#ab0000]" />
            <span className="font-semibold">Hours:</span>
            <span className="ml-1">{selectedHours}</span>
          </div>
          <div className="flex items-center">
            <FaMapMarkerAlt className="mr-2 text-[#ab0000]" />
            <span className="font-semibold">Area:</span>
            <span className="ml-1">{servicePlace}</span>
          </div>
          <div className="flex items-center">
            <FaTools className="mr-2 text-[#ab0000]" />
            <span className="font-semibold">Type:</span>
            <span className="ml-1">
              {service ? service.name : "Unknown Service"}
            </span>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 px-6 py-2">
        <p className="text-sm text-gray-600 overflow-hidden whitespace-nowrap text-ellipsis">
          <span className="font-semibold">Location:</span>{" "}
          {company?.address?.city}, {company?.address?.address}
        </p>
      </div>
    </div>
  );
};

export default React.memo(ServiceCard);

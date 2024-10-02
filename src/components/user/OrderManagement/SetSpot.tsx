import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlaceCard } from "../../../schema/component";
import { useNavigate } from "react-router-dom";
import { RegistrationStep } from "../../common/OrderHeader";
import { SetSelectedPlace } from "../../../context/OrderContext";

const ServiceOptions = React.memo(() => {
  const { servicePlace, serviceId } = useSelector((state: any) => state.order);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNext = useCallback(
    (name: string) => {
      dispatch(SetSelectedPlace(name));
      navigate(`/service-schedule/${serviceId}`);
    },
    [navigate, serviceId]
  );

  return (
    <>
      <div className="container mx-auto w-7/12 font-bai-regular px-4 py-20">
        <h1 className="text-2xl font-bai-bold font-bold text-center mb-2">
          BOOK YOUR SERVICE
        </h1>
        <p className="text-sm text-gray-600 text-center mb-8">
          PLEASE PROVIDE ALL REQUIRED DETAILS TO BOOK YOUR SERVICE WITH US
        </p>

        <div className="flex flex-col md:flex-row justify-around items-center">
          <RegistrationStep number={1} text="SELECT SPOT" filled />
          <div className="hidden md:block flex-grow border-t-2 border-gray-300 mb-5"></div>
          <RegistrationStep number={2} text="SCHEDULING" />
          <div className="hidden md:block flex-grow border-t-2 border-gray-300 mb-5"></div>
          <RegistrationStep number={3} text="ADDRESSING" />
          <div className="hidden md:block flex-grow border-t-2 border-gray-300 mb-5"></div>
          <RegistrationStep number={4} text="CONFIRMATION" />
        </div>
      </div>
      <div className="container mx-auto font-bai-regular pb-10 lowercase md:px-5 md:w-full lg:w-8/12 px-20">
        <h1 className="text-xl font-bai-semi-bold font-bold text-center uppercase mb-8">
          SELECT A SPOT
        </h1>
        <div className="grid md:grid-cols-2 gap-8">
          <ServiceCard
            title="SERVICE CENTER"
            subtitle="Experience Service at Our Center"
            imageSrc="/assets/isometric-banner-of-car-repair-center-2528088-2121241.webp"
            features={[
              "Bring your car to our fully-equipped service center",
              "Access to advanced diagnostic tools and equipment",
              "Comprehensive inspection and repairs by expert technicians",
              "Enjoy our comfortable waiting area with free Wi-Fi and refreshments",
              "Receive regular updates on your car’s service status",
              "Experienced staff to handle a wide range of car issues",
              "Convenient scheduling with flexible appointment times",
            ]}
            handleNext={() => handleNext("service")}
            isDisabled={servicePlace === "home"}
          />
          <ServiceCard
            title="Mobile Pick-Up"
            subtitle="Service at Your Doorstep"
            imageSrc="/assets/2121248.webp"
            features={[
              "Convenient pick-up and drop-off of your car from your location",
              "Repairs and inspections performed at our fully-equipped service center",
              "Regular updates on your car’s service status throughout the process",
              "Comprehensive inspection and repairs by expert technicians",
              "No need to visit the service center—save time and hassle",
              "Expert handling of a wide range of car issues",
              "Flexible scheduling to fit your busy lifestyle",
            ]}
            handleNext={() => handleNext("home")}
            isDisabled={servicePlace === "service"}
          />
        </div>
      </div>
    </>
  );
});

const ServiceCard = React.memo(
  ({
    title,
    subtitle,
    imageSrc,
    features,
    handleNext,
    isDisabled,
  }: PlaceCard) => {
    return (
      <div
        className={`bg-white p-6 shadow-md flex ${
          isDisabled ? "brightness-90 cursor-not-allowed" : ""
        } flex-col h-full`}
      >
        <div className="mb-4 flex justify-center">
          <img src={imageSrc} alt={title} className="w-48 h-48 object-cover" />
        </div>
        <h2 className="text-xl font-semibold text-center uppercase font-bai-bold mb-2">
          {title}
        </h2>
        <p className="text-sm text-gray-600 text-center mb-4">{subtitle}</p>
        <ul className="flex-1 space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2">•</span>
              <span className="text-xs mt-1">{feature}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={isDisabled ? undefined : handleNext}
          className={`${
            isDisabled ? "cursor-not-allowed" : ""
          } w-full bg-black text-white py-2 transition-colors`}
        >
          {isDisabled ? "Service not available" : "NEXT"}
        </button>
      </div>
    );
  }
);

export default ServiceOptions;

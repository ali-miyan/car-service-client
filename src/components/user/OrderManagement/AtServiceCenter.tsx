import { useState } from "react";
import { RegistrationStep } from "../../common/OrderHeader";
import { getInitialToken } from "../../../helpers/getToken";
import { useGetCarByIdQuery } from "../../../store/slices/userApiSlice";
import CarBrandsModal from "../Profile/CarBrandsModal";
import { setCarModel } from "../../../context/OrderContext";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { notifyError } from "../../common/Toast";

const AtServiceCenter = () => {

  const token = getInitialToken("userToken");
  const { data: posts, refetch } = useGetCarByIdQuery(token as string);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const { serviceId } = useSelector((state: any) => state.order);


  const handleAddCarClick = () => {
    setIsModalOpen(true);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNext = () => {
    if (!selectedCarId) {
      notifyError("please select a car");
      return;
    }
    dispatch(setCarModel(selectedCarId));
    navigate(`/checkout/${serviceId}`);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleRadioChange = (carId: string) => {
    setSelectedCarId(carId);
  };

  const handleCarClick = (carId: string) => {
    setSelectedCarId(carId);
  };

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
          <Link to={`/set-spot/${serviceId}`}>
            <RegistrationStep number={1} text="SELECT SPOT" active />
          </Link>
          <div className="hidden md:block flex-grow border-t-2 border-gray-300 mb-5"></div>

          <Link to={`/service-schedule/${serviceId}`}>
            <RegistrationStep number={2} text="SCHEDULING" active />
          </Link>
          <div className="hidden md:block flex-grow border-t-2 border-gray-300 mb-5"></div>
          <RegistrationStep number={3} text="ADDRESSING" filled />
          <div className="hidden md:block flex-grow border-t-2 border-gray-300 mb-5"></div>
          <RegistrationStep number={4} text="CONFIRMATION" />
        </div>
      </div>
      <div className="flex flex-col items-center font-bai-regular bg-gray-100 p-6 md:p-12">
        <h1 className="text-xl font-bold mb-4 uppercase font-bai-bold">
          SELECT YOUR CAR
        </h1>

        <div className="flex flex-wrap justify-center  font-bai-regular w-full max-w-6xl">
          {posts?.car && posts.car.length > 0 ? (
            posts.car.map((car: any) => (
              <div
                key={car._id}
                className={`bg-white p-4 shadow-md mx-3 text-sm uppercase mb-4 rounded-md w-60 cursor-pointer ${
                  selectedCarId === car._id ? "border-2 border-red-900" : ""
                }`}
                onClick={() => handleCarClick(car._id)}
              >
                <input
                  type="radio"
                  id={`car-${car._id}`}
                  name="car"
                  value={car._id}
                  checked={selectedCarId === car._id}
                  onChange={() => handleRadioChange(car._id)}
                  className="hidden"
                />
                <div className="flex justify-center mb-2">
                  <img
                    src={car.src}
                    alt={car.name}
                    className="object-cover w-auto"
                  />
                </div>
                <div className="flex items-center mb-2">
                  <label htmlFor={`car-${car._id}`} className="flex-grow">
                    <h2 className="text-sm font-semibold">
                      <strong>Brand:</strong> {car.name}
                    </h2>
                    <p className="text-gray-700">
                      <strong>Color:</strong> {car.color}
                    </p>
                    <p className="text-gray-700">
                      <strong>Number:</strong> {car.vin}
                    </p>
                  </label>
                </div>
              </div>
            ))
          ) : (
            <p>No cars available</p>
          )}
        </div>
        <div className="flex justify-around">
          <button
            onClick={handleAddCarClick}
            className="bg-gray-900 text-white py-2 px-4  mx-4 items-center space-x-2 mt-6"
          >
            <span>ADD CAR</span>
          </button>
          <button
            onClick={handleNext}
            className="bg-gray-900 text-white py-2 px-4   items-center space-x-2 mt-6"
          >
            <span>NEXT</span>
          </button>
        </div>

        <CarBrandsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          refetch={refetch}
        />
      </div>
    </>
  );
};

export default AtServiceCenter;

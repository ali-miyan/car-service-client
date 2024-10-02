import { Link, useNavigate } from "react-router-dom";
import { RegistrationStep } from "../../common/OrderHeader";
import CarBrandsModal from "../Profile/CarBrandsModal";
import LocationModal from "../../company/LocationModal";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useState } from "react";
import { setAddress, setCarModel } from "../../../context/OrderContext";
import { useGetCarByIdQuery } from "../../../store/slices/userApiSlice";
import { getInitialToken } from "../../../helpers/getToken";
import { FaMapMarkerAlt } from "react-icons/fa";
import CustomModal from "../../common/Modal";
import { notifyError } from "../../common/Toast";

const CustomerDetails = () => {
  const token = getInitialToken("userToken");
  const { data: posts, refetch } = useGetCarByIdQuery(token as string);

  const [isCarModalOpen, setCarModalOpen] = useState<boolean>(false);
  const [isLocationModalOpen, setLocationModalOpen] = useState<boolean>(false);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);

  const { serviceId, address } = useSelector((state: any) => state.order);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleNext = useCallback(() => {
    if (Object.keys(address).length === 0) {
      notifyError("please select a address");
      return;
    } else if (!selectedCarId) {
      notifyError("please select a car");
      return;
    }
    dispatch(setCarModel(selectedCarId));
    navigate(`/checkout/${serviceId}`);
  }, [navigate, serviceId, dispatch, selectedCarId,isLocationModalOpen]);

  return (
    <>
      <div className="container mx-auto w-11/12 md:w-7/12 font-bai-regular px-4 py-20">
        <h1 className="text-2xl font-bai-bold text-center mb-2">
          BOOK YOUR SERVICE
        </h1>
        <p className="text-sm text-gray-600 text-center mb-8">
          PLEASE PROVIDE ALL REQUIRED DETAILS TO BOOK YOUR SERVICE WITH US
        </p>
        <div className="flex flex-col md:flex-row justify-around items-center mb-8">
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
      <div className="w-full md:w-1/5 mx-auto font-bai-regular mb-6 md:mb-0">
        <div className="flex items-center justify-center mb-6">
          <button
            type="button"
            className="flex items-center justify-between h-12 w-full px-4 bg-white border border-gray-300 rounded shadow-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setLocationModalOpen(true)}
          >
            <span className="font-bai-regular">
              {Object.keys(address).length === 0
                ? "Pick a location"
                : `${address.streetRegion || ""}, ${address.city || ""}, ${
                    address.postcode || ""
                  }`}
            </span>
            <FaMapMarkerAlt className="text-gray-500" />
          </button>
        </div>
      </div>
      <p className="text-center p-2 w-28 bg-gray-300 font-bai-regular text-red-900 mx-auto">
        ↓ fill both ↑
      </p>
      <div className="w-full md:w-4/5 mx-auto font-bai-regular bg-gray-100 p-6 md:p-12">
        <h1 className="text-xl font-bold mb-4 text-center font-bai-bold uppercase">
          SELECT YOUR CAR
        </h1>
        <div className="flex flex-wrap justify-center w-full  mb-6">
          {posts?.car.length ? (
            posts.car.map((car:any) => (
              <div
                key={car._id}
                className={`bg-white p-4 shadow-md mx-3 mb-4  w-60 cursor-pointer ${
                  selectedCarId === car._id ? "border-2 border-red-900" : ""
                }`}
                onClick={() => setSelectedCarId(car._id)}
                role="button"
                tabIndex={0}
              >
                <input
                  type="radio"
                  id={`car-${car._id}`}
                  name="car"
                  value={car._id}
                  checked={selectedCarId === car._id}
                  readOnly
                  className="hidden"
                />
                <div className="flex justify-center mb-2">
                  <img
                    src={car.src}
                    alt={car.name}
                    className="object-cover w-auto"
                  />
                </div>
                <div className="flex items-center uppercase mb-2">
                  <label htmlFor={`car-${car._id}`} className="flex-grow">
                    <h2 className="text-sm">
                      <span className="uppercase font-semibold">Brand:</span> {car.name}
                    </h2>
                    <p className="">
                      <span className="uppercase font-semibold">Color:</span> {car.color}
                    </p>
                    <p className="">
                      <span className="uppercase font-semibold">Number:</span> {car.vin}
                    </p>
                  </label>
                </div>
              </div>
            ))
          ) : (
            <p>No cars available</p>
          )}
        </div>
        <div className="flex flex-col  md:flex-row justify-around w-full mt-6">
          <button
            onClick={() => setCarModalOpen(true)}
            className="bg-gray-900 text-white py-2 px-4 mx-2 "
          >
            ADD CAR
          </button>
          <button
            onClick={handleNext}
            className="bg-gray-900 text-white mt-1 py-2 px-4 mx-2 "
          >
            NEXT
          </button>
        </div>
      </div>

      <CustomModal
        open={isLocationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        width={500}
        height={540}
        title="CHOOSE YOUR LOCATION"
      >
        <LocationModal
          onClose={() => setLocationModalOpen(false)}
          handleAddress={(prop) => dispatch(setAddress(prop))}
        />
      </CustomModal>

      <CarBrandsModal
        isOpen={isCarModalOpen}
        onClose={() => setCarModalOpen(false)}
        refetch={refetch}
      />
    </>
  );
};

export default CustomerDetails;

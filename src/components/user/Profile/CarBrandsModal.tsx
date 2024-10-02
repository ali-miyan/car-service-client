import React, { useState } from "react";
import {
  CarBrands,
  Audi,
  Bmw,
  Chevrolet,
  Fiat,
  Ford,
  Honda,
  Hyundai,
  Mahindra,
  Mercedes,
  Nissan,
  Skoda,
  Suzuki,
  Tata,
  Toyota,
  Volkswagen,
} from "./CarDetails";
import { validateInput } from "../../../helpers/userValidation";
import { notifyError, notifySuccess } from "../../common/Toast";
import { errMessage } from "../../../constants/errorMessage";
import { useAddCarMutation } from "../../../store/slices/userApiSlice";
import { getInitialToken } from "../../../helpers/getToken";
import { ModalPopsCustom } from "../../../schema/component";

const brandToCarsMap: any = {
  Audi,
  Bmw,
  Chevrolet,
  Fiat,
  Ford,
  Honda,
  Hyundai,
  Mahindra,
  Mercedes,
  Nissan,
  Skoda,
  Suzuki,
  Tata,
  Toyota,
  Volkswagen,
};

interface Car {
  name: string;
  link: string;
  src: string;
  imgAlt: string;
}

const CarBrandsModal: React.FC<ModalPopsCustom> = ({
  isOpen,
  onClose,
  refetch,
}) => {
  const userId = getInitialToken("userToken");
  const [addCar] = useAddCarMutation({});

  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedCars, setSelectedCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [vin, setVin] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [vinError, setVinError] = useState<string>("");
  const [colorError, setColorError] = useState<string>("");

  if (!isOpen) return null;

  const handleBrandClick = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedCars(brandToCarsMap[brand] || []);
    setSelectedCar(null);
  };

  const handleCarClick = (car: Car) => {
    setSelectedCar(car);
  };

  const handleBackClick = () => {
    if (selectedCar) {
      setSelectedCar(null);
    } else if (selectedBrand) {
      setSelectedBrand(null);
      setSelectedCars([]);
    }
  };

  const handleVinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVin(event.target.value);
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
  };

  const handleSubmit = async (src: string, name: string) => {
    const vinError = validateInput("vin", vin);
    const colorError = validateInput("color", color);

    setColorError(colorError);
    setVinError(vinError);

    if (!vinError || !colorError) {
      try {
        const res = await addCar({ userId, vin, color, src, name }).unwrap();
        console.log(res);

        if (res.success) {
          notifySuccess("Car added");
          onClose();
          if (refetch) {
            await refetch();
          }
        }
      } catch (error) {
        console.log(error);
        notifyError(errMessage);
      }
    }
  };

  return (
    <div className="fixed inset-0  flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-md shadow-md w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute text-2xl top-2 right-5 text-gray-500 hover:text-gray-700 transition-colors"
        >
          &times;
        </button>

        {selectedCar ? (
          <div className="text-center">
            <button
              onClick={handleBackClick}
              className="mb-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              &larr; Back
            </button>
            <h2 className="text-lg font-semibold mb-4">{selectedCar.name}</h2>
            <img
              src={selectedCar.src}
              alt={selectedCar.imgAlt}
              className="h-32 w-auto object-cover mx-auto mb-4"
            />
            <div className="w-full flex justify-center">
              <div>
                <label
                  htmlFor="vin"
                  className="block text-xs text-start uppercase font-small text-black "
                >
                  License Plate Number
                </label>
                <input
                  id="vin"
                  type="text"
                  value={vin}
                  onChange={handleVinChange}
                  placeholder="Enter License Plate Number"
                  className="border border-gray-300 lowercase mb-2 py-1 px-2 w-full"
                />
                {vinError && <p className="text-xs text-red-500">{vinError}</p>}

                <label
                  htmlFor="color"
                  className="block text-xs text-start uppercase font-small text-black "
                >
                  Car Color
                </label>
                <input
                  id="color"
                  type="text"
                  value={color}
                  onChange={handleColorChange}
                  placeholder="Enter your car Color"
                  className="border border-gray-300 lowercase py-1 px-2 w-full"
                />
                {colorError && (
                  <p className="text-xs text-red-500">{colorError}</p>
                )}

                <button
                  onClick={() =>
                    handleSubmit(selectedCar.src, selectedCar.name)
                  }
                  className="bg-red-900 text-white p-2 mt-4 rounded hover:bg-red-900 transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        ) : selectedBrand ? (
          <div className="text-center">
            <button
              onClick={handleBackClick}
              className="mb-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              &larr; Back
            </button>
            <h2 className="text-lg font-semibold mb-4">
              Cars from {selectedBrand}
            </h2>
            <div className="grid grid-cols-3 gap-6 max-h-[50vh] overflow-x-hidden overflow-y-auto">
              {selectedCars.map((car) => (
                <a
                  key={car.name}
                  onClick={() => handleCarClick(car)}
                  className="flex flex-col items-center text-center transition-transform duration-300 transform cursor-pointer hover:scale-110"
                >
                  <img
                    src={car.src}
                    alt={car.imgAlt}
                    className="h-16 w-auto object-cover"
                  />
                  <span className="text-sm">{car.name}</span>
                </a>
              ))}
            </div>
            <p>{selectedCars.length === 0 && "No cars available"}</p>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold mb-4 text-center">
              Select Manufacturer
            </h2>
            <div className="grid grid-cols-3 gap-6 max-h-[50vh] overflow-x-hidden overflow-y-auto">
              {CarBrands.map((brand) => (
                <a
                  key={brand.name}
                  onClick={() => handleBrandClick(brand.name)}
                  className="flex flex-col items-center text-center transition-transform duration-300 transform cursor-pointer hover:scale-110"
                >
                  <img
                    src={brand.src}
                    alt={brand.imgAlt}
                    className="h-16 w-16 object-cover"
                  />
                  <span className="text-sm">{brand.name}</span>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CarBrandsModal;

import { useState } from "react";
import CarBrandsModal from "./CarBrandsModal";
import {
  useDeleteCarMutation,
  useGetCarByIdQuery,
} from "../../../store/slices/userApiSlice";
import { getInitialToken } from "../../../helpers/getToken";
import DeleteConfirmationModal from "../../common/ConfirmationModal";
import { AiFillDelete } from "react-icons/ai";
import { notifyError, notifySuccess } from "../../common/Toast";
import { errMessage } from "../../../constants/errorMessage";

const UserCar = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = getInitialToken("userToken");
  const { data: posts, refetch } = useGetCarByIdQuery(token as string);
  const [deleteCar] = useDeleteCarMutation();

  const handleAddCarClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteCar(id).unwrap();

      if (res.success) {
        notifySuccess("Deleted successfully");
        await refetch();
      } else {
        notifyError(errMessage);
      }
    } catch (error) {
      notifyError(errMessage);
      console.error("Failed to delete the service:", error);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 p-6 md:p-12">
      <h1 className="text-2xl font-bold mb-4">MY CARS</h1>

      <div className="flex flex-wrap justify-center w-full max-w-6xl">
        {posts?.car && posts.car.length > 0 ? (
          posts.car.map((car: any) => (
            <div
              key={car._id}
              className="bg-white p-4 shadow-md mx-3 text-sm uppercase mb-4 rounded-md w-60"
            >
              <DeleteConfirmationModal
                body="Are you sure you want to delete this item?"
                onConfirm={() => {
                  handleDelete(car._id);
                }}
              >
                <button className="bg-red-900 hover:bg-red-800 text-white p-1 rounded">
                  <AiFillDelete />
                </button>
              </DeleteConfirmationModal>
              <div className="flex justify-center mb-2">
                <img
                  src={car.src}
                  alt={car.name}
                  className="object-cover w-auto"
                />
              </div>
              <h2 className="text-sm font-semibold ">
                <strong>brand:</strong>
                {car.name}
              </h2>
              <p className="text-gray-700 ">
                <strong>Color:</strong> {car.color}
              </p>
              <p className="text-gray-700 ">
                <strong>NUMBER:</strong> {car.vin}
              </p>
            </div>
          ))
        ) : (
          <p>No cars available</p>
        )}
      </div>

      <button
        onClick={handleAddCarClick}
        className="bg-gray-900 text-white py-2 px-4 rounded flex items-center space-x-2 mt-6"
      >
        <span>ADD CAR</span>
      </button>

      <CarBrandsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        refetch={refetch}
      />
    </div>
  );
};

export default UserCar;

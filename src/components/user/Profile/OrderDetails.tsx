import React, { useEffect, useState } from "react";
import { FaTruck, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetSingleOrderQuery,
} from "../../../store/slices/orderApiSlice";
import { statusMessages } from "../../../schema/component";
import OrderDetailSkeleton from "../../../layouts/skelotons/OrderDetailSkeleton";
import { useBookingSocket } from "../../../service/socketService";
import ReviewModal from "./ReviewModal";
import CancelBookingModal from "./CancelBookingModal";

const OrderDetail: React.FC = () => {

  const { id } = useParams<{ id: string }>();

  const {data: order,isLoading,refetch,} = useGetSingleOrderQuery(id as string);

  console.log(order,'ordersrer');
  

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);

  const socket = useBookingSocket(id as string);

  useEffect(() => {
    if (socket) {
      socket.on("order_updated", async (message: any) => {
        console.log(message);
        await refetch();
      });
    }

    return () => {
      if (socket) {
        socket.off("order_updated");
      }
    };
  }, [socket]);

  const navigate = useNavigate();

  if (!order || isLoading) return <OrderDetailSkeleton />;

  const handleTrackCar = () => {
    navigate(`/live-track/${order.data.id}`, {
      state: { company: order?.data.serviceInfo.company, user: order?.data.address },
    });
  };

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  return (
    <>
      <div className="mx-32 mt-20 lowercase">
        <div className="flex w-full justify-between items-center">
          <div>
            <button
              className="flex pr-5 items-center lowercase mb-3 p-2 bg-gray-100 hover:bg-gray-200 text-black font-semibold font-bai-bold rounded-lg shadow-md "
              onClick={() => window.history.back()}
            >
              <svg
                className="w-4 h-4 mr-2 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
              Go Back
            </button>
            <h1 className="text-2xl font-bold mb-2 uppercase font-bai-bold">
              Order Detail
            </h1>
            <p className="text-gray-600 mb-6 uppercase">
              Order ID: {order?.data.id}
            </p>
          </div>
          <div className="ml-auto uppercase p-3 text-center border">
            <span className="text-sm lowercase block max-w-96 overflow-hidden break-words">
              <span className="font-bai-bold uppercase ">
                Status: {order?.data.status}
              </span>
              <br /> {statusMessages[order?.data.status]}
            </span>
            {order?.data.status === "Driver En Route" ||
            order?.data.status === "Car En Route Back" ? (
              <div className="mt-4 text-center">
                <button
                  onClick={handleTrackCar}
                  className="bg-[#ab0000] text-white lowercase text-sm px-4 py-2 hover:bg-red-900"
                >
                  Track Your Car
                </button>
              </div>
            ) : null}
            {order?.data.status === "Booking Completed" ? (
              <div className="mt-4 text-center">
                <button
                  onClick={handleButtonClick}
                  className="px-5 py-2 my-4 bg-[#ab0000] text-white transform hover:scale-95 transition duration-100 mx-auto flex"
                >
                  write a review
                </button>
                <ReviewModal
                  isOpen={isModalOpen}
                  onClose={handleCloseModal}
                  datas={order?.data.serviceId}
                />
              </div>
            ) : null}
            {order?.data.status === "Booking Pending" ||
            order?.data.status === "Booking Confirmed" ? (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="px-5 py-2 my-4 bg-[#ab0000] text-white transform hover:scale-95 transition duration-100 mx-auto flex"
                >
                  cancel your booking
                </button>
              </div>
            ) : null}
            {showCancelModal && (
              <CancelBookingModal
                orderId = {order?.data?.id}
                refetch={refetch}
                setShowCancelModal={setShowCancelModal}

              />
            )}
          </div>
          <p className="mt-2 text-sm text-gray-600"></p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border-2 p-8 mb-8">
          <div className="flex flex-col items-center text-center">
            <div className="p-1">
              <img src={order?.data?.serviceInfo?.company?.image} className="w-20" alt="logo" />
            </div>
            <div>
              <h2 className="font-semibold font-bai-bold text-lg mb-2">
                company details
              </h2>
              <p className="mb-1">Name: {order?.data?.serviceInfo?.company?.name}</p>
              <p className="mb-1">contact 1: {order?.data?.serviceInfo?.company?.contact1}</p>
              <p className="mb-1">contact 2: {order?.data?.serviceInfo?.company?.contact2}</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-red-50 p-4 rounded-full mb-4">
              <FaTruck className="text-red-900 text-3xl" />
            </div>
            <div>
              <h2 className="font-semibold font-bai-bold text-lg mb-2">
                Order Info
              </h2>
              <p className="mb-1">Total Amount: ₹{order?.data.totalPrice}</p>
              <p className="mb-1">Payment: {order?.data.payment}</p>
              <p className="mb-1">Scheduled on: {order?.data.date}</p>
              <p className="mb-1">Service at: {order?.data.servicePlace}</p>
            </div>
          </div>
          {order?.data.servicePlace === "home" && (
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-50 p-4 rounded-full mb-4">
                <FaMapMarkerAlt className="text-red-900 text-3xl" />
              </div>
              <div>
                <h2 className="font-semibold font-bai-bold text-lg mb-2">
                  User's Home
                </h2>
                <p className="mb-1">City: {order?.data.address.city}</p>
                <p className="mb-1">Address: {order?.data.address.address}</p>
                <p className="mb-1">
                  Street: {order?.data.address.streetRegion}
                </p>
                <p className="mb-1">Pincode: {order?.data.address.postcode}</p>
              </div>
            </div>
          )}
        </div>
        <div className="overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="font-bai-bold text-center text-gray-900 uppercase mb-4">
              Service Package and Car Type
            </h3>
            <div className="flex space-x-4">
              <div className="flex-1 border border-slate-200 bg-white rounded-lg shadow-sm divide-y divide-slate-200">
                <div className="p-6">
                  <h2 className="text-xl leading-6 font-bai-bold text-slate-900 uppercase">
                    ₹{order?.data?.serviceInfo?.package?.detail?.price}
                    <span className="text-base font-medium text-slate-500">
                      /service
                    </span>
                  </h2>
                  <p className="mt-4 text-gray-500">
                    - takes {order?.data?.serviceInfo?.package?.detail?.workingHours} hours
                  </p>
                </div>
                <div className="pt-6 pb-8 px-6">
                  <h3 className="text-sm font-bold text-slate-900 tracking-wide uppercase">
                    What's included
                  </h3>
                  <ul role="list" className="mt-4 space-y-3">
                    {order?.data?.serviceInfo.package.subServices?.map((val:any, index:number) => (
                      <li className="flex items-center space-x-3" key={index}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="flex-shrink-0 h-5 w-5 text-green-400"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M5 12l5 5l10 -10" />
                        </svg>
                        <span className="text-sm text-slate-700">
                          {val.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {order?.data && (
                <div className="flex-1 bg-white text-center  border border-slate-200 rounded-lg shadow-sm">
                  <div className="p-6">
                    <h2 className="text-xl font-bai-bold text-slate-900 mb-4">
                      Car Detail
                    </h2>
                    <img
                      src={order?.src}
                      alt="car"
                      className="w-22 h-22 object-cover mb-4 mx-auto rounded-md"
                    />
                    <div className="space-y-2 uppercase tex">
                      <p className="text-sm text-gray-600">
                        Name: {order?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Color: {order?.color}
                      </p>
                      <p className="text-sm text-gray-600">VIN: {order?.vin}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetail;

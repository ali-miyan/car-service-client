import React, { useState, useCallback, memo, useEffect } from "react";
import { FaTruck, FaMapMarkerAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";
import {
  useGetSingleOrderQuery,
  useUpdateDriverLocationMutation,
  useUpdateStatusMutation,
} from "../../store/slices/orderApiSlice";
import { notifySuccess } from "../common/Toast";
import OrderDetailSkeleton from "../../layouts/skelotons/OrderDetailSkeleton";
import PaymentModal from "./paymentModal";

const Dropdown = memo(({ visible, onSelect, servicePlace }:any) => {
  if (!visible) return null;

  const statuses =
    servicePlace === "home"
      ? [
          "Driver Assigned",
          "Driver En Route",
          "Car Picked Up",
          "Car Arrived at Service Center",
          "Service In Progress",
          "Service Completed",
          "Car En Route Back",
          "Car Delivered",
          "Booking Completed",
        ]
      : [
          "Car Arrived at Service Center",
          "Service In Progress",
          "Service Completed",
          "Ready for Pickup",
          "Booking Completed",
        ];

  return (
    <div className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow min-w-64 mt-2">
      <ul className="py-2 text-sm text-gray-700">
        {statuses.map((status) => (
          <li key={status}>
            <button
              type="button"
              className="inline-flex w-full px-4 py-2 hover:bg-gray-100"
              onClick={() => onSelect(status)}
            >
              {status}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
});

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [updateStatus] = useUpdateStatusMutation({});
  const [updateDriverLocation] = useUpdateDriverLocationMutation({});
  const {
    data: order,
    refetch,
    isLoading,
  } = useGetSingleOrderQuery(id as string);

  console.log("the damn order", order);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = useCallback(() => {
    setDropdownVisible((prev) => !prev);
  }, []);

  useEffect(() => {
    let watchId: number | undefined;

    if (
      order?.data.status === "Driver En Route" ||
      order?.data.status === "Car En Route Back"
    ) {
      if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            try {
              await updateDriverLocation({
                orderId: order.data.id,
                latitude,
                longitude,
              }).unwrap();
            } catch (error) {
              console.error("Error updating driver location:", error);
            }
          },
          (error) => {
            console.error("Error getting location:", error);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000,
          }
        );
      }
    }

    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [order?.data.status, refetch, updateDriverLocation]);

  const handleStatusSelect = async (status: string) => {
    try {
      const res = await updateStatus({
        status,
        orderId: order.data.id,
      }).unwrap();
      if (res.success) {
        console.log(res);
        notifySuccess("successfully updated");
        refetch();
      }
    } catch (error) {
      console.log(error);
    }

    setDropdownVisible(false);
  };

  if (!order || isLoading) return <OrderDetailSkeleton />;

  return (
    <div className="mx-32 my-20 lowercase">
      <div className="flex w-full justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2 uppercase font-bai-bold">
            Order Detail
          </h1>
          <p className="text-gray-600 mb-6 uppercase">
            Order ID: {order?.data.id}
          </p>
        </div>
        <div className="relative flex items-start">
          <p className="mx-4 uppercase p-3 bg-yellow-300 border">
            <span className="text-sm">
              STATUS: <strong> {order?.data.status}</strong>
            </span>
          </p>
          <div className="relative">
            {order?.data.status === "Booking Cancelled" ? (
              order?.data.payment === "online" ||
              (order?.data.payment === "wallet" &&
                (order?.data.refundStatus === "completed" ? (
                  <div className="p-3  uppercase border border-black font-bai-medium mx-auto flex">
                    refund completed
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="p-3 shadow-md shadow-black uppercase bg-[#ab0000] text-white transform hover:scale-95 transition duration-100 mx-auto flex"
                    >
                      pay ₹{order?.data?.totalPrice} now
                    </button>
                    {isModalOpen && (
                      <PaymentModal
                        setIsModalOpen={setIsModalOpen}
                        refundAmount={order?.data?.totalPrice}
                        userId={order?.userId?._id}
                        orderId={order?.data?.id}
                      />
                    )}
                  </>
                )))
            ) : order?.data.status === "Booking Completed" ? null : (
              <>
                <button
                  id="status-button"
                  onClick={toggleDropdown}
                  className="flex-shrink-0 min-w-64 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border"
                  type="button"
                >
                  Change Status
                  <svg
                    aria-hidden="true"
                    className="w-4 h-7 ml-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
                <Dropdown
                  visible={dropdownVisible}
                  onSelect={handleStatusSelect}
                  servicePlace={order?.data.servicePlace}
                />
              </>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border-2 p-8 mb-8">
        <div className="flex flex-col items-center text-center">
          <div className=" rounded-full mb-4">
            <img
              src={order?.userId.profileImg}
              alt=""
              className="rounded-full w-20"
            />
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-2">Customer</h2>
            <p className="mb-1">Name: {order?.userId.username}</p>
            <p className="mb-1">Email: {order?.userId.email}</p>
            <p className="mb-1">Phone: {order?.userId.phone}</p>
          </div>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="bg-red-50 p-4 rounded-full mb-4">
            <FaTruck className="text-red-900 text-3xl" />
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-2">Order Info</h2>
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
              <h2 className="font-semibold text-lg mb-2">User's Home</h2>
              <p className="mb-1">City: {order?.data.address.city}</p>
              <p className="mb-1">Address: {order?.data.address.address}</p>
              <p className="mb-1">Street: {order?.data.address.streetRegion}</p>
              <p className="mb-1">Pincode: {order?.data.address.postcode}</p>
            </div>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-semibold text-center text-gray-900 uppercase mb-4">
            Service Package and Car Type
          </h3>
          <div className="flex space-x-4">
            <div className="flex-1 border border-slate-200 bg-white rounded-lg shadow-sm divide-y divide-slate-200">
              <div className="p-6">
                <h2 className="text-xl leading-6 font-bold text-slate-900 uppercase">
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
                  {order?.data?.serviceInfo?.package?.subServices?.map((val:any, index:number) => (
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
                      <span className="text-sm text-slate-700">{val.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {order?.data && (
              <div className="flex-1 bg-white text-center  border border-slate-200 rounded-lg shadow-sm">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">
                    Car Detail
                  </h2>
                  <img
                    src={order?.src}
                    alt="car"
                    className="w-22 h-22 object-cover mb-4 mx-auto rounded-md"
                  />
                  <div className="space-y-2 uppercase tex">
                    <p className="text-sm text-gray-600">Name: {order?.name}</p>
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
  );
};

export default OrderDetail;

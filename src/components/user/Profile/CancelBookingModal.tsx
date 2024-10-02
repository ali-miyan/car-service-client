import { useState } from "react";
import { useCancelBookingMutation } from "../../../store/slices/orderApiSlice";
import { notifySuccess } from "../../common/Toast";
import LoadingButton from "../../common/Loading";

const CancelBookingModal = ({ orderId, refetch, setShowCancelModal }:any) => {
  const [cancelBooking, { isLoading }] = useCancelBookingMutation();

  
  
  const [cancelReason, setCancelReason] = useState<string>("");
  const [error, setError] = useState<string>("");
  
  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      setError("Please provide a reason for cancellation.");
      return;
    }
    console.log(orderId,'sd',cancelReason);
    try {
      const res = await cancelBooking({
        orderId,
        reason:cancelReason,
      }).unwrap();
      console.log(res);

      if (res.success) {
        refetch();
        notifySuccess("booking cancelled");
        setCancelReason("");
        setError("");
        setShowCancelModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 font-bai-regular bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6  shadow-lg max-w-sm w-full">
        <h2 className="text-xl text-center font-bai-bold  mb-4 text-gray-800">
          Cancel Reason
        </h2>
        <textarea
          className="w-full border border-gray-600 p-2 outline-none"
          rows={4}
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          placeholder="Write your reason here..."
        ></textarea>
        {error && (
          <p className="text-red-500 font-bai-regular lowercase text-xs">
            {error}
          </p>
        )}
        <div className="flex justify-between mt-2">
          <button
            className="px-4 py-2 bg-gray-900 text-white  hover:bg-gray-800 transition duration-200"
            onClick={() => setShowCancelModal(false)}
          >
            Close
          </button>
          <LoadingButton
            buttonText="Submit"
            height="py-2"
            isLoading={isLoading}
            width="px-4"
            onClick={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;

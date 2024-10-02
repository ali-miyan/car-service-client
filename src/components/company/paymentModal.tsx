import { loadStripe } from "@stripe/stripe-js";
import { useRefundToUserMutation } from "../../store/slices/orderApiSlice";
import LoadingButton from "../common/Loading";

const RefundModal = ({
  setIsModalOpen,
  refundAmount,
  userId,
  orderId,
}: any) => {
  
  const [refundToUser, { isLoading }] = useRefundToUserMutation({});

  const handleRefund = async () => {
    const stripe = await loadStripe(import.meta.env.VITE_REACT_APP_STRIPE_TOKEN);
    const res = await refundToUser({ userId, orderId, refundAmount }).unwrap();

    stripe?.redirectToCheckout({
      sessionId: res,
    });

    if (res.success) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 font-bai-regular bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 shadow-lg max-w-sm w-full">
        <h2 className="text-xl text-center font-bai-bold mb-4 text-gray-800">
          Process Refund
        </h2>
        <p className="mb-4 text-center text-gray-600">
          You are about to refund <strong>₹{refundAmount}</strong> back to the
          users's wallet.
        </p>

        <div className="flex justify-center mt-4">
          <button
            className="px-4 py-2 mr-4 bg-gray-900 rounded text-white hover:bg-gray-800 transition duration-200"
            onClick={() => setIsModalOpen(false)}
          >
            Close
          </button>
          <LoadingButton
            buttonText="Confirm Refund"
            height="py-2"
            isLoading={isLoading}
            width="px-4"
            onClick={handleRefund}
          />
        </div>
      </div>
    </div>
  );
};

export default RefundModal;

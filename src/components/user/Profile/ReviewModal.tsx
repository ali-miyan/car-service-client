import { useState } from "react";
import { notifyError, notifySuccess } from "../../common/Toast";
import { useMakeRatingMutation } from "../../../store/slices/userApiSlice";
import { errMessage } from "../../../constants/errorMessage";
import LoadingButton from "../../common/Loading";

const StarRating = ({ rating, onRate }:any) => {
  return (
    <div className="flex mx-auto space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          className={`w-9 h-9 cursor-pointer ${
            star <= rating ? "text-yellow-600 " : "text-gray-300 "
          }`}
          fill="currentColor"
          viewBox="0 0 24 24"
          onClick={() => onRate(star)}
        >
          <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-6.36-.54L12 2 8.36 8.7 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
};

const ReviewModal = ({ isOpen, onClose, datas }:any) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [rateService, { isLoading }] = useMakeRatingMutation();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!reviewText) {
      notifyError("please provide a review");
      return;
    }
    try {
      const res = await rateService({
        rating,
        reviewText,
        serviceId: datas,
      }).unwrap();

      setReviewText("");
      setRating(0);

      if (res.success) {
        notifySuccess("review added");
        onClose();
      } else {
        notifyError(errMessage);
      }
    } catch (error) {
      console.log(error);
      notifyError(errMessage);
    }
  };

  return (
    <div className="fixed inset-0 font-bai-regular bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6  shadow-lg max-w-sm w-full">
        <h2 className="text-2xl text-center font-bai-medium  mb-4 text-gray-800">
          Write a Review
        </h2>
        <div className="flex items-center mb-4">
          <StarRating rating={rating} onRate={setRating} />
        </div>
        <textarea
          className="w-full border border-gray-300 p-2 outline-none mb-4"
          rows={4}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review here..."
        ></textarea>
        <div className="flex justify-between">
          <button
            className="px-4 py-2 bg-gray-900 text-white  hover:bg-gray-800 transition duration-200"
            onClick={onClose}
          >
            Close
          </button>
          <LoadingButton
            buttonText="Submit"
            height="py-2"
            isLoading={isLoading}
            width="px-4"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;

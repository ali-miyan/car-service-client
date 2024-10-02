import { useState } from "react";
import {useGetCompanyByIdQuery,useUpdateCompanyMutation,} from "../../store/slices/companyApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { Post } from "../../schema/component";
import LoadingButton from "../common/Loading";
import { notifyError } from "../common/Toast";
import { errMessage } from "../../constants/errorMessage";
import Loader from "../common/Loader";

const ServiceInfo = () => {

  const { id } = useParams<{ id: string }>();
  const {data: posts,isLoading,} = useGetCompanyByIdQuery(id as string);
  const [updateCompany] = useUpdateCompanyMutation();
  
  const navigate = useNavigate();
  
  const companyDetails: Post = posts;
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAcceptLoading, setIsAcceptLoading] = useState<boolean>(false);
  const [isRejectLoading, setIsRejectLoading] = useState<boolean>(false);

  const openModal = (image: string) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleApproval = async (id: string, status: string) => {
    try {

      if (status === "accepted") {
        setIsAcceptLoading(true);
      } else if (status === "declined") {
        setIsRejectLoading(true);
      }

      const res = await updateCompany({ id, isApproved: status }).unwrap();

      if (res.success) {
        navigate("/admin/notification", { state: { refetch: true } });
      }

    } catch (error) {
      console.error("Failed to update company status:", error);
      notifyError(errMessage);
    } finally {
      setIsAcceptLoading(false);
      setIsRejectLoading(false);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div
      style={{ height: "100%" }}
      className="container lowercase mx-auto p-4 min-h-screen"
    >
      <h1 className="text-center p-3 border-b-4 mx-auto max-w-xs uppercase mb-6">
        Service Info
      </h1>
      <li className="flex justify-center">
        <img
          src={companyDetails?.logo}
          alt="Company Logo"
          className="w-20 h-20 object-cover  rounded-full cursor-pointer hover:brightness-50"
        />
      </li>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white  shadow-md text-pretty p-6 rounded-lg">
          <div>
            <h2 className="text-lg font-semibold mb-4 text-center">
              Company Details
            </h2>
            <ul className="list-none space-y-2">
              <li>
                <strong>Company Name:</strong> {companyDetails?.companyName}
              </li>
              <li>
                <strong>Owner Name:</strong> {companyDetails?.ownerName}
              </li>
              <li>
                <strong>Year:</strong> {companyDetails?.year}
              </li>
              <li>
                <strong>License Number:</strong> {companyDetails?.licenseNumber}
              </li>
              <li>
                <strong>License Expiry:</strong> {companyDetails?.licenseExpiry}
              </li>
              <li>
                <strong>Email:</strong> {companyDetails?.email}
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-center">
            Contact and Location
          </h2>
          <ul className="list-none space-y-2">
            <li>
              <strong>Contact 1:</strong> {companyDetails?.contact1}
            </li>
            <li>
              <strong>Contact 2:</strong> {companyDetails?.contact2}
            </li>
            <li>
              <strong>Address:</strong> {companyDetails?.address.address}
            </li>
            <li>
              <strong>Pin Code:</strong> {companyDetails?.address.postcode}
            </li>
            <li>
              <strong>Street:</strong> {companyDetails?.address.streetRegion}
            </li>
            <li>
              <strong>City:</strong> {companyDetails?.address.city}
            </li>
            <li>
              <strong>Country:</strong> {companyDetails?.address.country}
            </li>
          </ul>
        </div>
      </div>

      <h2 className="text-center text-xl font-bold uppercase my-6">
        Licensing Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="flex justify-center">
          <img
            src={companyDetails?.licenseImg}
            alt="Company License"
            className="w-full h-52 object-cover md:w-2/4 rounded-lg cursor-pointer hover:brightness-50"
            onClick={() => openModal(companyDetails?.licenseImg)}
          />
        </div>
        <div className="flex justify-center">
          <img
            src={companyDetails?.approvedImg}
            alt="Government Approved Certificate"
            className="w-full h-52 object-cover md:w-2/4 rounded-lg cursor-pointer hover:brightness-50"
            onClick={() => openModal(companyDetails?.approvedImg)}
          />
        </div>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="relative">
            <img
              src={selectedImage}
              alt="Fullscreen"
              className="w-auto h-screen object-contain"
            />
            <button
              className="absolute top-0 right-0 m-4 text-black text-4xl font-bold"
              onClick={closeModal}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-center mt-20 space-x-4 pb-24">
        {companyDetails?.isApproved === "pending" ? (
          <>
            <LoadingButton
              buttonText="Reject"
              isLoading={isRejectLoading}
              onClick={() => handleApproval(companyDetails._id, "declined")}
              color="bg-red-800"
              width="w-2/12"
              height="h-10"
            />
            <LoadingButton
              buttonText="Accept"
              isLoading={isAcceptLoading}
              color="bg-black"
              onClick={() => handleApproval(companyDetails._id, "accepted")}
              width="w-2/12"
              height="h-10"
            />
          </>
        ) : (
          <div className="text-center text-lg font-bold">
            This company has already been {companyDetails?.isApproved}.
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceInfo;

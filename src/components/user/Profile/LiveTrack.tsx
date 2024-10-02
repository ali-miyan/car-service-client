import MapboxMap from "./LiveMap";
import { useGetLiveLocationQuery } from "../../../store/slices/orderApiSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import OrderDetailSkeleton from "../../../layouts/skelotons/OrderDetailSkeleton";

const LiveTrack = () => {
  
  const { id } = useParams();
  const location = useLocation();
  const company = location.state?.company;
  const user = location.state?.user;

  const navigate = useNavigate();

  const { data, isLoading } = useGetLiveLocationQuery(id as string);

  if (!data || isLoading) return <OrderDetailSkeleton />;

  return (
    <div className="w-full h-screen font-bai-bold">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-40 mt-1 z-50 left-4 bg-gray-200 text-red-900 px-4 py-2 shadow-md hover:bg-gray-100"
      >
        Back
      </button>

      <div className="absolute top-36 z-40 left-1/2 transform -translate-x-1/2 mt-4 text-center w-full">
        <h1 className="text-2xl font-bold text-white bg-black bg-opacity-70 p-2">
          Live Car Location
        </h1>
      </div>
      <MapboxMap
        liveLongitude={data?.liveLocation.longitude}
        liveLatittude={data?.liveLocation.latitude}
        userDetails={user}
        companyDetails={company}
      />
    </div>
  );
};

export default LiveTrack;

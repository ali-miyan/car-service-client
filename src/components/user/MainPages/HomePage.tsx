import { Link } from "react-router-dom";
import { useGetServiceQuery } from "../../../store/slices/adminApiSlice";
import Features from "./Features";
import VehicleService from "./Slider";
import Loader from "../../common/Loader";

const HomePage = () => {
  
  const { data: services, isLoading } = useGetServiceQuery(undefined);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="flex flex-col font-bai-regular items-center justify-center min-h-screen">
            <div className="w-full">
              <img
                src="/assets/item-1.jpg"
                alt="Banner"
                className="w-full  object-cover md:mt-20"
              />
            </div>

            <VehicleService />
            <Features />

            <div className="p-4 w-10/12">
              <div className="mx-auto px-4 py-8 max-w-7xl">
                <h2 className="text-xl underline underline-offset-4 pb-4 uppercase font-bai-bold text-center mb-8">
                  SERVICES WE PROVIDE
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {services &&
                    services.map((service:any, index:number) => (
                      <Link key={index} to={`/services?service=${service._id}`}>
                        <div
                          key={index}
                          className="group mx-2 bg-white py-5 rounded-lg shadow-lg hover:shadow-xl cursor-pointer  transition-all hover:rounded-3xl duration-300  flex flex-col items-center"
                        >
                          <div className="flex justify-center mb-4">
                            <img
                              src={service.logoUrl}
                              alt={service.serviceName}
                              className="h-24 object-cover rounded-md transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                            />
                          </div>
                          <h3 className="text-xs uppercase font-bai-bold text-center text-gray-800">
                            {service.serviceName}
                          </h3>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default HomePage;

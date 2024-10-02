import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useGetApprovedCompanyQuery } from "../../../store/slices/companyApiSlice";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import Loader from "../../common/Loader";

const CustomNextArrow = ({ onClick }: { onClick?: any }) => (
  <button
    onClick={onClick}
    className="absolute top-1/2 -right-4 transform -translate-y-1/2  text-black p-2 z-10 hidden md:flex items-center justify-center hover:border transition-all"
  >
    <FaArrowRight size={10} />
  </button>
);

const CustomPrevArrow = ({ onClick }: { onClick?: any }) => (
  <button
    onClick={onClick}
    className="absolute top-1/2 -left-4 transform -translate-y-1/2  text-black p-2 z-10 hidden md:flex items-center justify-center hover:border transition-all"
  >
    <FaArrowLeft size={10} />
  </button>
);

const VehicleService = () => {
  const { data: servicesData, isLoading } = useGetApprovedCompanyQuery({});

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          arrows: false,
        },
      },
    ],
  };

  if (isLoading) {
    return <div><Loader /></div>;
  }

  if (!servicesData || servicesData.length === 0) {
    return <div>No services available</div>;
  }

  return (
    <div className="px-4  max-w-full lg:px-8 font-bai-regular py-16 text-center">
      <div className="text-sm text-gray-500 mb-2">------ Companies</div>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
        Get More <span className="text-red-900">Mileage</span> Out Of Your
        Vehicle
      </h1>
      <p className="text-gray-600 mb-8 sm:mb-10 max-w-3xl mx-auto text-sm sm:text-base">
        From routine oil changes and brake services to more complex engine
        repairs, we are equipped to handle it all. We use only high-quality
        parts and equipment to ensure your vehicle performs at its best. Our
        team is experienced in working with all makes and models.
      </p>
      <div className="mb-6 px-4 sm:px-8 lg:px-5">
        <Slider {...settings}>
          {servicesData.map((brand:any, index:number) => (
            <Link to={`/services?company=${brand._id}`} key={index}>
              <div className="group p-3  bg-gray-100 cursor-pointer rounded-sm transition-all hover:rounded-3xl duration-300 mx-7 py-1">
                <div className="lg:h-52 mx-auto flex items-center justify-center">
                  <img
                    src={brand.logo}
                    alt={brand.companyName}
                    className="w-32 object-contain transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  />
                </div>
              </div>
            </Link>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default VehicleService;

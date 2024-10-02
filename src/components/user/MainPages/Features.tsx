import {
  FaCar,
  FaUsers,
  FaHandSparkles,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import { MdConstruction } from "react-icons/md";

const Features = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        The future of <span className="text-red-900">car service </span>
        and maintenance
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="w-full md:w-1/3 space-y-8">
          <Feature
            icon={<FaCar />}
            title="Vehicle Check-In"
            description="Bring your car and choose the service type. Relax in our comfortable waiting area or use our shuttle service."
          />
          <Feature
            icon={<FaUsers />}
            title="Expert Technicians"
            description="Our certified technicians are trained to handle all makes and models. We ensure at least two specialists per vehicle."
          />
          <Feature
            icon={<MdConstruction />}
            title="Advanced Equipment"
            description="We use state-of-the-art diagnostic tools and equipment to provide accurate and efficient service."
          />
        </div>

        <div className="w-full md:w-1/3 my-8 md:my-0">
          <img
            src="/assets/white-midsize-city-suv-family-white-background.png"
            alt="Car top view"
            className="w-full h-auto"
          />
        </div>

        <div className="w-full md:w-1/3 space-y-8">
          <Feature
            icon={<FaHandSparkles />}
            title="Service Initiated"
            description="Our team begins the requested service promptly. We keep you informed about the progress throughout the process."
          />
          <Feature
            icon={<FaClock />}
            title="Efficient Turnaround"
            description="We strive for quick service without compromising quality. Most routine services are completed within 1-2 hours."
          />
          <Feature
            icon={<FaCheckCircle />}
            title="Quality Assurance"
            description="Every service concludes with a thorough quality check to ensure your vehicle is in optimal condition."
          />
        </div>
      </div>
    </div>
  );
};

const Feature = ({ icon, title, description }:any) => {
  return (
    <div className="flex items-start">
      <div className="bg-[#ab0000] text-white rounded-full p-5 mr-4">
        <span className="text-2xl">{icon}</span>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default Features;

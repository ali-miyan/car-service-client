import { Link } from "react-router-dom";

const ForBusiness = () => {
  return (
    <div className="bg-gray-100 lowercase font-bai-regular relative">
      <div className="relative">
        <img
          src="/assets/hero_bg_3_1.png"
          alt="Car"
          className="w-full object-cover brightness-50"
        />
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="text-center">
            <h1 className="lg:text-3xl font-bold font-bai-bold uppercase text-white">
              Welcome to Car Service for Businesses
            </h1>
            <Link to={"/company/login"}>
              <button className="bg-[#ab0000] hover:bg-red-900 text-white font-bold py-2 px-10 rounded mt-4">
                JOIN
              </button>
            </Link>
          </div>
        </div>
      </div>

      <section className="bg-white ">
        <div className="gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
          <div className="font-light text-gray-500 sm:text-lg">
            <h2 className="mb-4 text-2xl tracking-tight uppercase font-bai-medium text-gray-900 ">
              We didn't reinvent the wheel
            </h2>
            <p className="mb-4">
              We are car service experts who combine skill and experience to
              keep your vehicle in top shape. We offer a blend of innovation and
              reliability, with the agility of a small team and the capability
              to handle the scope of any automotive needs you may have.
            </p>
            <p>
              From routine maintenance to complex repairs, our team of dedicated
              professionals is committed to delivering exceptional service with
              efficiency and precision. We're small enough to provide
              personalized attention but large enough to meet all your
              automotive needs.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <img
              className="w-full rounded-lg"
              src="/assets/erik-mclean-3uHlGFnzPDU-unsplash.jpg"
              alt="office content 1"
            />
            <img
              className="mt-4 w-full lg:mt-10 rounded-lg"
              src="/assets/markus-spiske-Ct__HLBjgJE-unsplash.jpg"
              alt="office content 2"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForBusiness;

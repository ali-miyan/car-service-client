import { Link, useParams } from "react-router-dom";
import { useGetCompanyByIdQuery } from "../../../store/slices/companyApiSlice";
import { FaEnvelope } from "react-icons/fa";

const AboutCompany = () => {

  const { id } = useParams<{ id: string }>();

  const { data: company } = useGetCompanyByIdQuery(id as string);

  return (
    <>
      {company && (
        <div className="pt-16 bg-white font-bai-regular lowercase">
          <div className="container mx-auto px-6 md:px-12 xl:px-6">
            <div className="md:flex md:gap-6 lg:gap-12">
              <div className="md:w-1/2 md:order-2 mb-6 md:mb-0">
                <h2 className="text-2xl md:text-4xl lg:text-3x font-bai-medium uppercase text-gray-900 font-bold mb-4">
                  {company.name} - About Us
                </h2>
                <p className="text-gray-600 text-sm md:text-base lg:text-lg">
                  {company.description}
                </p>
              </div>
              <div className="md:w-1/2 md:order-1 mb-6 md:mb-0 flex justify-center">
                <img
                  src={company.logo}
                  alt="Company Logo"
                  loading="lazy"
                  className="w-48 md:w-64 lg:w-80 h-auto rounded-lg"
                />
              </div>
            </div>
            <div className="relative mt-24">
              <div className="grid sm:grid-cols-3 grid-cols-2 sm:gap-8 gap-4">
                <div className="z-20 w-12 h-12 bg-gray-800 rounded-full flex justify-center items-center">
                  <img
                    src="https://tuk-cdn.s3.amazonaws.com/can-uploader/about-us-3-svg1.svg"
                    alt="flag"
                  />
                </div>

                <img
                  className="z-20"
                  src="https://tuk-cdn.s3.amazonaws.com/can-uploader/about-us-3-svg2.svg"
                  alt="note"
                />

                <img
                  className="z-20 sm:block hidden"
                  src="https://tuk-cdn.s3.amazonaws.com/can-uploader/about-us-3-svg3.svg"
                  alt="users"
                />
              </div>
              <hr className="z-10 absolute top-2/4 w-full bg-gray-200" />
            </div>
            <div className="grid sm:grid-cols-3 grid-cols-2 sm:gap-8 gap-4">
              <div>
                <p className="font-semibold lg:text-2xl text-xl lg:leading-6 leading-5 text-gray-800 dark:text-white mt-6">
                  Founded
                </p>
                <p className="font-normal text-base leading-6 text-gray-600 dark:text-gray-200 mt-6">
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                </p>
              </div>
              <div>
                <p className="font-semibold lg:text-2xl text-xl lg:leading-6 leading-5 text-gray-800 dark:text-white mt-6">
                  50M montly enrichments
                </p>
                <p className="font-normal text-base leading-6 text-gray-600 dark:text-gray-200 mt-6">
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                </p>
              </div>
              <div className="sm:block hidden">
                <p className="font-semibold lg:text-2xl text-xl lg:leading-6 leading-5 text-gray-800 dark:text-white mt-6">
                  400k User
                </p>
                <p className="font-normal text-base leading-6 text-gray-600 dark:text-gray-200 mt-6">
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                </p>
              </div>
            </div>
            <div className="sm:hidden block relative mt-8">
              <div className="grid sm:grid-cols-3 grid-cols-2 sm:gap-8 gap-4">
                <img
                  src="https://tuk-cdn.s3.amazonaws.com/can-uploader/about-us-3-svg3.svg"
                  alt="user"
                />
              </div>
              <hr className="z-10 absolute top-2/4 w-full bg-gray-200" />
            </div>
            <div className="sm:hidden grid sm:grid-cols-3 grid-cols-2 sm:gap-8 gap-4">
              <div>
                <p className="font-semibold lg:text-2xl text-xl lg:leading-6 leading-5 text-gray-800 dark:text-white mt-6">
                  400k User
                </p>
                <p className="font-normal text-base leading-6 text-gray-600 dark:text-gray-200 mt-6">
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center ">
              <div className="2xl:container 2xl:mx-auto lg:py-16 lg:px-20 md:py-12 md:px-6 py-9 px-4">
                <div className="2xl:mx-auto dark:bg-gray-900 2xl:container md:px-20 px-4 md:py-12 py-9">
                  <div className="relative rounded-md">
                    <img
                      src="/assets/chris-liverani-HUJDz6CJEaM-unsplash.jpg"
                      alt="city view"
                      className="w-full h-full rounded-md  object-center object-fill absolute sm:block hidden"
                    />
                    <img
                      src="/assets/chuttersnap-gts_Eh4g1lk-unsplash.jpg"
                      alt="city view"
                      className="w-full h-full rounded-md absolute object-center object-fill sm:hidden"
                    />
                    <div className="text-xl relative  bg-gradient-to-r from-gray-900 to-transparent w-full h-full z-40 top-0 md:p-16 p-6 flex flex-col justify-between rounded-md ">
                      <div>
                        <h1 className="md:text-5xl text-3xl font-bold md:leading-10 leading-9 text-white sm:w-auto w-64">
                          Act Before It’s Too Late!
                        </h1>
                        <p className="text-lg leading-6 text-white xl:w-7/12 lg:w-10/12 md:w-12/12  2xl:pr-12 mt-4">
                          From routine maintenance to complex repairs, our team
                          of dedicated professionals is committed to delivering
                          exceptional service with efficiency and precision.
                          We're small enough to provide personalized attention
                          but large enough to meet all your automotive needs.
                        </p>
                      </div>
                      <div className="md:mt-12 mt-20">
                        <Link to={`/services?company=${company?._id}`}>
                          <button className="text-base font-medium leading-4  bg-white sm:w-auto w-full rounded p-4 focus:outline-none hover:bg-gray-100 focus:ring-2 focus:ring-offset-2 focus:ring-white">
                            Explore More service
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl mt-10  font-bold text-gray-900 mb-4">
                      Contact Us
                    </h2>
                    <div className="flex flex-col md:flex-row items-center">
                      <FaEnvelope className="text-gray-600 text-3xl mr-4" />
                      <p className="text-gray-600 text-sm md:text-base">
                        For inquiries, please email us at{" "}
                        {`mail-to: ${company?.email}`} or dail to{" "}
                        {company?.contact1} or {company?.contact2}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AboutCompany;

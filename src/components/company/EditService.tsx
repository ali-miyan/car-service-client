import React, { useEffect, useState } from "react";
import { validateInput } from "../../helpers/userValidation";
import { serviceForm } from "../../schema/component";
import {
  useAddServiceMutation,
  useGetSinglServicesQuery,
} from "../../store/slices/companyApiSlice";
import { notifyError, notifySuccess } from "../common/Toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingButton from "../common/Loading";
import { useGetServiceQuery } from "../../store/slices/adminApiSlice";
import { FaDotCircle, FaPlus } from "react-icons/fa";
import CustomModal from "../common/Modal";
import PackageContent from "./PackageContent";
import { getInitialToken } from "../../helpers/getToken";
import { CustomError } from "../../schema/error";
import { errMessage } from "../../constants/errorMessage";

const AddYourService: React.FC = () => {
  const token = getInitialToken("companyToken");

  const { id } = useParams<{ id: string }>();

  const { data: posts } = useGetServiceQuery(undefined, {});
  const { data: curretService } = useGetSinglServicesQuery(id as string);

  const [addService, { isLoading }] = useAddServiceMutation();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [selectedSubServicesOnLoad, setSelectedSubServicesOnLoad] =
    useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedHours, setSelectedHours] = useState<string>("");
  const [servicePlace, setServicePlace] = useState<string>("");
  const [basicSubService, setBasicSubService] = useState<
    { _id: string; name: string }[]
  >([]);
  const [standardSubService, setStandardSubService] = useState<
    { _id: string; name: string }[]
  >([]);
  const [premiumSubService, setPremiumSubService] = useState<
    { _id: string; name: string }[]
  >([]);

  const [basicData, setBasicData] = useState<{
    price?: string;
    workingHours?: string;
  }>({});
  const [standardData, setStandardData] = useState<{
    price?: string;
    workingHours?: string;
  }>({});
  const [premiumData, setPremiumData] = useState<{
    price?: string;
    workingHours?: string;
  }>({});
  const [formData, setFormData] = useState<serviceForm>({
    terms: "",
    workImages: [],
    subServices: [],
    servicesPerDay: "",
  });

  const [errors, setErrors] = useState({
    selecetedHours: "",
    selectedService: "",
    terms: "",
    workImages: "",
    packageError: "",
    servicePlaceError: "",
    global: "",
    servicesPerDay: "",
  });

  useEffect(() => {
    if (curretService && posts) {
      const sub = posts?.find(
        (val:any) => val._id === curretService.generalServiceId
      );
      setSelectedSubServicesOnLoad(sub.subServices);

      setSelectedService(curretService.generalServiceId);
      setSelectedHours(curretService.selectedHours);
      setServicePlace(curretService.servicePlace);
      setFormData((prev) => ({
        ...prev,
        terms: curretService.terms,
      }));
      setFormData((prev) => ({
        ...prev,
        workImages: curretService.images,
      }));
      setFormData((prev) => ({
        ...prev,
        servicesPerDay: curretService.servicesPerDay,
      }));
      setBasicData(curretService.basicPackage.detail);
      setStandardData(curretService.standardPackage.detail);
      setPremiumData(curretService.premiumPackage.detail);

      setBasicSubService(curretService.basicPackage.subServices);
      setStandardSubService(curretService.standardPackage.subServices);
      setPremiumSubService(curretService.premiumPackage.subServices);
    }
  }, [curretService]);

  const handleSubServicesSubmit = (
    selectedSubServices: { _id: string; name: string }[],
    workingData: { price: string; workingHours: string }
  ) => {
    if (modalTitle === "basic") {
      setBasicSubService(selectedSubServices);
      setBasicData(workingData);
    } else if (modalTitle === "standard") {
      setStandardSubService(selectedSubServices);
      setStandardData(workingData);
    } else {
      setPremiumSubService(selectedSubServices);
      setPremiumData(workingData);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    const error = validateInput(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setFormData((prevData: any) => ({
        ...prevData,
        workImages: prevData.workImages ? [...files] : files,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        workImages: "",
      }));
    }
  };

  const openModal = (title: string) => {
    setShowModal(true);
    setModalTitle(title);
  };

  const handleSubmit = async () => {
    const selectedServiceError = validateInput(
      "selectedService",
      selectedService
    );
    const selecetedHoursError = validateInput("selecetedHours", selectedHours);
    const servicePlaceError = validateInput("servicePlace", servicePlace);
    const termsError = validateInput("terms", formData.terms);
    const servicesPerDayError = validateInput(
      "servicesPerDay",
      formData.servicesPerDay
    );
    const logoError =
      (formData.workImages as []).length > 0
        ? ""
        : "Please provide atleast 1 work images";
    const packageError =
      !basicSubService.length ||
      !standardSubService.length ||
      !premiumSubService.length
        ? "packages cannot be empty"
        : "";

    setErrors({
      terms: termsError,
      workImages: logoError,
      packageError: packageError,
      selecetedHours: selecetedHoursError,
      selectedService: selectedServiceError,
      servicePlaceError: servicePlaceError,
      servicesPerDay: servicesPerDayError,
      global: "",
    });

    if (
      termsError ||
      logoError ||
      packageError ||
      servicePlaceError ||
      servicesPerDayError
    ) {
      return;
    }

    const data = new FormData();
    data.append("_id", id as string);
    data.append("generalServiceId", selectedService);
    data.append("companyId", token as string);
    data.append("selectedHours", selectedHours);
    data.append("servicePlace", servicePlace);
    data.append("terms", formData.terms);
    data.append("servicesPerDay", formData.servicesPerDay as string);
    (formData.workImages as []).forEach((image: File) => {
      data.append("images", image);
    });
    data.append("basicSubService", JSON.stringify(basicSubService));
    data.append("basicSubService", JSON.stringify(basicData));
    data.append("standardSubService", JSON.stringify(standardSubService));
    data.append("standardSubService", JSON.stringify(standardData));
    data.append("premiumSubService", JSON.stringify(premiumSubService));
    data.append("premiumSubService", JSON.stringify(premiumData));

    try {
      const res = await addService(data).unwrap();
      if (res.success) {
        notifySuccess("Successfully added");
        navigate("/company/services", { state: { refetch: true } });
      }
    } catch (err) {
      const error = err as CustomError;
      if (error.status === 400 || error.status === 401) {
        setErrors((prev) => ({
          ...prev,
          global: error.data?.message,
        }));
      } else {
        notifyError(errMessage);
      }
    }
  };

  return (
    <div
      style={{ height: "100%", width: "100%" }}
      className="px-12 justify-center bg-gray-100  flex min-h-screen pt-14"
    >
      {showModal && (
        <CustomModal
          open={showModal}
          title={modalTitle}
          width={500}
          height={530}
          onClose={() => setShowModal(false)}
          children={
            <>
              <PackageContent
                subservices={selectedSubServicesOnLoad}
                onClose={() => setShowModal(false)}
                handleSubServicesSubmit={handleSubServicesSubmit}
                alreadyChecked={
                  modalTitle === "basic"
                    ? basicSubService
                    : modalTitle === "standard"
                    ? standardSubService
                    : premiumSubService
                }
                setData={
                  modalTitle === "basic"
                    ? basicData
                    : modalTitle === "standard"
                    ? standardData
                    : premiumData
                }
              />
            </>
          }
        />
      )}
      <div className="font-bai-regular  text-sm lowercase ">
        <h2 className="font-bai-bold uppercase text-center mb-5">
          EDIT YOUR SERVICE
        </h2>
        <div className="text-start w-full flex flex-col sm:flex-row">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="service-name">Service Name</label>
              <select
                name="service-name"
                className="border p-2 rounded w-full"
                id="service-name"
                value={selectedService}
                disabled
              >
                <option value="" disabled>
                  select a service
                </option>
                {posts &&
                  posts.map((post: any, index: number) => (
                    <option key={index} value={post._id}>
                      {post.serviceName}
                    </option>
                  ))}
              </select>
              {errors.selectedService && (
                <p className="text-red-500 font-bai-regular lowercase text-xs">
                  {errors.selectedService}
                </p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="services-per-day">
                Number of Services Per Day
              </label>
              <input
                onChange={handleInputChange}
                value={formData.servicesPerDay}
                type="number"
                className="border p-2 rounded w-full"
                placeholder="services per day"
                name="servicesPerDay"
              />
              {errors.servicesPerDay && (
                <p className="text-red-500 font-bai-regular lowercase text-xs">
                  {errors.servicesPerDay}
                </p>
              )}
            </div>
            <div className="form-group ">
              <label htmlFor="working-hours">service place</label>
              <select
                name="working-hours"
                className="border lowercase p-2 rounded w-full"
                id="working-hours"
                value={servicePlace}
                onChange={(e) => setServicePlace(e.target.value)}
              >
                <option value="" disabled>
                  select a place
                </option>
                <option value="home">at home</option>
                <option value="service-center">at service center</option>
                <option value="both">both</option>
              </select>
              {errors.servicePlaceError && (
                <p className="text-red-500 font-bai-regular lowercase text-xs">
                  {errors.servicePlaceError}
                </p>
              )}
            </div>
            <div className="form-group ">
              <label htmlFor="working-hours">Working Hours</label>
              <select
                name="working-hours"
                className="border lowercase p-2 rounded w-full"
                id="working-hours"
                value={selectedHours}
                onChange={(e) => setSelectedHours(e.target.value)}
              >
                <option value="" disabled>
                  select a option
                </option>
                <option value="mon-sat">Monday to Saturday</option>
                <option value="24/7">24/7</option>
              </select>
              {errors.selecetedHours && (
                <p className="text-red-500 font-bai-regular lowercase text-xs">
                  {errors.selecetedHours}
                </p>
              )}
            </div>
          </div>
          <div className="w-full sm:w-8/12 sm:pl-5 mt-4 sm:mt-0">
            <div className="h-36 border-4 mt-7 relative">
              <input
                type="file"
                multiple
                name="workImages"
                onChange={handleImage}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              />
              {formData.workImages && (formData.workImages as []).length > 0 ? (
                <div className="flex flex-wrap">
                  {(formData.workImages as []).map(
                    (image: any, index: number) => (
                      <img
                        key={index}
                        src={
                          typeof image === "string"
                            ? image
                            : URL.createObjectURL(image)
                        }
                        alt={`Work Image ${index + 1}`}
                        className="w-16 h-16 mt-8 object-cover m-2 rounded"
                      />
                    )
                  )}
                </div>
              ) : (
                <span className="w-full h-full flex items-center justify-center text-center rounded cursor-pointer">
                  ADD YOUR WORK PHOTOS
                </span>
              )}
              {errors.workImages && (
                <p className="text-red-500 text-center mt-1 font-bai-regular lowercase text-xs">
                  {errors.workImages}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="terms">Terms</label>
          <input
            onChange={handleInputChange}
            value={formData.terms}
            type="text"
            className="border p-2 rounded w-full"
            placeholder="Type here"
            name="terms"
          />
          {errors.terms && (
            <p className="text-red-500 font-bai-regular lowercase text-xs">
              {errors.terms}
            </p>
          )}
        </div>

        <div className="form-group mt-5">
          <h3 className="font-bai-bold uppercase text-center mb-2">
            ADD PACKAGES
          </h3>
          {errors.packageError && (
            <p className="text-red-500 font-bai-regular text-center lowercase text-xs">
              {errors.packageError}
            </p>
          )}
          <section>
            <div className="py-2 px-4 mx-auto max-w-screen-xl lg:py-5 lg:px-6">
              <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
                <div className="flex flex-col p-6 mx-auto max-w-lg text-center items-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow xl:p-8">
                  <h3 className="font-bai-semi-bold uppercase underline-offset-2 underline">
                    BASIC PLAN
                  </h3>
                  <p className="font-light text-gray-500">
                    add your basic plan here.
                  </p>
                  <div className="mb-4">
                    <div className="flex justify-center pt-3  items-baseline m">
                      <span className="text-3xl font-extrabold">
                        ${basicData.price || "0"}
                      </span>
                      <span className="text-gray-500">/service</span>
                    </div>
                    <div className="text-center">
                      <span className="text-sm text-gray-500">
                        takes {basicData.workingHours || "0"} hours
                      </span>
                    </div>
                  </div>
                  <ul>
                    {basicSubService.length === 0 && (
                      <p>None has been selected</p>
                    )}
                    {posts &&
                      posts.map((val: any, index: number) => (
                        <React.Fragment key={index}>
                          {val.subServices
                            .filter((sub: any) =>
                              basicSubService.some(
                                (selected) => selected._id === sub._id
                              )
                            )
                            .map((sub: any) => (
                              <li
                                className="flex items-center space-x-3 text-xs"
                                key={sub._id}
                              >
                                <FaDotCircle className="flex-shrink-0 w-2 h-2 text-gray-300" />
                                <span>{sub.name}</span>
                              </li>
                            ))}
                        </React.Fragment>
                      ))}
                  </ul>

                  <FaPlus
                    className="text-2xl cursor-pointer "
                    onClick={() => {
                      openModal("basic");
                    }}
                  />
                </div>

                <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 items-center bg-white rounded-lg border border-gray-100 shadow xl:p-8">
                  <h3 className="font-bai-semi-bold uppercase underline-offset-2 underline">
                    STANDARD
                  </h3>
                  <p className="font-light text-gray-500">
                    add you standard plan here.
                  </p>
                  <div className="mb-4">
                    <div className="flex justify-center pt-3  items-baseline m">
                      <span className="text-3xl font-extrabold">
                        ${standardData.price || "0"}
                      </span>
                      <span className="text-gray-500">/service</span>
                    </div>
                    <div className="text-center">
                      <span className="text-sm text-gray-500">
                        takes {standardData.workingHours || "0"} hours
                      </span>
                    </div>
                  </div>
                  <ul>
                    {standardSubService.length === 0 && (
                      <p>None has been selected</p>
                    )}
                    {posts &&
                      posts.map((val: any, index: number) => (
                        <React.Fragment key={index}>
                          {val.subServices
                            .filter((sub: any) =>
                              standardSubService.some(
                                (selected) => selected._id === sub._id
                              )
                            )
                            .map((sub: any) => (
                              <li
                                className="flex items-center space-x-3 text-xs"
                                key={sub._id}
                              >
                                <FaDotCircle className="flex-shrink-0 w-2 h-2 text-gray-300" />
                                <span>{sub.name}</span>
                              </li>
                            ))}
                        </React.Fragment>
                      ))}
                  </ul>
                  <FaPlus
                    className="text-2xl cursor-pointer "
                    onClick={() => {
                      openModal("standard");
                    }}
                  />
                </div>

                <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 items-center bg-white rounded-lg border border-gray-100 shadow xl:p-8">
                  <h3 className="font-bai-semi-bold uppercase underline-offset-2 underline">
                    premium
                  </h3>
                  <p className="font-light text-gray-500">
                    add your premium plan here.
                  </p>
                  <div className="mb-4">
                    <div className="flex justify-center pt-3  items-baseline m">
                      <span className="text-3xl font-extrabold">
                        ${premiumData.price || "0"}
                      </span>
                      <span className="text-gray-500">/service</span>
                    </div>
                    <div className="text-center">
                      <span className="text-sm text-gray-500">
                        takes {premiumData.workingHours || "0"} hours
                      </span>
                    </div>
                  </div>
                  <ul>
                    {premiumSubService.length === 0 && (
                      <p>None has been selected</p>
                    )}
                    {posts &&
                      posts.map((val: any, index: number) => (
                        <React.Fragment key={index}>
                          {val.subServices
                            .filter((sub: any) =>
                              premiumSubService.some(
                                (selected) => selected._id === sub._id
                              )
                            )
                            .map((sub: any) => (
                              <li
                                className="flex items-center space-x-3 text-xs"
                                key={sub._id}
                              >
                                <FaDotCircle className="flex-shrink-0 w-2 h-2 text-gray-300" />
                                <span>{sub.name}</span>
                              </li>
                            ))}
                        </React.Fragment>
                      ))}
                  </ul>
                  <FaPlus
                    className="text-2xl cursor-pointer "
                    onClick={() => {
                      openModal("premium");
                    }}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {errors.global && (
          <p className="text-red-500 text-center mt-5 font-bai-regular lowercase text-xs">
            {errors.global}
          </p>
        )}
        <div className="text-center mt-5 flex justify-center space-x-3">
          <Link to={"/company/services"}>
            <button className="bg-black h-10 px-4 w-12/12 text-white rounded">
              Back
            </button>
          </Link>
          <LoadingButton
            buttonText="Submit"
            isLoading={isLoading}
            onClick={handleSubmit}
            width="w-full sm:w-1/12"
            height="h-10"
          />
        </div>
      </div>
    </div>
  );
};

export default AddYourService;

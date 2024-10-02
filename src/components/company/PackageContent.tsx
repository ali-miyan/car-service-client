import { useState, useEffect } from "react";

const PackageContent = ({
  subservices,
  onClose,
  handleSubServicesSubmit,
  alreadyChecked,
  setData
}: {
  subservices: any;
  onClose: any;
  handleSubServicesSubmit: any;
  alreadyChecked: any;
  setData: any;
}) => {

  const [checkedItems, setCheckedItems] = useState<{ _id: string; name: string }[]>([]);
  const [price, setPrice] = useState<string>(setData.price || "");
  const [workingHours, setWorkingHours] = useState<string>(setData.workingHours || "");
  const [errors, setErrors] = useState<{ price?: string; workingHours?: string }>({});
  

  useEffect(() => {
    setCheckedItems(alreadyChecked);
    if (setData.workingHours) {
      setWorkingHours(setData.workingHours);
    }
    if (setData.price) {
      setPrice(setData.price);
    }
  }, [alreadyChecked, setData]);

  const handleCheckboxChange = (event: any, service: { _id: string; name: string }) => {
    const isChecked = event.target.checked;
    setCheckedItems((prevState) =>
      isChecked
        ? [...prevState, service]
        : prevState.filter((item) => item._id !== service._id)
    );
  };

  const handleSubmit = () => {
    const validationErrors: { price?: string; workingHours?: string } = {};
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      validationErrors.price = "Please enter a valid price.";
    }
    if (!workingHours || isNaN(Number(workingHours)) || Number(workingHours) <= 0) {
      validationErrors.workingHours = "Please enter valid working hours.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log("Working Hours:", workingHours);
    handleSubServicesSubmit(checkedItems, { price, workingHours });
    onClose();
  };

  return (
    <>
      <div className="w-full max-h-72 font-bai-regular lowercase overflow-y-auto p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-bold text-center mb-4">Select Subservices</h2>
        <div className="space-y-2">
          {subservices && subservices.map((service: any) => (
            <div key={service._id} className="flex items-center">
              <input
                type="checkbox"
                id={`service-${service._id}`}
                onChange={(e) => handleCheckboxChange(e, service)}
                checked={checkedItems.some((item) => item._id === service._id)}
                className="mr-2 cursor-pointer"
              />
              <label htmlFor={`service-${service._id}`} className="text-sm">
                {service.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      <p className="text-center text-xs uppercase mt-2 mb-1 font-bai-regular">
        Add your package price and working hours
      </p>
      <div className="flex items-center justify-center text-center space-x-4">
        <div className="flex flex-col items-start">
          <input
            type="number"
            placeholder="Add package price here"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-2 text-xs"
          />
          {errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}
        </div>
        <div className="flex flex-col items-start">
          <input
            type="number"
            placeholder="Working hours"
            value={workingHours}
            onChange={(e) => setWorkingHours(e.target.value)}
            className="border text-xs p-2"
          />
          {errors.workingHours && <p className="text-red-500 text-xs">{errors.workingHours}</p>}
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 w-full bg-red-800 text-white py-2 rounded hover:bg-red-900"
      >
        Submit
      </button>
    </>
  );
};

export default PackageContent;

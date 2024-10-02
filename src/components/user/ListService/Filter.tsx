import { useGetApprovedCompanyQuery } from "../../../store/slices/companyApiSlice";
import { useLocation, useNavigate } from "react-router-dom";

function Filters() {

  const { data: filterData } = useGetApprovedCompanyQuery({});

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const initialSection = queryParams.get("company");

  const handleNavigate = (id: string) => {
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set("company", id);
    const newUrl = `/services?${currentParams.toString()}`;
    navigate(newUrl);
  };

  const renderCompanyImagesAndIds = () => {
    if (!filterData) return null;

    return filterData.map(
      (company: { _id: any; companyName: any; logo: any }) => {
        const { _id, companyName, logo } = company;
        return (
          <div
            key={_id}
            className={`${
              _id === initialSection && "bg-red-50 "
            } flex items-center p-1 hover:bg-red-50 rounded cursor-pointer mt-3 space-x-2 mb-2`}
            onClick={() => handleNavigate(_id)}
          >
            <img src={logo} alt={companyName} className="w-12 h-12 object-cover" />
            <span className="text-xs uppercase pl-4">{companyName}</span>
          </div>
        );
      }
    );
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg font-bai-regular lowercase shadow-md md:w-1/5 md:flex-shrink-0 md:mr-4">
        <div className="mb-4">
          <p className="uppercase text-center underline underline-offset-2 font-bai-bold">
            companies
          </p>
          {renderCompanyImagesAndIds()}
        </div>
      </div>
    </>
  );
}

export default Filters;

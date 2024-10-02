import Service from "../../components/user/ListService/ServiceHeader";
import MainLayout from "../../layouts/MainLayout";

const ServiceList = () => {
  return (
    <MainLayout>
      <div className="bg-gray-100">
        <Service />
      </div>
    </MainLayout>
  );
};
export default ServiceList;

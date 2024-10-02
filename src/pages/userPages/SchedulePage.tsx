import MainLayout from "../../layouts/MainLayout";
import ScheduleOrder from "../../components/user/OrderManagement/ScheduleOrder";

const SetSpotPage = () => {
  return (
    <MainLayout>
      <div className="bg-gray-100">
        <ScheduleOrder />
      </div>
    </MainLayout>
  );
};

export default SetSpotPage;

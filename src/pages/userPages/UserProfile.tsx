import ProfilePage from "../../components/user/Profile/UserProfile";
import MainLayout from "../../layouts/MainLayout";

const Home = () => {
  return (
    <MainLayout>
      <div>
        <ProfilePage />
      </div>
    </MainLayout>
  );
};

export default Home;

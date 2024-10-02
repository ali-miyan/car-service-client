import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="relative min-h-screen font-bai-regular bg-gray-400 bg-opacity-50">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/public/assets/pexels-joshuaklr-790176.jpg')",
        }}
      ></div>
      <div className="relative z-10 flex flex-col items-center pt-32 text-center px-4 min-h-screen">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-4xl font-bold mb-4">Page not found</h2>
        <p className="mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Link to={"/"}>
          <div className="text-lg hover:underline">← Back to home</div>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

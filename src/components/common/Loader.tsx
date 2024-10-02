const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white transition-opacity duration-1000">
      <img
        src={"/assets/car-dealer-loader-gif.gif"}
        alt="Loading"
        className="w-36 h-36"
      />
    </div>
  );
};

export default Loader;

const Footer = () => {
  return (
    <div>
      <div className="bg-gray-200 lowercase font-bai-regular text-gray-800 py-8 px-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-around items-center">
          <div className="text-center md:text-left mb-4 md:mb-0 flex">
            <img
              src="https://nov-automize.myshopify.com/cdn/shop/files/email.svg?v=1708142703"
              width={50}
              alt=""
            />
            <p className="text-sm ml-5">
              <span className="text-lg font-semibold">
                SUBSCRIBE & GET 10% DISCOUNT
              </span>
              <br />
              Get 10% off your first purchase! Plus, be the first to know about
              sales new product launches and exclusive offers!
            </p>
          </div>
          <form className="flex w-full md:w-auto mt-4  md:mt-0">
            <input
              type="email"
              placeholder="YOUR EMAIL ADDRESS"
              className="w-full md:w-auto p-2 text-center rounded-full lowercase text-gray-700"
            />
            <button className="bg-[#ab0000] text-white px-4 py-2 mx-3 rounded-full">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <footer className="bg-[#323232] text-gray-300 font-bai-regular lowercase py-20 px-4">
        <div className="container mx-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center md:items-start">
            <p className="mb-4 text-center md:text-left">
              We provide top-quality maintenance and repair services to keep
              your vehicle running smoothly. Our experienced technicians use the
              latest tools and technology to ensure your car gets the best care
              possible. you can count on us for reliable and efficient
              solutions.
            </p>
            <div className="flex space-x-4">
              <a className="text-white hover:text-[#ab0000]">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a className="text-white hover:text-[#ab0000]">
                <i className="fab fa-pinterest-p"></i>
              </a>
              <a className="text-white hover:text-[#ab0000]">
                <i className="fab fa-twitter"></i>
              </a>
              <a className="text-white hover:text-[#ab0000]">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-lg font-semibold text-white mb-4">
              CONTACT US
            </h2>
            <p className="mb-4">
              We're available by phone:{" "}
              <a href="tel:+123-456-789" className="text-[#ab0000]">
                +123-456-789
              </a>
            </p>
            <p className="mb-4">info@example.com</p>
            <p>Monday till Friday 10 to 6 EST</p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-lg font-semibold text-white mb-4">
              CUSTOMER CARE
            </h2>
            <ul className="space-y-2">
              <li>
                <a className="hover:text-[#ab0000]">FAQs</a>
              </li>
              <li>
                <a className="hover:text-[#ab0000]">Terms of Service</a>
              </li>
              <li>
                <a className="hover:text-[#ab0000]">Privacy Policy</a>
              </li>
              <li>
                <a className="hover:text-[#ab0000]">Contact Us</a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
      <div className="bg-gray-100   p-3 text-center font-bai-light lowercase text-black ">
        <p>COPYRIGHT © 2023 TUNE-UP. ALL RIGHTS RESERVED.</p>
      </div>
    </div>
  );
};

export default Footer;

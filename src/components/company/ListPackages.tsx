import { FaDotCircle } from "react-icons/fa";

const ListPackages = ({
  basic,
  standard,
  premium,
}:any) => {

  return (
    <div>
      <section>
        <div className="!block sm:flex font-bai-regular overflow-y-auto my-4 max-h-96">
          <div className="w-full ">
            <div className="flex flex-col my-3 p-6 text-center text-gray-900 bg-gray-100 rounded">
              <h3 className="font-bold uppercase underline-offset-2 underline">
                BASIC PLAN
              </h3>
              <div className="mb-4">
                <div className="flex justify-center pt-3 items-baseline">
                  <span className="text-3xl font-extrabold">
                    ₹{basic.detail.price || "0"}
                  </span>
                  <span className="text-gray-500">/service</span>
                </div>
                <div className="text-center">
                  <span className="text-sm text-gray-500">
                    takes {basic.detail.workingHours || "0"} hours
                  </span>
                </div>
              </div>
              <ul>
                {basic.length === 0 && <p>no services have been added</p>}
                {basic &&
                  basic.subServices.map((val: any) => (
                    <li
                      className="flex items-center space-x-3 text-sm "
                      key={val._id}
                    >
                      <FaDotCircle className="w-2 h-2 text-green-300" />
                      <span>{val.name}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          <div className="w-ful">
            <div className="flex flex-col p-6 my-3 text-center text-gray-900 bg-gray-100 rounded">
              <h3 className="font-bold uppercase underline-offset-2 underline">
                STANDARD
              </h3>
              <div className="mb-4">
                <div className="flex justify-center pt-3 items-baseline">
                  <span className="text-3xl font-extrabold">
                    ₹{standard.detail.price || "0"}
                  </span>
                  <span className="text-gray-500">/service</span>
                </div>
                <div className="text-center">
                  <span className="text-sm text-gray-500">
                    takes {standard.detail.workingHours || "0"} hours
                  </span>
                </div>
              </div>
              <ul>
                {standard.length === 0 && <p>no services have been added</p>}
                {standard &&
                  standard.subServices.map((val: any) => (
                    <li
                      className="flex items-center space-x-3 text-sm "
                      key={val._id}
                    >
                      <FaDotCircle className="w-2 h-2 text-green-300" />
                      <span>{val.name}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          <div className="w-ful">
            <div className="flex flex-col p-6 my-3 text-center text-gray-900 bg-gray-100 rounded">
              <h3 className="font-bold uppercase underline-offset-2 underline">
                PREMIUM
              </h3>
              <div className="mb-4">
                <div className="flex justify-center pt-3 items-baseline">
                  <span className="text-3xl font-extrabold">
                    ₹{premium.detail.price || "0"}
                  </span>
                  <span className="text-gray-500">/service</span>
                </div>
                <div className="text-center">
                  <span className="text-sm text-gray-500">
                    takes {premium.detail.workingHours || "0"} hours
                  </span>
                </div>
              </div>
              <ul>
                {premium.length === 0 && <p>no services have been added</p>}
                {premium &&
                  premium.subServices.map((val: any) => (
                    <li
                      className="flex items-center space-x-3 text-sm "
                      key={val._id}
                    >
                      <FaDotCircle className="w-2 h-2 text-green-300" />
                      <span>{val.name}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ListPackages;

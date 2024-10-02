import { getInitialToken } from "../../../helpers/getToken";
import { useGetUserByIdQuery } from "../../../store/slices/userApiSlice";

const Wallet = () => {
  
  const token = getInitialToken("userToken");
  const { data } = useGetUserByIdQuery(token as string);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl uppercase font-bai-bold">Wallet Balance</h2>
      <div className="text-3xl font-bold text-[#ab0000] mb-6">
        ₹{data?.wallet.toFixed(2)}
      </div>

      <div className="bg-white border-2 rounded-lg p-6">
        <h3 className="text-xl uppercase text-gray-800 py-3 text-center underline underline-offset-4 mb-4">
          Transaction History
        </h3>
        <div className="overflow-x-auto">
          {data?.wallet <= 0 ? (
            <p className="text-center">no transactions yet</p>
          ) : (
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.walletHistory?.map((transaction:any, index:number) => (
                  <tr key={index} className="border-t">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transaction.transactionType === "credit" ? (
                        <span className="text-green-600">Credit</span>
                      ) : (
                        <span className="text-red-600">Debit</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ₹{transaction.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;

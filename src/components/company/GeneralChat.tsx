import { useEffect, useState } from "react";
import CompanyChat from "./GeneralChatBox";
import { useGetCompanyChatQuery } from "../../store/slices/chatApiSlice";
import Loader from "../common/Loader";
import { useChatSocket } from "../../service/socketService";
import { profileImg } from "../../constants/imageUrl";

const GeneralChat = ({
  selectedUser,
  id,
  companyData,
  setSelectedUser,
}: any) => {

  const {data: users,isLoading,refetch,} = useGetCompanyChatQuery(id, {refetchOnMountOrArgChange: true,});

  const [unreadMessages, setUnreadMessages] = useState<{
    [key: string]: number;
  }>({});
  
  const chatSocket = useChatSocket(id);

  useEffect(() => {
    const savedUnreadMessages = JSON.parse(
      localStorage.getItem("unreadMessages") || "{}"
    );
    setUnreadMessages(savedUnreadMessages);
  }, []);

  useEffect(() => {
    if (chatSocket) {
      chatSocket.on("user_to_company", (message) => {
        refetch();
        setUnreadMessages((prev) => {
          const updatedUnreadMessages = {
            ...prev,
            [message.userId]: (prev[message.userId] || 0) + 1,
          };
          localStorage.setItem(
            "unreadMessages",
            JSON.stringify(updatedUnreadMessages)
          );
          return updatedUnreadMessages;
        });
      });

      return () => {
        chatSocket.off("user_to_company");
      };
    }
  }, [chatSocket]);

  const handleUserClick = (userId: string) => {
    setSelectedUser(users.find((user:any) => user.user.userId === userId)?.user);
    const updatedUnreadMessages = { ...unreadMessages };
    delete updatedUnreadMessages[userId];
    localStorage.setItem(
      "unreadMessages",
      JSON.stringify(updatedUnreadMessages)
    );
    setUnreadMessages(updatedUnreadMessages);
  };

  const getLastMessage = (user: any) => {
    return (
      user?.messages[user?.messages.length - 1]?.content || "No messages yet."
    );
  };

  return (
    <div className="pt-5 mx-auto">
      {selectedUser ? (
        <CompanyChat
          userData={selectedUser}
          companyId={id}
          companyData={companyData}
          handleButtonClick={() => setSelectedUser(null)}
        />
      ) : (
        <>
          {isLoading || users === undefined ? (
            <Loader />
          ) : (
            <>
              <ul className="divide-y divide-gray-200">
                {users && users.length > 0 ? (
                  users.map((user:any, index:number) => (
                    <li
                      key={index}
                      className="flex items-center p-4 hover:bg-gray-100 cursor-pointer transition duration-200 ease-in-out relative"
                      onClick={() => handleUserClick(user.user.userId)}
                    >
                      {unreadMessages[user.user.userId] > 0 && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                          {unreadMessages[user.user.userId]}
                        </span>
                      )}
                      <div className="flex-shrink-0 mr-4">
                        <img
                          src={
                            user?.user.userImg ||
                            selectedUser?.profileImg ||
                            profileImg
                          }
                          alt={`${user?.user.userImg} logo`}
                          className="w-14 h-14 object-cover rounded-full"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-lg font-medium text-gray-900">
                          {user?.user.username || selectedUser?.username}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {getLastMessage(user)}
                        </p>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-center text-gray-500 mt-4">No messages</p>
                )}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default GeneralChat;

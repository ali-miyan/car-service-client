import React, { useEffect, useRef, useState } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { IChatData } from "../../schema/component";
import { useGetChatQuery } from "../../store/slices/chatApiSlice";
import { useChatSocket } from "../../service/socketService";
import Loader from "../common/Loader";
import { profileImg } from "../../constants/imageUrl";

const CompanyChat = ({
  userData,
  companyId,
  companyData,
  handleButtonClick,
}: any) => {

  const { data, isLoading, refetch } = useGetChatQuery({
    userId: userData.userId,
    companyId,
  });

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const [newMessage, setNewMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<IChatData>({
    _id: "",
    user: {
      userId: "",
      username: "",
      userImg: "",
    },
    company: {
      companyId: companyId as string,
      companyName: companyData?.companyName,
      companyImg: companyData?.logo,
    },
    messages: [],
  });

  const chatSocket = useChatSocket(companyId);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setChatMessages((prevState) => ({
        ...prevState,
        messages: [
          ...prevState.messages,
          {
            sender: companyId,
            content: file,
            timestamp: new Date(),
            type: "file",
          },
        ],
      }));

      const messageData = {
        chatId: data._id,
        companyId,
        companyName: companyData?.companyName,
        companyImg: companyData?.logo,
        userId: data?.user.userId,
        content: file,
        timestamp: Date.now(),
        type: "file",
      };

      chatSocket?.emit("company_message_sent", messageData);
    }
  };


  useEffect(() => {
    if (data) {
      setChatMessages(data || []);
    }
  }, [data]);

  useEffect(() => {
    if (chatSocket) {
      chatSocket.on("user_to_company", (messageData: any) => {
        if (messageData.type === "file") {
          setTimeout(() => {
            refetch();
          }, 2000);
        } else {
          setChatMessages((prevState) => ({
            ...prevState,
            messages: [
              ...prevState.messages,
              {
                sender: messageData.userId,
                content: messageData.content,
                timestamp: messageData.timestamp,
                type: "text",
              },
            ],
          }));
        }
      });

      return () => {
        chatSocket.off("user_to_company");
      };
    }
  }, [chatSocket]);

  const handleSendMessage = () => {
    setNewMessage("");

    const messageData = {
      chatId: data._id,
      companyId,
      companyName: companyData?.companyName,
      companyImg: companyData?.logo,
      userId: data?.user.userId,
      content: newMessage,
      timestamp: Date.now(),
      type: "text",
    };

    const newMessageObject: any = {
      sender: companyId,
      content: newMessage,
      timestamp: new Date(),
      type: "text",
    };

    setChatMessages((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, newMessageObject],
    }));

    chatSocket?.emit("company_message_sent", messageData);
  };

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="max-w-4xl mx-auto bg-white shadow-md overflow-hidden">
          <div className="flex flex-col h-full">
            <div className="flex items-center px-4 py-2 bg-white border-b border-gray-200">
              <span className="pr-4" onClick={handleButtonClick}>
                <IoArrowBackCircleOutline className="text-3xl text-black" />
              </span>

              <img
                src={data?.user?.userImg || profileImg}
                alt={`${data?.user?.username} logo`}
                className="w-16 h-16 object-cover rounded-full border border-gray-300"
              />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {data?.user?.username}
                </h3>
                <p className="text-sm text-gray-500 mt-1">online</p>
              </div>
            </div>

            <div className="flex-1 min-h-[calc(88vh-150px)] max-h-[calc(80vh-100px)] p-4 border-t border-gray-200 overflow-y-auto no-scrollbar">
              {chatMessages?.messages?.length > 0 ? (
                chatMessages?.messages?.map((msg, index) => (
                  <React.Fragment key={index}>
                    <div
                      className={`flex items-start gap-1 justify-${
                        msg.sender === companyId ? "end" : "start"
                      } mb-4`}
                    >
                      {msg.sender !== companyId && (
                        <img
                          src={data?.user?.userImg || profileImg}
                          alt="User"
                          className="w-8 h-8 rounded-full border self-end border-gray-300"
                        />
                      )}
                      <div
                        className={`flex flex-col w-full max-w-[240px] px-4 py-2 border ${
                          msg.sender === companyId
                            ? "company-bg border-gray-400 rounded-l-xl rounded-t-xl"
                            : "user-bg border-gray-400 rounded-r-xl rounded-t-xl"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-sm uppercase font-bai-bold text-black`}
                          >
                            {msg.sender === companyId
                              ? data?.company?.companyName ||
                                companyData.companyName
                              : data?.user?.username}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          {msg.type === "text" ? (
                            <p className="text-sm w-full font-normal pt-1 text-gray-900 break-words overflow-hidden">
                              {msg.content}
                            </p>
                          ) : msg.type === "file" ? (
                            <img
                              src={
                                msg.content instanceof File
                                  ? URL.createObjectURL(msg.content)
                                  : msg.content
                              }
                              alt="Uploaded Image"
                              className="w-full h-auto pt-1 object-cover rounded-lg shadow-md"
                            />
                          ) : null}
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0 self-end">
                          {new Intl.DateTimeFormat("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(new Date(msg.timestamp))}
                        </span>
                      </div>
                      {msg.sender === companyId && (
                        <img
                          src={data?.company?.companyImg || companyData.logo}
                          alt="Company"
                          className="w-8 h-8 rounded-full border self-end border-gray-300"
                        />
                      )}
                    </div>
                    <div ref={endOfMessagesRef} />
                  </React.Fragment>
                ))
              ) : (
                <p className="text-center text-gray-500">No messages yet.</p>
              )}
            </div>

            <div className="w-full pl-2 pr-1 py-2 border border-gray-200 items-center gap-2 inline-flex justify-between">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                >
                  <g id="User Circle">
                    <path
                      id="icon"
                      d="M6.05 17.6C6.05 15.3218 8.26619 13.475 11 13.475C13.7338 13.475 15.95 15.3218 15.95 17.6M13.475 8.525C13.475 9.89191 12.3669 11 11 11C9.6331 11 8.525 9.89191 8.525 8.525C8.525 7.1581 9.6331 6.05 11 6.05C12.3669 6.05 13.475 7.1581 13.475 8.525ZM19.25 11C19.25 15.5563 15.5563 19.25 11 19.25C6.44365 19.25 2.75 15.5563 2.75 11C2.75 6.44365 6.44365 2.75 11 2.75C15.5563 2.75 19.25 6.44365 19.25 11Z"
                      stroke="#ab0000"
                      strokeWidth="1.6"
                    />
                  </g>
                </svg>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="grow shrink basis-0 text-black text-xs font-medium leading-4 focus:outline-none"
                  placeholder="Type here..."
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id="imageInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                <svg
                  className="cursor-pointer"
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  onClick={() => document.getElementById("imageInput")?.click()}
                >
                  <g id="Attach 01">
                    <g id="Vector">
                      <path
                        d="M14.9332 7.79175L8.77551 14.323C8.23854 14.8925 7.36794 14.8926 6.83097 14.323C6.294 13.7535 6.294 12.83 6.83097 12.2605L12.9887 5.72925M12.3423 6.41676L13.6387 5.04176C14.7126 3.90267 16.4538 3.90267 17.5277 5.04176C18.6017 6.18085 18.6017 8.02767 17.5277 9.16676L16.2314 10.5418M16.8778 9.85425L10.72 16.3855C9.10912 18.0941 6.49732 18.0941 4.88641 16.3855C3.27549 14.6769 3.27549 11.9066 4.88641 10.198L11.0441 3.66675"
                        stroke="#9CA3AF"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14.9332 7.79175L8.77551 14.323C8.23854 14.8925 7.36794 14.8926 6.83097 14.323C6.294 13.7535 6.294 12.83 6.83097 12.2605L12.9887 5.72925M12.3423 6.41676L13.6387 5.04176C14.7126 3.90267 16.4538 3.90267 17.5277 5.04176C18.6017 6.18085 18.6017 8.02767 17.5277 9.16676L16.2314 10.5418M16.8778 9.85425L10.72 16.3855C9.10912 18.0941 6.49732 18.0941 4.88641 16.3855C3.27549 14.6769 3.27549 11.9066 4.88641 10.198L11.0441 3.66675"
                        stroke="black"
                        strokeOpacity="0.2"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </g>
                </svg>
                <button
                  onClick={handleSendMessage}
                  className="items-center flex px-3 py-2 bg-red-900 rounded-full shadow"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <g id="Send 01">
                      <path
                        id="icon"
                        d="M9.04071 6.959L6.54227 9.45744M6.89902 10.0724L7.03391 10.3054C8.31034 12.5102 8.94855 13.6125 9.80584 13.5252C10.6631 13.4379 11.0659 12.2295 11.8715 9.81261L13.0272 6.34566C13.7631 4.13794 14.1311 3.03408 13.5484 2.45139C12.9657 1.8687 11.8618 2.23666 9.65409 2.97257L6.18714 4.12822C3.77029 4.93383 2.56187 5.33664 2.47454 6.19392C2.38721 7.0512 3.48957 7.68941 5.69431 8.96584L5.92731 9.10074C6.23326 9.27786 6.38623 9.36643 6.50978 9.48998C6.63333 9.61352 6.72189 9.7665 6.89902 10.0724Z"
                        stroke="white"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </g>
                  </svg>
                  <h3 className="text-white text-xs font-semibold leading-4 px-2">
                    Send
                  </h3>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompanyChat;

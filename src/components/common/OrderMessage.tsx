import { useState, useEffect } from "react";
import { Store } from "react-notifications-component";
import { MdNotifications } from "react-icons/md";
import { Link } from "react-router-dom";
import "../../styles/SideBarNotification.css";

const showNotification = (
  message: string,
  to: string,
  onClose: (id: string) => void
) => {
  const notificationId = Store.addNotification({
    title: (
      <div className="flex justify-center font-bai-bold text-black uppercase">
        <MdNotifications className="text-xl" />
        Notification
      </div>
    ),
    message: (
      <div>
        <div className="text-black font-bai-medium lowercase">{message}</div>
        <div className="flex justify-center gap-5 mt-4">
          <Link to={to}>
            <button className="p-1 px-3 lowercase bg-black text-white ">
              Show
            </button>
          </Link>
          <button
            className="p-1 px-3 lowercase bg-red-900 text-white"
            onClick={() => onClose(notificationId)}
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    type: "warning",
    insert: "top",
    container: "top-center",
    animationIn: ["animated", "fadeIn"],
    animationOut: ["animated", "fadeOut"],
    dismiss: {
      duration: 10000,
      onScreen: true,
      pauseOnHover: true,
    },
  });

  return notificationId;
};

const OrderNotification = ({
  show,
  message,
  to,
}: {
  show: boolean;
  message: string;
  to: string;
}) => {
  const [notificationId, setNotificationId] = useState<string | null>(null);

  useEffect(() => {
    if (show) {
      const id = showNotification(message, to, (id) => setNotificationId(id));
      setNotificationId(id);
    }
  }, [show, message, to]);

  useEffect(() => {
    if (!show && notificationId) {
      Store.removeNotification(notificationId);
      setNotificationId(null);
    }
  }, [show, notificationId]);

  return null;
};

export default OrderNotification;

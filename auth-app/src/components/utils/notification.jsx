import { useEffect, useState } from "react";

const Notification = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-500";

  return visible ? (
    <div
      className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fadeIn`}
    >
      <div className="flex items-center">
        <span>{message}</span>
        <button
          onClick={() => {
            setVisible(false);
            onClose();
          }}
          className="ml-4 text-xl"
        >
          &times;
        </button>
      </div>
    </div>
  ) : null;
};

export default Notification;

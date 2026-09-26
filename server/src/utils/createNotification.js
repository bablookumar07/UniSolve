import Notification from "../models/Notification.js";

const createNotification = async ({
  recipient,
  complaint = null,
  type,
  title,
  message,
}) => {
  try {
    await Notification.create({
      recipient,
      complaint,
      type,
      title,
      message,
    });
  } catch (error) {
    console.error("Notification creation error:", error);
  }
};

export default createNotification;
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  Bell,
  CheckCheck,
  Clock3,
  Loader2,
  RefreshCw,
} from "lucide-react";

import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../api/notificationApi";

const StaffNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = useCallback(async (isRefresh = false) => {
    try {
      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getNotifications();

      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load notifications."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const data = await markNotificationAsRead(notificationId);

      setNotifications((current) =>
        current.map((notification) =>
          notification._id === notificationId
            ? data.notification || {
                ...notification,
                isRead: true,
                readAt: new Date().toISOString(),
              }
            : notification
        )
      );
    } catch (error) {
      console.error("Mark notification as read error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to update notification."
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAll(true);
      setError("");

      await markAllNotificationsAsRead();

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          isRead: true,
          readAt:
            notification.readAt ||
            new Date().toISOString(),
        }))
      );
    } catch (error) {
      console.error("Mark all notifications error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to mark all notifications as read."
      );
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "COMPLAINT_ASSIGNED":
        return (
          <Bell
            size={20}
            className="text-blue-600 dark:text-blue-400"
          />
        );

      case "COMPLAINT_STARTED":
        return (
          <Clock3
            size={20}
            className="text-amber-600 dark:text-amber-400"
          />
        );

      case "COMPLAINT_REOPENED":
        return (
          <RefreshCw
            size={20}
            className="text-red-600 dark:text-red-400"
          />
        );

      case "COMPLAINT_RESOLVED":
        return (
          <CheckCheck
            size={20}
            className="text-green-600 dark:text-green-400"
          />
        );

      default:
        return (
          <Bell
            size={20}
            className="text-gray-500 dark:text-gray-400"
          />
        );
    }
  };

  const getComplaintLink = (notification) => {
    if (!notification.complaint) {
      return null;
    }

    const complaintId =
      typeof notification.complaint === "object"
        ? notification.complaint._id
        : notification.complaint;

    if (!complaintId) {
      return null;
    }

    return `/staff/complaints/${complaintId}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
          <Loader2
            size={20}
            className="animate-spin"
          />
          <span>Loading notifications...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Notifications
              </h1>

              {unreadCount > 0 && (
                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                  {unreadCount} unread
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Stay updated about your assigned complaints.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                disabled={markingAll}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300 dark:hover:bg-slate-800"
              >
                {markingAll ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <CheckCheck size={16} />
                )}

                {markingAll
                  ? "Updating..."
                  : "Mark all as read"}
              </button>
            )}

            <button
              type="button"
              onClick={() => fetchNotifications(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300 dark:hover:bg-slate-800"
            >
              <RefreshCw
                size={16}
                className={
                  refreshing ? "animate-spin" : ""
                }
              />

              Refresh
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Notifications */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-gray-400">
                <Bell size={24} />
              </div>

              <h2 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
                No notifications
              </h2>

              <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                You will receive notifications when
                there are updates to your assigned
                complaints.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-slate-800">
              {notifications.map((notification) => {
                const complaintLink =
                  getComplaintLink(notification);

                return (
                  <div
                    key={notification._id}
                    className={`p-5 transition ${
                      notification.isRead
                        ? "bg-white dark:bg-slate-900"
                        : "bg-blue-50/60 dark:bg-blue-500/[0.04]"
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                          notification.isRead
                            ? "bg-gray-100 dark:bg-slate-800"
                            : "bg-white shadow-sm dark:bg-slate-800"
                        }`}
                      >
                        {getNotificationIcon(
                          notification.type
                        )}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col justify-between gap-2 sm:flex-row">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3
                                className={`text-sm font-semibold ${
                                  notification.isRead
                                    ? "text-gray-800 dark:text-gray-200"
                                    : "text-gray-900 dark:text-white"
                                }`}
                              >
                                {notification.title}
                              </h3>

                              {!notification.isRead && (
                                <span className="h-2 w-2 rounded-full bg-blue-600" />
                              )}
                            </div>

                            <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                              {notification.message}
                            </p>
                          </div>

                          <span className="shrink-0 text-xs text-gray-400">
                            {formatDate(
                              notification.createdAt
                            )}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          {complaintLink && (
                            <Link
                              to={complaintLink}
                              onClick={() => {
                                if (!notification.isRead) {
                                  handleMarkAsRead(
                                    notification._id
                                  );
                                }
                              }}
                              className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              View complaint
                            </Link>
                          )}

                          {!notification.isRead && (
                            <button
                              type="button"
                              onClick={() =>
                                handleMarkAsRead(
                                  notification._id
                                )
                              }
                              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default StaffNotifications;
import React, { useEffect, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  RefreshCw,
  AlertCircle,
  ClipboardList,
  UserCheck,
  PlayCircle,
  CheckCircle2,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../api/notificationApi";

const notificationIcons = {
  COMPLAINT_CREATED: ClipboardList,
  COMPLAINT_ASSIGNED: UserCheck,
  COMPLAINT_STARTED: PlayCircle,
  COMPLAINT_RESOLVED: CheckCircle2,
  COMPLAINT_REOPENED: RotateCcw,
  COMPLAINT_CLOSED: XCircle,
};

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchNotifications = async (isRefresh = false) => {
    try {
      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await getNotifications();

      setNotifications(response.notifications || []);
    } catch (error) {
      console.error("Fetch admin notifications error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load notifications."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);

      setNotifications((previousNotifications) =>
        previousNotifications.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error("Mark notification as read error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to mark notification as read."
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();

      setNotifications((previousNotifications) =>
        previousNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error("Mark all notifications error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to mark all notifications as read."
      );
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

  const getComplaintId = (complaint) => {
    if (!complaint) return null;

    if (typeof complaint === "string") {
      return complaint;
    }

    return complaint._id;
  };

  const getIcon = (type) => {
    return notificationIcons[type] || Bell;
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Loading notifications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 dark:bg-blue-900/30">
              <Bell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Notifications
              </h1>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Stay updated with important system activities.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchNotifications(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-800"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing ? "animate-spin" : ""
              }`}
            />

            Refresh
          </button>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Notifications
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {notifications.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Unread
          </p>

          <p className="mt-2 text-2xl font-bold text-blue-600">
            {unreadCount}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Read
          </p>

          <p className="mt-2 text-2xl font-bold text-green-600">
            {notifications.length - unreadCount}
          </p>
        </div>
      </div>

      {/* Notifications */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {notifications.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
            <div className="rounded-full bg-gray-100 p-4 dark:bg-slate-800">
              <Bell className="h-8 w-8 text-gray-400" />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              No notifications
            </h3>

            <p className="mt-1 max-w-md text-sm text-gray-500 dark:text-gray-400">
              You are all caught up. New system notifications will
              appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-slate-800">
            {notifications.map((notification) => {
              const Icon = getIcon(notification.type);
              const complaintId = getComplaintId(
                notification.complaint
              );

              return (
                <div
                  key={notification._id}
                  className={`p-5 transition ${
                    notification.isRead
                      ? "bg-white dark:bg-slate-900"
                      : "bg-blue-50/60 dark:bg-blue-950/20"
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                        notification.isRead
                          ? "bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-gray-400"
                          : "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {notification.title}
                          </h3>

                          <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                            {notification.message}
                          </p>
                        </div>

                        {!notification.isRead && (
                          <span className="w-fit rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                            Unread
                          </span>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span>
                          {formatDate(notification.createdAt)}
                        </span>

                        {complaintId && (
                          <Link
                            to={`/admin/complaints/${complaintId}`}
                            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                          >
                            View complaint
                          </Link>
                        )}

                        {!notification.isRead && (
                          <button
                            onClick={() =>
                              handleMarkAsRead(notification._id)
                            }
                            className="inline-flex items-center gap-1.5 font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                          >
                            <Check className="h-3.5 w-3.5" />
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
  );
};

export default AdminNotifications;
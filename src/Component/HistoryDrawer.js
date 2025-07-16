import React, { useCallback, useEffect, useState } from "react";
import apiServices from "../utils/apiServices";
import dayjs from "dayjs";
import apiRoutes from "../utils/apiRoutes";
import Loader from "./loader";

const actionStyles = {
  UPDATED: "text-blue-700 border-blue-300 bg-blue-50",
  APPROVED: "text-green-700 border-green-300 bg-green-50",
  REJECTED: "text-red-700 border-red-300 bg-red-50",
  CREATED: "text-indigo-700 border-indigo-300 bg-indigo-50",
  DELETED: "text-rose-700 border-rose-300 bg-rose-50",
};

const HistoryDrawer = ({ isOpen, onClose, leave }) => {
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getHistoryData = useCallback(async () => {
    if (!leave?._id) return;
    try {
      const res = await apiServices.get(apiRoutes.leave.history(leave._id));
      setHistoryData(res.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to load History data", err);
    }
  }, [leave?._id]);

  useEffect(() => {
    getHistoryData();
  }, [getHistoryData]);

  const formatValue = (v) => {
    if (!v) return "-";

    if (Array.isArray(v) && v.every((d) => dayjs(d).isValid())) {
      return v.map((d) => dayjs(d).format("D MMM YYYY")).join(", ");
    }

    if (dayjs(v).isValid() && typeof v === "string") {
      return dayjs(v).format("D MMM YYYY, h:mm A");
    }

    return v.toString();
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h2 className="text-lg font-semibold">Leave History</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-black">
          ✕
        </button>
      </div>

      <div
        className="p-4 space-y-4 overflow-y-auto h-[calc(100%-60px)]"
        style={{ scrollbarWidth: "none" }}
      >
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {historyData.length > 0 ? (
              historyData.map((item, index) => {
                const statusClass =
                  actionStyles[item?.action?.toUpperCase()] ||
                  "border-gray-200";

                return (
                  <div
                    key={index}
                    className={`p-3 rounded border ${statusClass} text-black text-sm`}
                  >
                    <p className={`font-semibold ${statusClass} mb-1`}>
                      {item?.action}
                    </p>
                    <p>
                      By: <strong>{item?.user?.name}</strong> (
                      {item?.user?.role})
                    </p>
                    <p>
                      Date:{" "}
                      {dayjs(item?.createdAt).format("D MMM YYYY, h:mm A")}
                    </p>

                    {item?.statusChange && <p>Status: {item.statusChange}</p>}

                    {item?.message && (
                      <p className="mt-1">
                        <span className="font-medium">Note:</span>{" "}
                        {item.message}
                      </p>
                    )}

                    {item?.change && Object.keys(item.change).length > 0 && (
                      <div className="mt-2">
                        <p className="font-bold mb-1">Changes:</p>
                        {Object.entries(item.change).map(([field, value]) => (
                          <p key={field} className="mt-2">
                            <span className="font-semibold">{field}</span>: from{" "}
                            {formatValue(value?.from)} → to{" "}
                            {formatValue(value?.to)}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-400">No history found.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HistoryDrawer;

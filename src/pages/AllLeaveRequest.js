import { useState } from "react";
import DataTable from "../Component/dataTable";
import formatDate from "../utils/formatDate";
import DeclineLeaveModal from "../utils/DeclineLeaveModal";
import { toast } from "react-toastify";
import ApporvedLeaveModal from "../utils/ApporvedLeaveModal";
import HistoryDrawer from "../Component/HistoryDrawer";
import apiRoutes from "../utils/apiRoutes";

const AllLeaveRequest = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedLeave, setSelectedLeave] = useState();
  const [openDecline, setOpenDecline] = useState(false);
  const [openApporve, setOpenApporve] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);

  const columns = [
    { label: "Reason", key: "reason" },
    { label: "Status", key: "status" },
    {
      label: "Review By",
      render: (row) => row.reviewedBy?.name || "N/A",
    },
    {
      label: "Leave Dates",
      render: (row) =>
        row.leaveDates.map((date) => formatDate(date)).join(", "),
    },
    { label: "Days", render: (row) => row.leaveDates?.length },
    { label: "User", render: (row) => row.user?.name },
    {
      label: "Attachment",
      render: (row) => (
        <>
          {row.attachment ? (
            <a
              href={`http://localhost:8000/attachment/${row.attachment}`}
              target="_blank"
              rel="noreferrer"
            >
              view attachment
            </a>
          ) : (
            "No attachment"
          )}
        </>
      ),
    },
    {
      label: "Action",
      render: (row) => (
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-xl bg-green-100 text-green-700 font-semibold shadow-inner hover:shadow-md hover:bg-green-200 transition-all duration-200"
            onClick={() => {
              setSelectedLeave(row);
              if (row?.status === "approved") {
                toast.error("Leave is already approved");
              } else {
                setOpenApporve(true);
              }
            }}
          >
            Approve
          </button>
          <button
            className="px-4 py-2 rounded-xl bg-rose-100 text-rose-700 font-semibold shadow-inner hover:shadow-md hover:bg-rose-200 transition-all duration-200"
            onClick={() => {
              setSelectedLeave(row);
              if (row?.status === "rejected") {
                toast.error("Leave is already rejected");
              } else {
                setOpenDecline(true);
              }
            }}
          >
            Decline
          </button>
          <button
            className="px-4 py-2 rounded-xl bg-gray-100 text-indigo-700 font-semibold shadow-inner hover:shadow-md hover:bg-gray-200 transition-all duration-200"
            onClick={() => {
              setSelectedLeave(row);
              setOpenHistory(true);
            }}
          >
            History
          </button>
        </div>
      ),
      sortable: false,
    },
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        endpoint={apiRoutes.leave.allFilter}
        refreshTrigger={refreshKey}
      />

      <DeclineLeaveModal
        isOpen={openDecline}
        onClose={() => {
          setOpenDecline(false);
        }}
        onSuccess={() => setRefreshKey((prev) => prev + 1)}
        apiEndpoint={apiRoutes.leave.reject(selectedLeave?._id)}
      />

      <ApporvedLeaveModal
        isOpen={openApporve}
        onClose={() => {
          setOpenApporve(false);
        }}
        onSuccess={() => setRefreshKey((prev) => prev + 1)}
        apiEndpoint={apiRoutes.leave.approve(selectedLeave?._id)}
      />
      <HistoryDrawer
        isOpen={openHistory}
        onClose={() => setOpenHistory(false)}
        leave={selectedLeave}
      />
    </div>
  );
};

export default AllLeaveRequest;

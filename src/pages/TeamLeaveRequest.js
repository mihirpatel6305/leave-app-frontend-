import { useState } from "react";
import DataTable from "../Component/dataTable";
import Modal from "react-modal";
import formatDate from "../utils/formatDate";
import ApporvedLeaveModal from "../utils/ApporvedLeaveModal";
import DeclineLeaveModal from "../utils/DeclineLeaveModal";
import { toast } from "react-toastify";
import HistoryDrawer from "../Component/HistoryDrawer";
import apiRoutes from "../utils/apiRoutes";

Modal.setAppElement("#root");

const TeamLeaveRequest = () => {
  const [selectedLeave, setSelectedLeave] = useState();
  const [refreshKey, setRefreshKey] = useState(0);
  const [openDecline, setOpenDecline] = useState(false);
  const [openApporve, setOpenApporve] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);

  const loginUser = JSON.parse(localStorage.getItem("userdata"));

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
    { label: "Email", render: (row) => row.user?.email },
    {
      label: "Attachment",
      render: (row) =>
        row.attachment ? (
          <a
            href={`http://localhost:8000/attachment/${row.attachment}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Attachment
          </a>
        ) : (
          <span>No Attachment</span>
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
                toast.error("Leave is already apporved");
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
    <>
      <div>
        <DataTable
          columns={columns}
          endpoint={apiRoutes.leave.teamLeave(loginUser?._id)}
          refreshTrigger={refreshKey}
        />
      </div>
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
    </>
  );
};

export default TeamLeaveRequest;

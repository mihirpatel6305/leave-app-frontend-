import { useState } from "react";
import DataTable from "../Component/dataTable";
import Modal from "react-modal";
import AddEditLeaveModal from "../utils/AddEditLeaveModal";
import DeleteModal from "../utils/DeleteModal";
import formatDate from "../utils/formatDate";
import HistoryDrawer from "../Component/HistoryDrawer";
import apiRoutes from "../utils/apiRoutes";

Modal.setAppElement("#root");

const MyLeave = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState();
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
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
    {
      label: "Attachment",
      render: (row) =>
        row.attachment ? (
          <a
            href={`${process.env.REACT_APP_IMG_URL}attachment/${row.attachment}`}
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
            className="px-4 py-2 rounded-xl bg-blue-100 text-blue-700 font-semibold shadow-inner hover:shadow-md hover:bg-blue-200 transition-all duration-200"
            onClick={() => {
              setSelectedLeave(row);
              setOpenEdit(true);
            }}
          >
            Update
          </button>
          <button
            className="px-4 py-2 rounded-xl bg-red-100 text-red-700 font-semibold shadow-inner hover:shadow-md hover:bg-red-200 transition-all duration-200"
            onClick={() => {
              setSelectedLeave(row);
              setOpenDelete(true);
            }}
          >
            Delete
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
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            paddingRight: "1rem",
          }}
        >
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-1.5 rounded-md text-sm"
            onClick={() => {
              setIsCreateOpen(true);
              setRefreshKey((prev) => prev + 1);
            }}
          >
            + Create Leave
          </button>
        </div>
        <DataTable
          columns={columns}
          endpoint={apiRoutes?.leave?.myleaves}
          refreshTrigger={refreshKey}
        />
      </div>
      <AddEditLeaveModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => setRefreshKey((prev) => prev + 1)}
        apiEndpoint={`${apiRoutes.leave.add}`}
      />
      <AddEditLeaveModal
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        onSuccess={() => setRefreshKey((prev) => prev + 1)}
        apiEndpoint={apiRoutes.leave.edit(selectedLeave?._id)}
        defaultValues={selectedLeave}
      />
      <HistoryDrawer
        isOpen={openHistory}
        onClose={() => setOpenHistory(false)}
        leave={selectedLeave}
      />
      <DeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onSuccess={() => setRefreshKey((prev) => prev + 1)}
        apiEndpoint={apiRoutes.leave.delete(selectedLeave?._id)}
        name={selectedLeave?.reason}
      />
    </>
  );
};

export default MyLeave;

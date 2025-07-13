import React, { useState } from "react";
import DataTable from "../Component/dataTable";
import AddEditUser from "../utils/AddEditUser";
import apiRoutes from "../utils/apiRoutes";

const Myteam = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const loginUser = JSON.parse(localStorage.getItem("userdata"));

  const columns = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Role", key: "role" },
    {
      label: "Manager",
      render: (row) => row.manager?.name || "N/A",
    },
    {
      label: "Created By",
      render: (row) => row.createdBy?.name || "N/A",
    },
    {
      label: "Last Modified By",
      render: (row) => row.lastModifiedBy?.name || "N/A",
    },
    {
      label: "Action",
      render: (row) => (
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-xl bg-blue-100 text-blue-700 font-semibold shadow-inner hover:shadow-md hover:bg-blue-200 transition-all duration-200"
            onClick={() => {
              setSelectedUser(row);
              setOpenEdit(true);
            }}
          >
            Update
          </button>
        </div>
      ),
      sortable: false,
    },
  ];

  return (
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
          + Create User
        </button>
      </div>
      <DataTable
        columns={columns}
        endpoint={apiRoutes.user.myteam(loginUser?._id)}
        refreshTrigger={refreshKey}
      />

      <AddEditUser
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => setRefreshKey((prev) => prev + 1)}
        apiEndpoint={apiRoutes.user.add}
      />

      <AddEditUser
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        onSuccess={() => setRefreshKey((prev) => prev + 1)}
        apiEndpoint={apiRoutes.user.edit(selectedUser?._id)}
        defaultValues={selectedUser}
      />
    </div>
  );
};

export default Myteam;

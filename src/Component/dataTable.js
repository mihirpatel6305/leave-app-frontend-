import React, { useEffect, useState } from "react";
import api from "../utils/apiServices";
import Loader from "./loader";

const DataTable = ({ columns, endpoint, refreshTrigger }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState(columns[0]?.key);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    if (!endpoint || !sortField) return;

    setLoading(true);
    if (sortField !== undefined) {
      api
        .get(
          `${endpoint}?page=${page}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`
        )
        .then((res) => {
          setData(res.data);
          setTotalPages(res.totalPages);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load table data", err);
          setLoading(false);
        });
    }
  }, [endpoint, page, limit, refreshTrigger, sortField, sortOrder]);

  if (loading)
    return (
      <div className="text-center text-lg text-blue-600 py-6">
        <Loader />
      </div>
    );

  if (!data?.length)
    return <p className="text-center text-gray-500 py-6">No data found.</p>;

  return (
    <div className="overflow-x-auto p-5 font-sans">
      <table className="min-w-full border-separate border-spacing-y-1">
        <thead>
          <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
            {columns.map((col) => {
              const isSortable = col.sortable !== false;
              return (
                <th
                  key={col.label}
                  className="p-3 cursor-pointer"
                  onClick={() => {
                    if (!isSortable) return;
                    const isSame = sortField === col.key;
                    setSortField(col.key);
                    setSortOrder(
                      isSame ? (sortOrder === "asc" ? "desc" : "asc") : "asc"
                    );
                  }}
                >
                  {col.label}{" "}
                  {sortField === col.key &&
                    isSortable &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              {columns.map((col) => (
                <td key={col.label} className="p-3 text-sm text-gray-700">
                  {col.key === "status" ? (
                    <span className={statusBadge(row[col.key])}>
                      {row[col.key]}
                    </span>
                  ) : typeof col.render === "function" ? (
                    col.render(row)
                  ) : (
                    row[col.key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-center items-center gap-1 flex-wrap">
        {/* <button
          className="px-3 py-1 text-sm rounded bg-blue-600 text-white font-medium disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          ⬅ Prev
        </button> */}

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((num) => {
            return (
              num === 1 || // always show first
              num === totalPages || // always show last
              Math.abs(page - num) <= 1 // show current, previous, and next
            );
          })
          .reduce((acc, num, idx, arr) => {
            if (idx > 0 && num - arr[idx - 1] > 1) acc.push("ellipsis");
            acc.push(num);
            return acc;
          }, [])
          .map((num, i) =>
            num === "ellipsis" ? (
              <span key={i} className="px-2 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={i}
                className={`px-3 py-1 text-sm rounded ${
                  page === num
                    ? "bg-blue-700 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setPage(num)}
              >
                {num}
              </button>
            )
          )}

        {/* <button
          className="px-3 py-1 text-sm rounded bg-blue-600 text-white font-medium disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next ➡
        </button> */}
      </div>
    </div>
  );
};

const statusBadge = (status) => {
  const base =
    "inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize";
  const colorMap = {
    approved: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    rejected: "bg-red-100 text-red-700",
  };
  return `${base} ${colorMap[status] || "bg-gray-100 text-gray-600"}`;
};

export default DataTable;

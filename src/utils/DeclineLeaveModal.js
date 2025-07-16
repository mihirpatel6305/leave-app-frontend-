import React, { useState } from "react";
import Modal from "react-modal";
import apiServices from "./apiServices";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const DeclineLeaveModal = ({ isOpen, onClose, onSuccess, apiEndpoint }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleDecline = async () => {
    try {
      setLoading(true);
      const res = await apiServices.put(apiEndpoint, { message });
      if (res?.status === "success") {
        toast.success("Leave declined successfully");
        onSuccess();
        onClose();
      } else {
        toast.error(res?.message || "Failed to decline leave");
      }
    } catch (err) {
      toast.error("Error declining leave");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Decline Leave"
      className="w-full max-w-lg bg-white rounded-xl shadow-xl p-6 outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Decline Leave
      </h2>
      <p className="text-gray-600 mb-6">
        Are you sure you want to decline this leave request?
      </p>

      <div className="mb-6">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Message <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <textarea
          name="message"
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a reason or message..."
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
        />
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Quick Suggestions:</p>
        <div className="flex flex-wrap gap-2">
          {[
            "Reason not sufficient for leave approval.",
            "Leave quota exceeded.",
            "Project deadlines approaching — leave not feasible.",
            "Missing required supporting documents.",
          ].map((text, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setMessage(text)}
              className="text-xs px-3 py-1 bg-gray-100 text-gray-700 border border-gray-300 rounded-full hover:bg-gray-200 transition"
            >
              {text}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleDecline}
          disabled={loading}
          className={`px-4 py-2 rounded-md text-white transition ${
            loading
              ? "bg-red-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {loading ? "Declining..." : "Decline"}
        </button>
      </div>
    </Modal>
  );
};

export default DeclineLeaveModal;

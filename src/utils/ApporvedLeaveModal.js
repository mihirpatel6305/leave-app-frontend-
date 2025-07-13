import React, { useState } from "react";
import Modal from "react-modal";
import apiServices from "./apiServices";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const ApporvedLeaveModal = ({
  isOpen,
  onClose,
  onSuccess,
  apiEndpoint,
}) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleApporve = async () => {
    try {
      setLoading(true);
      const res = await apiServices.put(apiEndpoint, { message: message });
      if (res?.status === "success") {
        toast.success("Leave Apporved Successfully");
        onSuccess();
        onClose();
      } else {
        toast.error(res?.message);
      }
    } catch (err) {
      toast.error("Error Apporval leave");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Appove Leave"
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          transform: "translate(-50%, -50%)",
          width: "400px",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <h2 style={{ marginBottom: "12px", fontSize: "1.4rem" }}>
        Apporved Leave
      </h2>
      <p style={{ marginBottom: "24px" }}>
        Are you sure you want to Apporve this leave request?
      </p>
      <div>
        <label>Message</label>
        <input
          type="text"
          name="message"
          value={message}
          onChange={(e) => {
            setMessage(e?.target?.value);
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <button
          onClick={onClose}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            background: "#f5f5f5",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleApporve}
          disabled={loading}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            border: "none",
            background: loading ? "#999" : "#ff5722",
            color: "white",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Apporving..." : "Approve"}
        </button>
      </div>
    </Modal>
  );
};

export default ApporvedLeaveModal;

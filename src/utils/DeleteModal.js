import Modal from "react-modal";
import apiServices from "./apiServices";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const DeleteModal = ({ isOpen, onClose, onSuccess, apiEndpoint, name }) => {
  const handleDelete = async () => {
    try {
      const res = await apiServices.delete(apiEndpoint);
      if (res?.status === "success") {
        onSuccess();
        onClose();
        toast.success(res.message);
      } else {
        toast.error(res.message);
        console.error(res?.message);
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Delete Confirmation"
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          transform: "translate(-50%, -50%)",
          padding: 0,
          border: "none",
          background: "none",
        },
      }}
    >
      <div className="bg-white rounded-xl shadow-xl w-[380px] p-6 border-2 border-black">
        <h4 className="text-center text-xl font-normal mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{name}</span>?
        </h4>
        <div className="flex justify-center gap-8">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md font-bold hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md font-bold hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;

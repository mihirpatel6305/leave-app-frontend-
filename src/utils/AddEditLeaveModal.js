import Modal from "react-modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import apiServices from "./apiServices";
import { toast } from "react-toastify";
import CustomRangeDatePicker from "./CustomRangeDatePicker";
import formatDate from "./formatDate";

Modal.setAppElement("#root");

const AddEditLeaveModal = ({
  isOpen,
  onClose,
  onSuccess,
  apiEndpoint,
  defaultValues = null,
}) => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      dates: defaultValues?.leaveDates || [],
      attachmentUrl: "",
      reason: defaultValues?.reason || "",
    },
    validationSchema: Yup.object({
      dates: Yup.array()
        .min(1, "At least one date is required")
        .required("Dates are required"),
      reason: Yup.string().required("Reason is required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const formData = new FormData();
        values.dates.forEach((date) => formData.append("dates[]", date));
        formData.append("reason", values.reason);
        if (values.attachmentUrl) {
          formData.append("attachmentUrl", values.attachmentUrl);
        }

        let res;
        if (defaultValues) {
          res = await apiServices.put(apiEndpoint, formData);
        } else {
          res = await apiServices.post(apiEndpoint, formData);
        }

        if (res.status === "success") {
          resetForm();
          onSuccess();
          onClose();
          toast.success(
            defaultValues
              ? "Leave Updated Successfully"
              : "Leave Created Successfully"
          );
        } else {
          toast.error(res.message || "Something went wrong");
        }
      } catch (error) {
        console.error("Error submitting leave:", error);
        toast.error("Submission failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Create New Leave"
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          transform: "translate(-50%, -50%)",
          width: "420px",
          padding: "0",
          border: "none",
          background: "none",
        },
      }}
    >
      <div
        className="bg-white rounded-xl shadow-lg p-6 w-full max-h-[65vh] overflow-y-auto no-scrollbar"
        style={{ scrollbarWidth: "none", border: "2px solid black" }}
      >
        <h2 className="text-xl font-semibold mb-5 text-center">
          {defaultValues ? "Edit Leave" : "Create New Leave"}
        </h2>

        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col space-y-4"
        >
          <div>
            <CustomRangeDatePicker formik={formik} />
            {formik.values.dates.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formik.values.dates.map((date, idx) => (
                  <div
                    key={idx}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {formatDate(date)}
                    <button
                      type="button"
                      onClick={() => {
                        const updatedDates = formik.values.dates.filter(
                          (_, i) => i !== idx
                        );
                        formik.setFieldValue("dates", updatedDates);
                      }}
                      className="ml-2 text-red-600 font-bold hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            {formik.touched.dates && formik.errors.dates && (
              <div className="text-red-600 text-sm mt-1">
                {formik.errors.dates}
              </div>
            )}
          </div>

          <div>
            <label className="block mb-1 font-semibold">Attachment</label>
            <input
              type="file"
              name="attachmentUrl"
              onChange={(e) => {
                formik.setFieldValue("attachmentUrl", e.currentTarget.files[0]);
              }}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
            {defaultValues?.attachmentUrl && (
              <a
                href={defaultValues?.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-lg"
                title="View Attachment"
              >
                👁️ Old Attachment
              </a>
            )}
          </div>

          <div>
            <label className="block mb-1 font-semibold">Reason</label>
            <textarea
              name="reason"
              rows="3"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.reason}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-y min-h-[80px]"
            />
            {formik.touched.reason && formik.errors.reason && (
              <div className="text-red-600 text-sm mt-1">
                {formik.errors.reason}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="bg-blue-600 text-white px-3 py-1.5 rounded font-bold cursor-pointer disabled:opacity-50"
            >
              {formik.isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddEditLeaveModal;

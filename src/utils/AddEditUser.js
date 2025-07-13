import Modal from "react-modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import apiServices from "./apiServices";
import { toast } from "react-toastify";
import Select from "react-select";
import { useState, useEffect } from "react";
import apiRoutes from "./apiRoutes";

Modal.setAppElement("#root");

const AddEditUser = ({
  isOpen,
  onClose,
  onSuccess,
  apiEndpoint,
  defaultValues = null,
  allManager = false,
}) => {
  const roleOptions = [
    { value: "user", label: "User" },
    { value: "manager", label: "Manager" },
  ];

  const [options, setOptions] = useState({ managers: [] });
  const loginUser = JSON.parse(localStorage.getItem("userdata"));

  const getManagerOptions = async () => {
    try {
      const res = await apiServices.get(apiRoutes.user.getManager);
      if (res.status === "success") {
        setOptions({ ...options, managers: res.data });
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  useEffect(() => {
    if (loginUser.role === "admin" && allManager) {
      getManagerOptions();
    } else {
      setOptions({ ...options, managers: [loginUser] });
    }
  }, [getManagerOptions,allManager,options,loginUser]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: defaultValues?.name || "",
      email: defaultValues?.email || "",
      password: defaultValues?.password || "",
      role: defaultValues?.role || "user",
      manager: defaultValues?.manager || loginUser?._id,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const res = defaultValues
          ? await apiServices.put(apiEndpoint, values)
          : await apiServices.post(apiEndpoint, values);

        if (res.status === "success") {
          resetForm();
          onSuccess();
          onClose();
          toast.success(
            defaultValues
              ? "User Updated Successfully"
              : "User Created Successfully"
          );
        } else {
          toast.error(res.message || "Something went wrong");
        }
      } catch (error) {
        console.error("Error submitting user:", error);
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
      contentLabel="Create/Edit User"
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
      <div className="bg-white rounded-xl shadow-lg w-[420px] p-6 max-h-[65vh] overflow-y-auto no-scrollbar">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {defaultValues ? "Edit User" : "Create New User"}
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-600 text-sm mt-1">{formik.errors.name}</p>
            )}
          </div>

          {!defaultValues?._id && (
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-600 text-sm mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>
          )}

          {!defaultValues?._id && (
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-600 text-sm mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block mb-1 font-medium">Role</label>
            <Select
              options={roleOptions}
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.value}
              value={roleOptions.find(
                (opt) => opt.value === formik.values.role
              )}
              onChange={(selectedOption) =>
                formik.setFieldValue("role", selectedOption.value)
              }
              placeholder="Select role"
            />
          </div>

          {loginUser.role === "admin" && (
            <div>
              <label className="block mb-1 font-medium">Manager</label>
              <Select
                options={options.managers}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option._id}
                value={options.managers.find(
                  (opt) => opt?._id === formik.values.manager
                )}
                onChange={(selectedOption) =>
                  formik.setFieldValue("manager", selectedOption._id)
                }
                onBlur={() => formik.setFieldTouched("manager", true)}
                placeholder="Select Manager"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 text-gray-700 border border-gray-300 rounded px-4 py-2 font-semibold hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {formik.isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddEditUser;

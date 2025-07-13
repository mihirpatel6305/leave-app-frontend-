const getToken = () => localStorage.getItem("token");

const request = async (method, uri, body = null) => {
  const token = getToken();

  const isFormData = body instanceof FormData;

  const config = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      // ❌ Do NOT set "Content-Type" if sending FormData
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
    // ✅ If FormData, send as-is; if not, stringify
    body: isFormData ? body : body ? JSON.stringify(body) : null,
  };

  const response = await fetch(`${uri}`, config);
  return response.json();
};

const apiServices = {
  get: (uri) => request("GET", uri),
  post: (uri, body) => request("POST", uri, body),
  put: (uri, body) => request("PUT", uri, body),
  delete: (uri) => request("DELETE", uri),
};

export default apiServices;

import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const loginUser = JSON.parse(localStorage.getItem("userdata"));
  const role = loginUser?.role;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userdata");
    navigate("/login");
  };

  const linkClasses = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
      : "text-gray-800 font-semibold hover:text-blue-600 transition";

  return (
    <nav className="bg-white shadow-md py-3 px-6 flex flex-wrap items-center justify-between rounded-lg mx-4 my-2">
      <div className="flex items-center space-x-4">
        <NavLink to="/" className={linkClasses}>
          Home
        </NavLink>

        {token && (
          <NavLink to="/myLeave" className={linkClasses}>
            My Leaves
          </NavLink>
        )}

        {token && (role === "manager" || role === "admin") && (
          <NavLink to="/teamLeaveRequest" className={linkClasses}>
            Team Leave Request
          </NavLink>
        )}

        {token && role === "admin" && (
          <NavLink to="/allLeaveRequest" className={linkClasses}>
            All Leave Request
          </NavLink>
        )}

        {token && (role === "manager" || role === "admin") && (
          <NavLink to="/Myteam" className={linkClasses}>
            My Team
          </NavLink>
        )}

        {token && role === "admin" && (
          <NavLink to="/allemployees" className={linkClasses}>
            All Employees
          </NavLink>
        )}
      </div>

      <div className="flex items-center space-x-4 mt-2 sm:mt-0">
        {!token ? (
          <>
            <NavLink to="/register" className={linkClasses}>
              Register
            </NavLink>
            <NavLink to="/login" className={linkClasses}>
              Login
            </NavLink>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-3 py-1.5 rounded text-sm"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
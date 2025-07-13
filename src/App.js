import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AllRoutes from "./Routes/AllRoutes";
import { ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

function App() {
  return (
    <Router>
      <AllRoutes />
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;

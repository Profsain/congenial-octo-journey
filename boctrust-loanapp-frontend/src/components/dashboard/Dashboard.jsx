import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./Dashboard.css";
import CustomerDashboard from "./CustomerDashboard";
import AdminDashboard from "./admindashboard/dashboardhome/AdminDashboard";

const Dashboard = () => {
  const [user, setUser] = useState("");
  // show dashboard base on current user admin/customer
  const currentUser = useSelector((state) => state.adminAuth.user);
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser.adminType);
    }
  }, [currentUser]);

  return (
    <div className="DashboardContainer">
      {user === "admin" ? (
        <AdminDashboard />
      ) : (
        <CustomerDashboard />
      )}
    </div>
  );
};

export default Dashboard;

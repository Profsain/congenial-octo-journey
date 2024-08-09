import { useSelector } from "react-redux";
import "./Dashboard.css";
import CustomerDashboard from "./CustomerDashboard";
import AdminDashboard from "./admindashboard/dashboardhome/AdminDashboard";

const Dashboard = () => {
  // show dashboard base on current user admin/customer
  const currentUser = useSelector((state) => state.adminAuth.user);


  return (
    <div className="DashboardContainer">
      {currentUser?.userType === "staff" || currentUser?.userType === "super_admin"  ? (
        <AdminDashboard />
      ) : (
        <CustomerDashboard />
      )}
    </div>
  );
};

export default Dashboard;

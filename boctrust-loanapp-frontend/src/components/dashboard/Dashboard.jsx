import { useSelector } from "react-redux";
import "./Dashboard.css";
import CustomerDashboard from "./CustomerDashboard";
import AdminDashboard from "./admindashboard/dashboardhome/AdminDashboard";

import PageLoader from "./shared/PageLoader";
import usePersistUser from "../../hooks/usePersistUser";

const Dashboard = () => {
  // show dashboard base on current user admin/customer
  const { user: currentUser } = useSelector((state) => state.adminAuth);
  usePersistUser();

  return (
    <>
      {currentUser?.userType === "staff" ||
      currentUser?.userType === "super_admin" ? (
        <AdminDashboard />
      ) : currentUser ? (
        <CustomerDashboard />
      ) : (
        <div
          style={{
            display: "grid",
            height: "90vh",
            placeContent: "center",
          }}
        >
          <PageLoader />
        </div>
      )}
    </>
  );
};

export default Dashboard;

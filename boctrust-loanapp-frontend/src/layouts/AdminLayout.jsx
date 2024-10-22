import { Outlet } from "react-router-dom";
import SideNavIcons from "../components/dashboard/admindashboard/dashboardhome/SideNavIcons";
import SideNavMain from "../components/dashboard/admindashboard/dashboardhome/SideNavMain";
import TopNavber from "../components/dashboard/topnavbar/TopNavber";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const AdminLayout = ({ onMenuItemClick, showSidebar, setShowSidebar, currentTitle }) => {
 
    // current login admin user
    const currentUser = useSelector((state) => state.adminAuth.user);
    const adminName = currentUser.fullName;

  const handleMouseOver = () => {
    setShowSidebar(true);
  };

  const handleMouseOut = () => {
    setShowSidebar(false);
  };
  

  return (
    <div className="DashboardContainer">
      <div className="container-fluid">
        <div className="row">
          <div className="col-2 SideNavContainer">
            {/* desktop navbar */}
            <div className="DesktopNav">
              <SideNavMain onMenuItemClick={onMenuItemClick} />
            </div>
            {/* mobile navbar */}
            <div className="MobileNav">
              {!showSidebar ? (
                <div className="SideNavIcon" onMouseOver={handleMouseOver}>
                  <SideNavIcons />
                </div>
              ) : (
                <div className="SideNavMain" onMouseLeave={handleMouseOut}>
                  <SideNavMain onMenuItemClick={onMenuItemClick} />
                </div>
              )}
            </div>
          </div>
          <div className="col-10 ">
            <div className="TopNavber mr-3">
              <TopNavber title={currentTitle} user={adminName} />
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


AdminLayout.propTypes = {
    onMenuItemClick: PropTypes.func,
    showSidebar: PropTypes.bool,
    setShowSidebar: PropTypes.func,
    currentTitle: PropTypes.string,
  };

export default AdminLayout;
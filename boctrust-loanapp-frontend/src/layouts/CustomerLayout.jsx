
import { Outlet } from "react-router-dom";
import TopNavber from "../components/dashboard/topnavbar/TopNavber";
import SidebarMain from "../components/dashboard/SidebarMain";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import SidebarIcons from "../components/dashboard/SidebarIcons";

const CustomerLayout = ({
  onMenuItemClick,
  showSidebar,
  setShowSidebar,
  currentTitle,
}) => {
  // current login admin user
  const user = useSelector((state) => state.adminAuth.user);
  
  const userName = user?.firstname + " " + user?.lastname;



  const handleMouseOver = () => {
    setShowSidebar(true);
  };

  const handleMouseOut = () => {
    setShowSidebar(false);
  };

  return (
    <div className="DashboardContainer">
      {/* mobile navbar  */}
      <div className="MobileNav">
        {!showSidebar ? (
          <div className="SideNavIcon" onMouseOver={handleMouseOver}>
            <SidebarIcons />
          </div>
        ) : (
          <div className="SideNavMain" onMouseLeave={handleMouseOut}>
            <SidebarMain onMenuItemClick={onMenuItemClick} />
          </div>
        )}
      </div>

      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 col-md-2 SideNavContainer">
            {/* desktop navbar  */}
            <div className="DesktopNav">
              <SidebarMain onMenuItemClick={onMenuItemClick} />
            </div>
          </div>
          <div className="col-sm-12 col-md-10">
            <div className="TopNavber">
              <TopNavber title={currentTitle} user={userName} />
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

CustomerLayout.propTypes = {
    onMenuItemClick: PropTypes.func,
    showSidebar: PropTypes.bool,
    setShowSidebar: PropTypes.func,
    currentTitle: PropTypes.string,
  };

export default CustomerLayout;

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import "./TopNavbar.css";
import LoanTopUpModal from "../dashboardcomponents/LoanTopUpModal";

const TopNavber = ({ title, user = "Femi Akinwade" }) => {
  // current login user
  const { user: currentUser } = useSelector((state) => state.adminAuth);

  // check is qualify for topUp. true or false
  // top up loan update here
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  // handle open top up
  const handleOpenTopUp = () => {
    setShowTopUpModal(true);
  };

  const handleCloseTopUpModal = () => {
    setShowTopUpModal(false);
  };

  // notification animation
  const [hasNewNotification, setHasNewNotification] = useState(false);

  // Simulate a new notification after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasNewNotification(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <div className="Inline mb-4">
        <div>
          <h4 id="Title">{title}</h4>
        </div>
        <div className="Inline Profile">
          {/* top up cta btn */}
          {!currentUser?.topUpLoanEligibility?.isEligible && (
            <div>
              {currentUser?.userType === "staff" ||
              currentUser?.userType === "super_admin" ? null : (
                <div
                  className="Inline UserCard topup"
                  onClick={handleOpenTopUp}
                >
                  <p>Request Top-up Loan</p>
                </div>
              )}
            </div>
          )}

          <div className={`notifyBox ${hasNewNotification ? "new" : ""}`}>
            <img src="/images/notificationicon.png" alt="alert" />
            <p className="notify">1</p>
          </div>

          <div className="Inline UserCard">
            <p>{user}</p>
            <img src="/images/smallavater.png" alt="user" />
          </div>
        </div>
      </div>

      {/* loan top up modal */}
      <LoanTopUpModal
        showModal={showTopUpModal}
        handleCloseModal={handleCloseTopUpModal}
        customerID={currentUser?._id}
      />
    </>
  );
};

TopNavber.propTypes = {
  title: PropTypes.string,
  user: PropTypes.string,
};

export default TopNavber;

import PropTypes from "prop-types";
import "./TopNavbar.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { performLogout } from "../../../redux/reducers/adminAuthReducer";
import { useState } from "react";
import LoanTopUpModal from "../dashboardcomponents/LoanTopUpModal";

const TopNavber = ({ title, user = "Femi Akinwade" }) => {
  // current login user
  const { user: currentUser } = useSelector((state) => state.adminAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate


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

  const logoutUserHandler = async () => {
    try {
      await dispatch(performLogout()); // Dispatch the thunk
      navigate("/login"); // Redirect after successful logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <div className="Inline mb-4">
        <div>
          <h4 id="Title">{title}</h4>
        </div>
        <div style={{
          display: "flex",
          justifyContent: "center"
        }}>
          <div className="Inline Profile">
            {/* top up cta btn */}
            {!currentUser.topUpLoanEligibility.isEligible && (
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

            <img src="/images/notificationicon.png" alt="alert" />
            <div className="Inline UserCard">
              <p>{user}</p>
              <img src="/images/smallavater.png" alt="user" />
            </div>
          </div>
          <button
            onClick={logoutUserHandler}
            className=""
            style={{
              backgroundColor: "#145098",
              marginRight: "10px",
              color: "white",
              fontSize: "23px",
              borderRadius: "5px",
              paddingLeft: "20px",
              paddingRight: "20px",
              paddingTop: "6px",
              paddingBottom: "6px",
            }}
          >
            Log Out
          </button>
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

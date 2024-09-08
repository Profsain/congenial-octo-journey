import PropTypes from "prop-types";
import "./TopNavbar.css";
import { useState } from "react";
import LoanTopupModal from "../dashboardcomponents/LoanTopupModal";

const TopNavber = ({ title, user = "Femi Akinwade" }) => {
  // loan top up
  const [showModal, setShowModal] = useState(false); // State for showing the modal
  // Open and close modal handlers
  const handleTopup = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <div className="Inline mb-4">
        <div>
          <h4 id="Title">{title}</h4>
        </div>
        <div className="Inline Profile">
          <button onClick={handleTopup} className="topup">Request Top-up Loan</button>
          <img src="images/notificationicon.png" alt="alert" />
          <div className="Inline UserCard">
            <p>{user}</p>
            <img src="images/smallavater.png" alt="user" />
          </div>
        </div>
      </div>

      {/* Render the LoanTopupModal */}
      {showModal && (
        <LoanTopupModal show={showModal} handleClose={handleCloseModal} />
      )}
    </>
  );
};

TopNavber.propTypes = {
  title: PropTypes.string,
  user: PropTypes.string,
};

export default TopNavber;

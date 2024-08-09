import PropTypes from "prop-types";
import { GrStatusGood } from "react-icons/gr";
import "../Credit.css";

const CheckPaylsipFileUpload = ({ selectedCustomer }) => {
  return (
    <div className="d-flex flex-column gap-2 mb-4 mt-2">
      {selectedCustomer?.creditCheck?.paySlipAnalysis?.uploadPaySlip && (
        <div className="upload__noticeItem">
          <GrStatusGood size={22} color="rgb(16 185 129)" /> Payslip Report
          Uploaded
        </div>
      )}
    </div>
  );
};

CheckPaylsipFileUpload.propTypes = {
  selectedCustomer: PropTypes.object,
};

export default CheckPaylsipFileUpload;

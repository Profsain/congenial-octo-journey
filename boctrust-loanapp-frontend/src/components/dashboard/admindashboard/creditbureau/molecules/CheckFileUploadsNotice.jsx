import PropTypes from "prop-types";
import { GrStatusGood } from "react-icons/gr";
import "../Credit.css";

const CheckFileUploadsNotice = ({ selectedCustomer }) => {
  return (
    <div className="d-flex flex-column gap-2 mb-4 mt-2">
      {selectedCustomer?.creditCheck?.creditDbSearch?.dbSearchReport && (
        <div className="upload__noticeItem">
          <GrStatusGood size={22} color="rgb(16 185 129)" /> Credit DB Search
          Report Uploaded
        </div>
      )}
      {selectedCustomer?.creditCheck?.deductCheck?.deductSearchReport && (
        <div className="upload__noticeItem">
          <GrStatusGood size={22} color="rgb(16 185 129)" /> Deduct Search
          Report Uploaded
        </div>
      )}
      {selectedCustomer?.creditCheck?.creditBureauSearch?.[0]
        ?.bureauSearchReport && (
        <div className="upload__noticeItem">
          <GrStatusGood size={22} color="rgb(16 185 129)" />{" "}
          {selectedCustomer?.creditCheck?.creditBureauSearch?.[0].bureauName
            .split("_")
            .join(" ")}{" "}
          Report Uploaded
        </div>
      )}
      {selectedCustomer?.creditCheck?.creditBureauSearch?.[1]
        ?.bureauSearchReport && (
          <div className="upload__noticeItem">
          <GrStatusGood size={22} color="rgb(16 185 129)" />{" "}
          {selectedCustomer?.creditCheck?.creditBureauSearch?.[1].bureauName
            .split("_")
            .join(" ")}{" "}
          Report Uploaded
        </div>
      )}
    </div>
  );
};

CheckFileUploadsNotice.propTypes = {
  selectedCustomer: PropTypes.object,
};

export default CheckFileUploadsNotice;

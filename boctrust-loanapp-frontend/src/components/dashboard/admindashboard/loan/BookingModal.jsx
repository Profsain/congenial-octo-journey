import { Modal, Button } from "react-bootstrap";
import Headline from "../../../shared/Headline";
import PropTypes from "prop-types";
import LabeledInput from "../../../shared/labeledInput/LabeledInput";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import LabeledSelect from "../../../shared/labeledInput/LabeledSelect";

const computationModeList = [
  {
    value: "0",
    label: "Variable loan (Fixed/Flat or Reducing loan repayment)",
  },
  {
    value: "1",
    label: "EMI Loan",
  },
];
const frequencyList = [
  {
    value: "0",
    label: "Daily",
  },
  {
    value: "1",
    label: "Weekly",
  },
  {
    value: "2",
    label: "Monthly",
  },
  {
    value: "3",
    label: "quarterly",
  },
  {
    value: "4",
    label: "Annually",
  },
  {
    value: "5",
    label: "Bi-Monthly",
  },
];

const BookingModal = ({ selectedLoan, show, handleClose }) => {
  const [bookingDetails, setBookingDetails] = useState({
    collateralDetails: "",
    collateralType: "",
    computationMode: "",
    moratorium: "",
    interestAccrualCommencementDate: "",
    principalPaymentFrequency: "",
    interestPaymentFrequency: "",
  });

  const handleOnchange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setBookingDetails({ ...bookingDetails, [name]: value });
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <div>
            <Modal.Title>
              <h4>Booking Details for </h4>

              <Headline
                text={
                  selectedLoan.customer?.banking?.accountDetails?.Message
                    .FullName ||
                  `${selectedLoan?.customer?.firstname} ${selectedLoan?.customer?.lastname}`
                }
              />
            </Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body>
          <LabeledInput
            name={"collateralDetails"}
            label={"Collateral Details"}
            value={bookingDetails.collateralDetails}
            setInputValue={handleOnchange}
          />
          <hr />
          <LabeledInput
            name={"collateralType"}
            label={"Collateral Type"}
            value={bookingDetails.collateralType}
            setInputValue={handleOnchange}
          />
          <hr />
          <LabeledSelect
            onSelect={handleOnchange}
            name="computationMode"
            label="Computation Mode"
            data={computationModeList}
            value={bookingDetails.computationMode}
          />

          <hr />
          <LabeledInput
            name={"moratorium"}
            label={"Moratorium"}
            value={bookingDetails.moratorium}
            setInputValue={handleOnchange}
          />
          <hr />
          <LabeledInput
            name={"moratorium"}
            label={"Moratorium"}
            value={bookingDetails.moratorium}
            setInputValue={handleOnchange}
          />
          <hr />
          <DatePicker
            style={{
              width: "100%",
            }}
            label="Controlled picker"
            // value={bookingDetails.interestAccrualCommencementDate}
            onChange={(newDate) =>
              setBookingDetails({
                ...bookingDetails,
                interestAccrualCommencementDate: newDate,
              })
            }
          />
          <hr />

          <LabeledSelect
            onSelect={handleOnchange}
            name="principalPaymentFrequency"
            label="Principal Payment Frequency"
            data={frequencyList}
            value={bookingDetails.principalPaymentFrequency}
          />

          <hr />

          <LabeledSelect
            onSelect={handleOnchange}
            name="interestPaymentFrequency"
            label="Interest Payment Frequency"
            data={frequencyList}
            value={bookingDetails.interestPaymentFrequency}
          />

          <hr />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>

          {/* <Button onClick={handleApproval} variant="primary">
            Approve
          </Button> */}
        </Modal.Footer>
      </Modal>
    </>
  );
};

BookingModal.propTypes = {
  handleClose: PropTypes.func,
  handleApproval: PropTypes.func,
  show: PropTypes.bool,
  currentPage: PropTypes.string,
  selectedLoan: PropTypes.object,
};

export default BookingModal;

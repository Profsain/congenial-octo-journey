import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import "./Topup.css";

const LoanTopupModal = ({ show, handleClose }) => {
  const [loanAmount, setLoanAmount] = useState("");
  const [repaymentMonths, setRepaymentMonths] = useState("");
  const [customRepaymentMonths, setCustomRepaymentMonths] = useState("");

  const handleSubmit = (data) => {
    console.log("Data", data);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const months =
      repaymentMonths === "custom" ? customRepaymentMonths : repaymentMonths;

    handleSubmit({ loanAmount, repaymentMonths: months });

    // clear form fields
    setLoanAmount("");
    setRepaymentMonths("");
    setCustomRepaymentMonths("");
    // Close the modal
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="loan-modal">
      <Modal.Header closeButton>
        <Modal.Title>Loan Top-Up Request</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group controlId="loanAmount">
            <Form.Label>Loan Amount</Form.Label>
            <Form.Control
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              placeholder="Enter loan amount"
              required
            />
          </Form.Group>

          <Form.Group controlId="repaymentMonths" className="mt-3">
            <Form.Label>Repayment Months</Form.Label>
            <Form.Control
              as="select"
              value={repaymentMonths}
              onChange={(e) => setRepaymentMonths(e.target.value)}
              required
            >
              <option value="" disabled>
                Select repayment months
              </option>
              <option value="6">6 months</option>
              <option value="12">12 months</option>
              <option value="18">18 months</option>
              <option value="24">24 months</option>
              <option value="custom">Custom</option>
            </Form.Control>
          </Form.Group>

          {repaymentMonths === "custom" && (
            <Form.Group controlId="customRepaymentMonths" className="mt-3">
              <Form.Label>Custom Repayment Months</Form.Label>
              <Form.Control
                type="number"
                value={customRepaymentMonths}
                onChange={(e) => setCustomRepaymentMonths(e.target.value)}
                placeholder="Enter custom repayment months"
                required
              />
            </Form.Group>
          )}

          <Button
            variant="primary"
            type="submit"
            className="mt-4 w-100"
            id="sendRequestButton"
          >
            Send Request
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

LoanTopupModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default LoanTopupModal;

import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";
import "./LoanTopUp.css";

const LoanTopUpModal = ({ showModal, handleCloseModal }) => {
  const [loanAmount, setLoanAmount] = useState("");
  const [repaymentMonths, setRepaymentMonths] = useState("");

  const handleLoanAmountChange = (e) => setLoanAmount(e.target.value);
  const handleRepaymentMonthsChange = (e) => setRepaymentMonths(e.target.value);

  const handleSubmit = () => {
    // Handle top-up submission logic
    console.log({ loanAmount, repaymentMonths });
    handleCloseModal(); // Use the prop to close the modal
  };

  return (
    <Modal
      show={showModal}
      onHide={handleCloseModal}
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Top Up Your Loan! Enjoy peace of mind</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="loanAmount">
            <Form.Label>Loan Amount</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter loan amount"
              value={loanAmount}
              onChange={handleLoanAmountChange}
              step={10000}
            />
          </Form.Group>

          <Form.Group controlId="repaymentMonths" className="mt-3">
            <Form.Label>Repayment Months</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter repayment months"
              value={repaymentMonths}
              onChange={handleRepaymentMonthsChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!loanAmount || !repaymentMonths}
        >
          Send Request
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoanTopUpModal;

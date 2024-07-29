/* eslint-disable no-undef */
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";
import Headline from "../../../shared/Headline";
import RowCard from "../remita/RowCard";

const LoanDetails = ({
  loanObj,
  show,
  handleClose,
  // handleApproval,
  // currentPage,
}) => {
  // handle delete
  // const apiUrl = import.meta.env.VITE_BASE_URL;
  // const deleteCustomer = async (id) => {
  //   try {
  //     const response = await fetch(`${apiUrl}/api/customer/customer/${id}`, {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const data = await response.json();

  //     if (data.message === "Customer deleted successfully") {
  //       // close modal
  //       handleClose();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const handleDelete = () => {
  //   const id = loanObj._id;

  //   // show confirmation dialog
  //   const confirmDelete = window.confirm(
  //     "Are you sure you want to delete this loan?"
  //   );
  //   if (confirmDelete) {
  //     deleteCustomer(id);
  //   }
  // };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <Headline
              text={
                loanObj.customer?.banking?.accountDetails?.Message.FullName ||
                `${loanObj?.customer?.firstname} ${loanObj?.customer?.lastname}`
              }
            />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RowCard
            title="Loan ID:"
            text={loanObj.customer.banking?.accountDetails?.Message.Id}
          />
          <hr />
          <RowCard title="Valid BVN:" text={loanObj.customer.bvnnumber} />
          <hr />
          <RowCard title="KYC:" text="Completed" />
          <hr />
          <RowCard
            title="Loan Product:"
            text={loanObj.loanproduct.productName || "General Loan"}
          />
          <hr />
          <RowCard title="Loan Amount:" text={loanObj.loanamount} />
          <hr />
          <RowCard title="Total Repayment:" text={loanObj.loantotalrepayment} />
          <hr />
          <RowCard title="Repayment Month:" text={loanObj.numberofmonth} />
          <hr />
          <RowCard title="Loan Status:" text={loanObj.loanstatus} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {/* <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button> */}
          {/* {currentPage === "pending" && (
            <Button onClick={handleApproval} variant="primary">
              Approve
            </Button>
          )} */}
        </Modal.Footer>
      </Modal>
    </>
  );
};

LoanDetails.propTypes = {
  handleClose: PropTypes.func,
  handleApproval: PropTypes.func,
  show: PropTypes.bool,
  currentPage: PropTypes.string,
  loanObj: PropTypes.object,
};

export default LoanDetails;

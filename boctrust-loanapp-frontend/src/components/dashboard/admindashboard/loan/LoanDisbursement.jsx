import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomer } from "../../../../redux/reducers/customerReducer";
import Table from "react-bootstrap/Table";
import "../../Dashboard.css";
import DashboardHeadline from "../../shared/DashboardHeadline";
import BocButton from "../../shared/BocButton";
import NextPreBtn from "../../shared/NextPreBtn";
import PageLoader from "../../shared/PageLoader";
import getDateOnly from "../../../../../utilities/getDate";
import searchList from "../../../../../utilities/searchListFunc";
import LoanDetails from "./LoanDetails";
import NoResult from "../../../shared/NoResult";
import DisbursementModal from "./DisbursementModal";

const LoanDisbursement = () => {
  const styles = {
    table: {
      //   margin: "0 2rem 0 3rem",
      fontSize: "14px",
    },
    head: {
      color: "#fff",
      fontSize: "1rem",
    },
    approved: {
      color: "#5cc51c",
    },
    completed: {
      color: "#ecaa00 ",
    },
    pending: {
      color: "#f64f4f",
    },
  };

  // fetch all customer
  const dispatch = useDispatch();
  const customers = useSelector(
    (state) => state.customerReducer.customers.customer
  );
  const status = useSelector((state) => state.customerReducer.status);

  useEffect(() => {
    dispatch(fetchAllCustomer());
  }, [dispatch]);

  // filter customer by isKycApproved
  const filteredCustomers = customers?.filter(
    (customer) =>
      customer.kyc.isKycApproved === true &&
      customer.deductions !== "remita" &&
      customer.kyc.loanstatus === "completed"
  );

  const [showCount, setShowCount] = useState(10);
  const [searchTerms, setSearchTerms] = useState("");

  const [show, setShow] = useState(false);
  const [loanObj, setLoanObj] = useState({});
  // handle close loan details
  const handleClose = () => {
    setLoanObj({});
    setShow(false);
  };

  // handle show loan details
  const handleView = (id) => {
    const loan = filteredCustomers.find((customer) => customer._id === id);
    setLoanObj(loan);
    setShow(true);
  };

  const apiUrl = import.meta.env.VITE_BASE_URL;
  // handle loan approval
  const [showDisburse, setShowDisburse] = useState(false);
  const [processing, setProcessing] = useState(false);

  const updateLoanStatus = async (customerId, status) => {
    const data = { disbursementstatus: status };

    // send update to backend
    await fetch(
      `${apiUrl}/api/customer/customer/disbursestatus/${customerId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
  };

  const handleApproval = async (id) => {
    setProcessing(true);
    // process loan approval
    const loan = filteredCustomers.find((customer) => customer._id === id);
    setLoanObj(loan);
    // create loan and disburse in bankone
    const newDisbursement = await fetch(`${apiUrl}/api/bankone/createLoan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loanObj),
    });
    const disbursedData = await newDisbursement.json;

    // check if disbursement is successful and
    // update loan status to disbursed
    // update isProcessed to true
    if (disbursedData) {
      updateLoanStatus(id, "approved");
    }
    setTimeout(() => {
      setProcessing(false);
    }, 5000);
    console.log("Disbursement", disbursedData);
    dispatch(fetchAllCustomer());
  };

  // handle loan rejection
  const handleRejection = async (id) => {
    console.log("Processing loan approval");
    // process loan rejection
    const loan = filteredCustomers.find((customer) => customer._id === id);
    setLoanObj(loan);

    // setProcessing to true after 5 second
    setTimeout(() => {
      setProcessing(false);
    }, 5000);
    // update loan status to rejected
    // update isProcessed to true
    updateLoanStatus(id, "rejected");
    dispatch(fetchAllCustomer());
  };

  // handle close disburse model
  const handleCloseDisburse = () => {
    setShowDisburse(false);
  };

  // search customer list
  const [customerList, setCustomerList] = useState(filteredCustomers);

  // update customerList to show 10 customers on page load
  // or on count changes
  useEffect(() => {
    setCustomerList(filteredCustomers?.slice(0, showCount));
  }, [customers, showCount]);

  // update customerList on search
  const handleSearch = () => {
    // check filteredCustomers is not empty
    if (!filteredCustomers) return;
    const currSearch = searchList(
      filteredCustomers,
      searchTerms,
      "agreefullname"
    );
    setCustomerList(currSearch?.slice(0, showCount));
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerms]);

  return (
    <>
      {/* top search bar */}
      <div className="Search">
        <DashboardHeadline padding="0" height="70px" bgcolor="#d9d9d9">
          <div className="SearchBar">
            <div className="FormGroup">
              <label htmlFor="show">Show</label>
              <input
                name="showCount"
                type="number"
                step={10}
                min={10}
                value={showCount}
                onChange={(e) => setShowCount(e.target.value)}
              />
            </div>
            <div className="FormGroup SBox">
              <input
                name="search"
                placeholder="Search by name"
                onChange={(e) => setSearchTerms(e.target.value)}
              />
              <img src="images/search.png" alt="search-icon" />
            </div>
          </div>
        </DashboardHeadline>
      </div>
      {/* data loader */}
      {status === "loading" && <PageLoader />}
      <DashboardHeadline
        height="52px"
        mspacer="2rem 0 -2.5rem -1rem"
        bgcolor="#145098"
      ></DashboardHeadline>
      <div style={styles.table}>
        <Table borderless hover responsive="sm">
          <thead style={styles.head}>
            <tr>
              <th>Loan ID</th>
              <th>Loan Product</th>
              <th>Borrower</th>
              <th>A/C Number</th>
              <th>Date</th>
              <th>Applied Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {customerList?.length === 0 && <NoResult name="customer" />}
            {customerList?.map((customer) => {
              return (
                <tr key={customer._id}>
                  <td>{customer.banking.accountDetails.Message.Id}</td>
                  <td>{customer.loanProduct || "General Loan"}</td>
                  <td>{customer.banking.accountDetails.Message.FullName}</td>
                  <td>
                    {customer?.banking?.accountDetails?.Message?.AccountNumber}
                  </td>
                  <td>{getDateOnly(customer.createdAt)}</td>
                  <td>N{customer.loanamount}</td>

                  <td>
                    {customer.disbursementstatus === "pending" ? (
                      <p style={styles.pending}>Pending</p>
                    ) : customer.disbursementstatus === "approved" ? (
                      <p style={styles.approved}>Disbursed</p>
                    ) : customer.disbursementstatus === "stopped" ? (
                      <p style={styles.pending}>Stopped</p>
                    ) : (
                      <p style={styles.completed}>Rejected</p>
                    )}
                  </td>
                  <td>
                    <div>
                      {customer.disbursementstatus === "pending" ? (
                        <div>
                          {processing && <PageLoader width="12px" />}
                          <BocButton
                            func={() => handleRejection(customer._id)}
                            bradius="12px"
                            fontSize="12px"
                            width="80px"
                            margin="4px"
                            bgcolor="#ecaa00"
                          >
                            Reject
                          </BocButton>
                          <BocButton
                            func={() => handleApproval(customer._id)}
                            bradius="12px"
                            fontSize="12px"
                            width="80px"
                            margin="4px"
                            bgcolor="#ecaa00"
                          >
                            Approve
                          </BocButton>
                        </div>
                      ) : (
                        <BocButton
                          func={() => handleView(customer._id)}
                          bradius="12px"
                          fontSize="12px"
                          width="80px"
                          margin="4px"
                          bgcolor="#ecaa00"
                        >
                          View
                        </BocButton>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
      <NextPreBtn />

      {/* show loan details model */}
      {show && (
        <LoanDetails show={show} handleClose={handleClose} loanObj={loanObj} />
      )}

      {/* show disbursement modal */}
      {show && (
        <DisbursementModal
          show={showDisburse}
          handleClose={handleCloseDisburse}
          loanObj={loanObj}
          handleApproval={() => handleApproval(loanObj._id)}
          handleRejection={() => handleRejection(loanObj._id)}
        />
      )}
    </>
  );
};

LoanDisbursement.propTypes = {
  searchTerms: PropTypes.string,
  showCount: PropTypes.number,
};

export default LoanDisbursement;

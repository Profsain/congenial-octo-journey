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
import sendSMS from "../../../../../utilities/sendSms";
import sendEmail from "../../../../../utilities/sendEmail";
import EmailTemplate from "../../../shared/EmailTemplate";
import ReactDOMServer from "react-dom/server";
import sortByCreatedAt from "../../shared/sortedByDate";
import { fetchBookedOrDisbursedLoans } from "../../../../redux/reducers/loanReducer";

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

  // holds state to check for loged in users permisson to approve
  const [canUserManage, setCanUserManage] = useState(false);

  // search customer list
  const [loansList, setLoansList] = useState(bookedDisbursedLoans);

  const [showCount, setShowCount] = useState(10);
  const [searchTerms, setSearchTerms] = useState("");

  const [show, setShow] = useState(false);
  const [loanObj, setLoanObj] = useState({});

  // current login admin user
  const currentUser = useSelector((state) => state.adminAuth.user);

  const { bookedDisbursedLoans } = useSelector((state) => state.loanReducer);

  const status = useSelector((state) => state.customerReducer.status);

  // fetch all customer
  const dispatch = useDispatch();
  useEffect(() => {
    setCanUserManage(currentUser?.userRole?.can.includes("loanManagement"));
  }, [currentUser]);

  useEffect(() => {
    const getData = async () => {
      await dispatch(fetchBookedOrDisbursedLoans());
    };

    getData();
  }, [dispatch]);

  // update loansList to show 10 customers on page load
  // or on count changes
  useEffect(() => {
    setLoansList(bookedDisbursedLoans?.slice(0, showCount));
  }, [bookedDisbursedLoans, showCount]);

  // handle close loan details
  const handleClose = () => {
    setLoanObj({});
    setShow(false);
  };

  // handle show loan details
  const handleView = (id) => {
    if (!bookedDisbursedLoans) return;
    const loan = bookedDisbursedLoans.find((customer) => customer._id === id);
    setLoanObj(loan);
    setShow(true);
  };

  const apiUrl = import.meta.env.VITE_BASE_URL;
  // handle loan approval
  const [showDisburse, setShowDisburse] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleInitiateDisbursement = async () => {};

  const handleApproval = async (id) => {
    setProcessing(true);

    try {
      // Process loan approval
      const loan = bookedDisbursedLoans.find((customer) => customer._id === id);
      setLoanObj(loan);

      // Create loan and disburse in bankone
      const newDisbursement = await fetch(`${apiUrl}/api/bankone/createLoan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loan),
      });

      if (!newDisbursement.ok) {
        throw new Error(
          `Failed to create loan. Status: ${newDisbursement.status}`
        );
      }

      const disbursedData = await newDisbursement.json();

      // Check if disbursement is successful and update loan status to disbursed
      if (disbursedData.status === "success") {
        // Send SMS to customer
        const message = `Your loan application has been approved. Your loan of N${loan.loanamount} has been disbursed to your account. Thank you for choosing Bank of Credit.`;
        sendSMS(loan.phonenumber, message);

        // Send email to customer
        const emailTemplate = ReactDOMServer.renderToStaticMarkup(
          <EmailTemplate
            firstName={loan.firstname}
            content={`Your loan application has been approved. Your loan of N${loan.loanamount} has been disbursed to your account. Thank you for choosing Bank of Credit.`}
          />
        );
        const option = {
          email: loan.email,
          subject: "Loan Application Approved",
          html: emailTemplate,
        };

        sendEmail(option);
      }

      dispatch(fetchAllCustomer());
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleRejection = async (id) => {
    // process loan rejection
    const loan = bookedDisbursedLoans.find((customer) => customer._id === id);
    setLoanObj(loan);

    // setProcessing to true after 5 second
    setTimeout(() => {
      setProcessing(false);
    }, 5000);
    // update loan status to rejected
    // update isProcessed to true

    // updateLoanStatus(id, "rejected");

    dispatch(fetchAllCustomer());
  };

  // handle close disburse model
  const handleCloseDisburse = () => {
    setShowDisburse(false);
  };

  // update loansList on search
  const handleSearch = () => {
    // check bookedDisbursedLoans is not empty
    if (!bookedDisbursedLoans) return;
    const currSearch = searchList(
      bookedDisbursedLoans,
      searchTerms,
      "agreefullname"
    );
    setLoansList(currSearch?.slice(0, showCount));
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
      <div className="bSection">
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
                <th>A/C Number</th>,<th>Date</th>
                <th>Applied Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loansList && loansList?.length === 0 && (
                <NoResult name="customer" />
              )}
              {loansList &&
                sortByCreatedAt(loansList)?.map((loan) => {
                  return (
                    <tr key={loan._id}>
                      <td>
                        {loan?.customer?.banking?.accountDetails?.Message.Id}
                      </td>
                      <td>{loan.loanproduct.productName || "General Loan"}</td>
                      <td>{loan?.customer?.banking?.accountDetails?.Message.FullName}</td>
                      <td>
                        {loan?.customer?.banking?.accountDetails?.Message?.AccountNumber}
                      </td>
                      <td>{getDateOnly(loan.createdAt)}</td>
                      <td>N{loan.loanamount}</td>

                      <td>
                        {loan.disbursementstatus === "pending" ? (
                          <p style={styles.pending}>Pending</p>
                        ) : loan.disbursementstatus === "approved" ? (
                          <p style={styles.approved}>Disbursed</p>
                        ) : loan.disbursementstatus === "stopped" ? (
                          <p style={styles.pending}>Stopped</p>
                        ) : (
                          <p style={styles.completed}>Rejected</p>
                        )}
                      </td>
                      <td>
                        <div>
                          {loan.disbursementstatus === "pending" ? (
                            <div>
                              {processing && <PageLoader width="12px" />}
                              <BocButton
                                func={() => handleRejection(loan._id)}
                                bradius="12px"
                                fontSize="12px"
                                width="80px"
                                margin="4px"
                                bgcolor="#ecaa00"
                              >
                                Reject
                              </BocButton>
                              <BocButton
                                func={() => handleApproval(loan._id)}
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
                              func={() => handleView(loan._id)}
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
          <LoanDetails
            show={show}
            handleClose={handleClose}
            loanObj={loanObj}
          />
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
      </div>
    </>
  );
};

LoanDisbursement.propTypes = {
  searchTerms: PropTypes.string,
  showCount: PropTypes.number,
};

export default LoanDisbursement;

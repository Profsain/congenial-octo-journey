import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomer } from "../../../../redux/reducers/customerReducer";
import Table from "react-bootstrap/Table";
import "../../Dashboard.css";
import DashboardHeadline from "../../shared/DashboardHeadline";
import NextPreBtn from "../../shared/NextPreBtn";
import PageLoader from "../../shared/PageLoader";
import getDateOnly from "../../../../../utilities/getDate";
import searchList from "../../../../../utilities/searchListFunc";
import LoanDetails from "./LoanDetails";
import NoResult from "../../../shared/NoResult";
import DisbursementModal from "./DisbursementModal";
import sortByCreatedAt from "../../shared/sortedByDate";
import { fetchBookedOrDisbursedLoans } from "../../../../redux/reducers/loanReducer";
import TableOptionsDropdown from "../../shared/tableOptionsDropdown/TableOptionsDropdown";
import { GrView } from "react-icons/gr";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FcCancel } from "react-icons/fc";

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

  // Base URL for API
  const apiUrl = import.meta.env.VITE_BASE_URL;

  // holds state to check for loged in users permisson to approve
  const [canUserManage, setCanUserManage] = useState(false);
  const [canUserDisburse, setCanUserDisburse] = useState(false);
  const [canUserApprove, setCanUserApprove] = useState(false);

  const { bookedDisbursedLoans } = useSelector((state) => state.loanReducer);

  const [showCount, setShowCount] = useState(10);
  const [searchTerms, setSearchTerms] = useState("");

  const [show, setShow] = useState(false);
  const [loanObj, setLoanObj] = useState({});

  // handle loan approval
  const [showDisburse, setShowDisburse] = useState(false);
  const [approveDisburseLoading, setApproveDisburseLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  // current login admin user
  const currentUser = useSelector((state) => state.adminAuth.user);

  // search customer list
  const [loansList, setLoansList] = useState(bookedDisbursedLoans);

  const status = useSelector((state) => state.customerReducer.status);

  // fetch all customer
  const dispatch = useDispatch();

  useEffect(() => {
    setCanUserManage(currentUser?.userRole?.can.includes("loanManagement"));
    setCanUserApprove(
      currentUser?.userRole?.can.includes("approveTransactions")
    );
    setCanUserDisburse(currentUser?.userRole?.can.includes("loanDisbursment"));
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

  const handleInitiateDisbursement = async () => {
    try {
      setApproveDisburseLoading(true);
    } catch (error) {
      console.log(error);
    } finally {
      setApproveDisburseLoading(false);
    }
  };

  const handleApproval = async (id) => {
    setApproveDisburseLoading(true);

    try {
      // Process loan approval
      const loan = bookedDisbursedLoans.find((customer) => customer._id === id);
      setLoanObj(loan);

      // Create loan and disburse in bankone
      await fetch(`${apiUrl}/api/bankone/createLoan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loan),
      });

      dispatch(fetchAllCustomer());
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setApproveDisburseLoading(false);
    }
  };

  const handleRejection = async (id) => {
    // process loan rejection
    const loan = bookedDisbursedLoans.find((customer) => customer._id === id);
    setLoanObj(loan);

    // setProcessing to true after 5 second
    setTimeout(() => {
      setRejectLoading(false);
    }, 5000);

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

  const tableOptions = [
    {
      className: "",
      icon: <GrView />,
      label: "View Details",
      func: (customer) => handleView(customer._id),
    },
    {
      className: "text-primary",
      icon: <IoMdCheckmarkCircleOutline />,
      label: canUserDisburse
        ? "Disburse Loan"
        : canUserApprove
        ? "Approve Disbursement"
        : "",
      isDisabled: (loan) =>
        (canUserDisburse && loan.disbursementstatus === "disbursed") ||
        (canUserApprove && loan.disbursementstatus !== "disbursed"),
      isLoading: approveDisburseLoading,
      func: (loan) => handleInitiateDisbursement(loan),
    },
    {
      className: "text-danger",
      icon: <FcCancel />,
      label: "Reject Loan",
      isDisabled: (loan) =>
        (canUserDisburse && loan.disbursementstatus === "disbursed") ||
        (canUserApprove && loan.disbursementstatus === "approved"),
      isLoading: rejectLoading,
      func: (loan) => handleRejection(loan._id),
    },
  ];

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
          mspacer="2rem 0 -3.2rem -1rem"
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
                      <td>
                        {
                          loan?.customer?.banking?.accountDetails?.Message
                            .FullName
                        }
                      </td>
                      <td>
                        {
                          loan?.customer?.banking?.accountDetails?.Message
                            ?.AccountNumber
                        }
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
                        {canUserManage && (
                          <td>
                            <TableOptionsDropdown
                              loan={loan}
                              items={tableOptions}
                            />
                          </td>
                        )}
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

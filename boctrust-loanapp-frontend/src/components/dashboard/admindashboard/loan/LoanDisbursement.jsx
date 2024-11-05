import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "react-bootstrap/Table";
import "../../Dashboard.css";
import DashboardHeadline from "../../shared/DashboardHeadline";
import NextPreBtn from "../../shared/NextPreBtn";
import PageLoader from "../../shared/PageLoader";
import getDateOnly from "../../../../../utilities/getDate";
import searchList from "../../../../../utilities/searchListFunc";
import LoanDetails from "./LoanDetails";
import NoResult from "../../../shared/NoResult";
// import DisbursementModal from "./DisbursementModal";
import sortByCreatedAt from "../../shared/sortedByDate";
import { fetchBookedLoans } from "../../../../redux/reducers/loanReducer";
import TableOptionsDropdown from "../../shared/tableOptionsDropdown/TableOptionsDropdown";
import { GrView } from "react-icons/gr";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FcCancel } from "react-icons/fc";
import DisplayLoanProductName from "../../shared/DisplayLoanProductName";
import TransferMoney from "./transferMoney/TransferMoney";
import { toast } from "react-toastify";
import ActionNotification from "../../shared/ActionNotification";
import { nigerianCurrencyFormat } from "../../../../../utilities/formatToNiaraCurrency";
import apiClient from "../../../../lib/axios";

const LoanDisbursement = () => {
  const styles = {
    table: {
      //   margin: "0 2rem 0 3rem",
      fontSize: "14px",
    },
    head: {
      color: "#fff",
   
    },
    approved: {
      color: "#5cc51c",
    },
    completed: {
      color: "#ecaa00 ",
    },
    disbursed: {
      color: "#2563eb",
    },
    pending: {
      color: "#f64f4f",
    },
  };

  // holds state to check for loged in users permisson to approve
  const [canUserManage, setCanUserManage] = useState(false);
  const [canUserDisburse, setCanUserDisburse] = useState(false);
  const [canUserApprove, setCanUserApprove] = useState(false);

  const { bookedLoans } = useSelector((state) => state.loanReducer);

  const [showCount, setShowCount] = useState(10);
  const [searchTerms, setSearchTerms] = useState("");

  const [show, setShow] = useState(false);
  const [loanObj, setLoanObj] = useState({});

  const [loanUserAccounts, setLoanUserAccounts] = useState(null);

  // handle loan approval
  const [showDisburse, setShowDisburse] = useState(false);
  const [approveDisburseLoading, setApproveDisburseLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  const [action, setAction] = useState(false);

  // current login admin user
  const currentUser = useSelector((state) => state.adminAuth.user);

  // search customer list
  const [loansList, setLoansList] = useState(bookedLoans);

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
      await dispatch(fetchBookedLoans());
    };

    getData();
  }, [dispatch]);

  // update loansList to show 10 customers on page load
  // or on count changes
  useEffect(() => {
    setLoansList(bookedLoans?.slice(0, showCount));
  }, [bookedLoans, showCount]);

  // handle close loan details
  const handleClose = () => {
    setLoanObj({});
    setShow(false);
  };

  // handle show loan details
  const handleView = (id) => {
    if (!bookedLoans) return;
    const loan = bookedLoans.find((customer) => customer._id === id);
    setLoanObj(loan);
    setShow(true);
  };

  const handleInitiateDisbursement = async (payload) => {
    try {
      setApproveDisburseLoading(true);

      await apiClient.put(`/loans/disburse/${loanObj._id}`, payload);
      await dispatch(fetchBookedLoans());
      toast.success("Loan Disbursement Initiated and Pending Approval");
    } catch (error) {
      toast.error(error?.response?.data?.error);
      console.log(error);
    } finally {
      setApproveDisburseLoading(false);
    }
  };

  const handleApproval = async () => {
    try {
      setApproveDisburseLoading(true);

      await apiClient.put(`/loans/approve-disburse/${loanObj._id}`);
      await dispatch(fetchBookedLoans());
      toast.success("Loan has been successfully disbursed");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error);
    } finally {
      setApproveDisburseLoading(false);
    }
  };

  const handleRejection = async (id) => {
    try {
      // process loan rejection
      const loan = bookedLoans.find((customer) => customer._id === id);
      setLoanObj(loan);

      // setProcessing to true after 5 second
      setTimeout(() => {
        setRejectLoading(false);
      }, 5000);

      await dispatch(fetchBookedLoans());
    } catch (error) {
      toast.error(error?.response?.data?.error);
    }
  };

  // handle close disburse model
  const handleCloseDisburse = () => {
    setShowDisburse(false);
    setLoanUserAccounts(null);
  };

  // update loansList on search
  const handleSearch = () => {
    // check bookedLoans is not empty
    if (!bookedLoans) return;
    const currSearch = searchList(bookedLoans, searchTerms, "agreefullname");
    setLoansList(currSearch?.slice(0, showCount));
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerms]);

  const getTableOptions = (loan) => {
    const tableOptions = [
      {
        className: "",
        icon: <GrView />,
        label: "View Details",
        func: () => handleView(loan._id),
      },
      {
        className: "text-primary",
        icon: <IoMdCheckmarkCircleOutline />,
        label: !loan.debursementDetails ? "Disburse Loan" : "Approve",
        isDisabled:
          (canUserDisburse && !canUserApprove && loan.debursementDetails) ||
          (canUserApprove &&
            !canUserDisburse &&
            (!loan.debursementDetails ||
              loan.disbursementstatus === "approved")),
        isLoading: approveDisburseLoading,
        func: async () => {
          try {
            setLoanObj(loan);
            setShowDisburse(true);
            const response = await apiClient.get(
              `/bankone/getCustomerAccountsByBankoneId/${loan.customer?.banking?.accountDetails?.CustomerID}`
            );

            setLoanUserAccounts(
              response.data?.Accounts?.map((item) => ({
                label: item.NUBAN,
                value: item.NUBAN,
              }))
            );
          } catch (error) {
            toast.error(error.message);
          }
        },
      },
      {
        className: "text-danger",
        icon: <FcCancel />,
        label: "Reject",
        isDisabled:
          (canUserDisburse &&
            !canUserApprove &&
            loan.disbursementstatus === "disbursed") ||
          (canUserApprove && loan.disbursementstatus === "approved"),
        isLoading: rejectLoading,
        func: () => {
          setLoanObj(loan);
          setAction(true);
        },
      },
    ];
    return tableOptions;
  };

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
              <img src="/images/search.png" alt="search-icon" />
            </div>
          </div>
        </DashboardHeadline>
      </div>
      {/* data loader */}
      <div className="bSection">
        {status === "loading" && <PageLoader />}
        <DashboardHeadline
          height="52px"
          mspacer="2rem 0 -3.2rem -0.5rem"
          bgcolor="#145098"
        ></DashboardHeadline>
        <div style={styles.table}>
          <Table borderless hover responsive="sm">
            <thead style={styles.head}>
              <tr>
                <th>Customer ID</th>
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
                        {loan?.customer?.banking?.accountDetails?.CustomerID}
                      </td>
                      <td>
                        <DisplayLoanProductName loan={loan} />
                      </td>
                      <td>
                        {loan?.customer?.banking?.accountDetails?.CustomerName}
                      </td>
                      <td>
                        {loan?.customer?.banking?.accountDetails?.AccountNumber}
                      </td>
                      <td>{getDateOnly(loan.createdAt)}</td>
                      <td>{nigerianCurrencyFormat.format(loan?.loanamount)}</td>

                      <td>
                        {loan.disbursementstatus === "pending" ? (
                          <p className="badge_pending">Pending</p>
                        ) : loan.disbursementstatus === "approved" ? (
                          <p className="badge_success">Approved</p>
                        ) : loan.disbursementstatus === "stopped" ? (
                          <p className="badge_error">Stopped</p>
                        ) : (
                          <p className="badge_info">Disbursed</p>
                        )}
                      </td>
                      <td>
                        {canUserManage && (
                          <td>
                            <TableOptionsDropdown
                              items={getTableOptions(loan)}
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
        {showDisburse && (
          <TransferMoney
            show={showDisburse}
            loanObj={loanObj}
            debitAccounts={loanUserAccounts}
            handleClose={handleCloseDisburse}
            btnText={
              canUserDisburse && loanObj?.disbursementstatus === "pending"
                ? "Send "
                : canUserApprove
                ? "Approve"
                : ""
            }
            action={
              canUserDisburse && loanObj?.disbursementstatus === "pending"
                ? handleInitiateDisbursement
                : canUserApprove
                ? handleApproval
                : () => {}
            }
          />
        )}

        <ActionNotification
          show={action}
          handleClose={() => setAction(false)}
          handleProceed={() => {
            if (loanObj?._id) {
              handleRejection(loanObj?._id);
            }
          }}
        />
      </div>
    </>
  );
};

LoanDisbursement.propTypes = {
  searchTerms: PropTypes.string,
  showCount: PropTypes.number,
};

export default LoanDisbursement;

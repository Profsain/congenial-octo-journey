import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "react-bootstrap";
import BocButton from "../../shared/BocButton";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../customers/Customer.css";
import NextPreBtn from "../../shared/NextPreBtn";
import PageLoader from "../../shared/PageLoader";
import LoanDetails from "./LoanDetails";
import NotificationBox from "../../shared/NotificationBox";
import NoResult from "../../../shared/NoResult";
import sortByCreatedAt from "../../shared/sortedByDate";
import { customerApprovalEnum } from "../../../../lib/userRelated";
import { fetchOverdueLoans } from "../../../../redux/reducers/loanReducer";
import ViewBySection from "../remita/ViewBySection";
import DisplayLoanProductName from "../../shared/DisplayLoanProductName";
import { nigerianCurrencyFormat } from "../../../../../utilities/formatToNiaraCurrency";
import { format } from "date-fns";
import useSearchByDateRange from "../../../../../utilities/useSearchByDateRange";
import usePagination from "@mui/material/usePagination/usePagination";
import usePaginatedData from "../../../../customHooks/usePaginationData";

import ReviewDirectDebit from "./ReviewDirectDebit";

const CompletedLoans = () => {
  const styles = {
    head: {
      color: "#fff",
      fontSize: "0.8rem",
    },
    approved: {
      color: "#5cc51c",
    },
    completed: {
      color: "#f64f4f",
    },
    padding: {
      color: "#ecaa00",
    },
    message: {
      textAlign: "center",
      fontSize: "1.2rem",
      color: "#145098",
    },
    btnBox: {
      display: "flex",
      justifyContent: "space-between",
    },
  };

  const { overdueLoans, status } = useSelector((state) => state.loanReducer);

  // current login admin user
  const currentUser = useSelector((state) => state.adminAuth.user);

  const [show, setShow] = useState(false);
  const [loanObj, setLoanObj] = useState({});
  const [message, setMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [canUserManage, setCanUserManage] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({
    fromDate: "",
    toDate: "",
  });
  const [overdueLoanEntries, setOverdueLoanEntries] = useState(null);
  const [searchTodayEntries, setSearchTodayEntries] = useState(false);

  // review direct debit
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Open review modal
  const handleReviewClick = (customer) => {
    setSelectedCustomer(customer);
    setShowReviewModal(true);
  };

  const dispatch = useDispatch();

  
  useEffect(() => {
    setTotalPage(totalPages);
  }, [totalPages]);


  useEffect(() => {
    setCanUserManage(currentUser?.userRole?.can.includes("loanManagement"));
  }, [currentUser]);

  useEffect(() => {
    dispatch(fetchOverdueLoans({}));
  }, [dispatch, showNotification]);

  useEffect(() => {
    if (overdueLoans?.length > 0) {
      setOverdueLoanEntries(overdueLoans);
    }
  }, [overdueLoans]);

  useEffect(() => {
    if (
      searchTerm.length >= 3 ||
      searchTerm.length == 0 ||
      searchTodayEntries
    ) {
      dispatch(
        fetchOverdueLoans({
          searchTerm,
          dateFilter: searchTodayEntries,
        })
      );
    }
  }, [searchTerm, searchTodayEntries]);

  // handle close notification
  const closeNotification = () => {
    setShowNotification(false);
    setMessage("");
  };

  // handle close loan details
  const handleClose = () => {
    setLoanObj({});
    setShow(false);
  };

  const handleReload = () => {
    setDateRange({
      fromDate: "",
      toDate: "",
    });
    dispatch(fetchOverdueLoans({}));
    setSearchTodayEntries(false);

    setOverdueLoanEntries(overdueLoans);
  };

  // handle show loan details
  const handleShow = (id) => {
    const loan = filteredCustomers.find(
      (overdueLoan) => overdueLoan._id === id
    );
    setLoanObj(loan);
    setShow(true);
  };

  const { searchData } = useSearchByDateRange(
    overdueLoans,
    dateRange,
    "dateCreated"
  );

  useEffect(() => {
    setOverdueLoanEntries(searchData);
  }, [searchData, overdueLoans]);

  // handle search
  // const [showCount, setShowCount] = useState(10);

  return (
    <>
      <div>
        {/* view by section */}
        <ViewBySection
          setSearch={setSearchTerm}
          setDateRange={setDateRange}
          dateRange={dateRange}
          firstBtn="View by Loans Today"
          setSearchTodayEntries={setSearchTodayEntries}
          handleReload={handleReload}
        />
      </div>
      <div>
        <div>
          {/* Loans list  */}
          <div className="ListSec">
            <DashboardHeadline
              height="52px"
              mspacer="2rem 0 -3.7rem -1rem"
              bgcolor="#145098"
            ></DashboardHeadline>
            <div style={styles.table}>
              <Table borderless hover responsive="sm">
                <thead style={styles.head}>
                  <tr>
                    <th>Customer Name</th>
                    <th>Date Due</th>
                    <th>Loan Product</th>
                    <th>Account Number</th>
                    <th>Release Date</th>
                    <th>Amount Paid</th>
                    <th>Due Amount</th>
                    <th>Direct Debit</th>
                  </tr>
                </thead>
                <tbody>
                  {!paginatedOverdueLoans || status === "loading" ? (
                    <td colSpan="8">
                      <PageLoader />
                    </td>
                  ) : paginatedOverdueLoans && paginatedOverdueLoans?.length === 0 ? (
                    <td colSpan="8">
                      <NoResult name="Overdue Loans" />
                    </td>
                  ) : (
                    paginatedOverdueLoans?.map((overdueLoan) => {
                      return (
                        <tr key={overdueLoan._id}>
                          <td>{`${overdueLoan?.customer?.firstname} ${overdueLoan?.customer?.lastname}`}</td>
                          <td>
                            {overdueLoan?.repaymentSchedule[0].PaymentDueDate &&
                              format(
                                new Date(
                                  overdueLoan?.repaymentSchedule[0].PaymentDueDate
                                ),
                                "dd/LL/yyyy, hh:mm aaa"
                              )}
                          </td>
                          <td>
                            <DisplayLoanProductName loan={overdueLoan} />
                          </td>
                          <td>{overdueLoan.loanAccountNumber}</td>
                          <td>
                            {overdueLoan?.dateCreated &&
                              format(
                                overdueLoan?.dateCreated,
                                "dd/LL/yyyy, hh:mm aaa"
                              )}
                          </td>

                          <td>
                            {nigerianCurrencyFormat.format(
                              overdueLoan?.disbursedAmount / 100
                            )}
                          </td>
                          <td>
                            {overdueLoan?.accountBalance.PrincipalDueButUnpaid +
                              overdueLoan?.accountBalance.InterestDueButUnpaid +
                              overdueLoan?.accountBalance.LoanFeeDueButUnPaid +
                              overdueLoan?.accountBalance.PenaltyDueButUnpaid}
                          </td>
                          {canUserManage && (
                            <td>
                              <div style={styles.btnBox}>
                                <BocButton
                                  func={() => handleReviewClick(overdueLoan)}
                                  bradius="12px"
                                  fontSize="14px"
                                  margin="2px"
                                  bgcolor="#ecaa00"
                                >
                                  Start
                                </BocButton>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </Table>
            </div>
            <NextPreBtn
              currentPage={currentPage}
              totalPages={totalPage}
              goToNextPage={goToNextPage}
              goToPreviousPage={goToPreviousPage}
            />
          </div>
        </div>
      </div>

      {show && (
        <LoanDetails show={show} handleClose={handleClose} loanObj={loanObj} />
      )}

      {/* Review Direct Debit Modal */}
      {selectedCustomer && (
        <ReviewDirectDebit
          show={showReviewModal}
          handleClose={() => setShowReviewModal(false)}
          customer={selectedCustomer}
        />
      )}
      
      {/* show notification model */}
      {showNotification && (
        <NotificationBox
          message={message}
          show={showNotification}
          handleClose={closeNotification}
        />
      )}
    </>
  );
};

export default CompletedLoans;

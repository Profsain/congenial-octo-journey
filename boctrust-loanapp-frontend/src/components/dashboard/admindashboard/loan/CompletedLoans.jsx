import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomer } from "../../../../redux/reducers/customerReducer";
import { Table } from "react-bootstrap";
import BocButton from "../../shared/BocButton";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../customers/Customer.css";
import NextPreBtn from "../../shared/NextPreBtn";
import PageLoader from "../../shared/PageLoader";
import getDateOnly from "../../../../../utilities/getDate";
import capitalizeEachWord from "../../../../../utilities/capitalizeFirstLetter";
import searchList from "../../../../../utilities/searchListFunc";
import LoanDetails from "./LoanDetails";
import NotificationBox from "../../shared/NotificationBox";
import NoResult from "../../../shared/NoResult";
import sortByCreatedAt from "../../shared/sortedByDate";
import { customerApprovalEnum } from "../../../../lib/userRelated";

const OverdueLoans = () => {
  const styles = {
    head: {
      color: "#fff",
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

  // fetch all customer
  const dispatch = useDispatch();
  const customers = useSelector(
    (state) => state.customerReducer.customers.customer
  );
  const status = useSelector((state) => state.customerReducer.status);

  // current login admin user
  const currentUser = useSelector((state) => state.adminAuth.user);

  // filtere customer by isKycApproved
  const filteredCustomers = customers?.filter(
    (customer) =>
      customer.kyc.isKycApproved === true &&
      customer?.creditCheck?.decisionSummary?.cooApprovalStatus ===
        customerApprovalEnum.approved &&
      customer.kyc.loanstatus === "completed"
  );

  const [show, setShow] = useState(false);
  const [loanObj, setLoanObj] = useState({});
  const [message, setMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [canUserManage, setCanUserManage] = useState(false);

  useEffect(() => {
    setCanUserManage(currentUser?.userRole?.can.includes("loanManagement"));
  }, [currentUser]);

  useEffect(() => {
    dispatch(fetchAllCustomer());
  }, [dispatch, showNotification]);

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

  // handle show loan details
  const handleShow = (id) => {
    const loan = filteredCustomers.find((customer) => customer._id === id);
    setLoanObj(loan);
    setShow(true);
  };

  // handle search
  const [showCount, setShowCount] = useState(10);
  const [searchTerms, setSearchTerms] = useState("");

  // search customer list
  const [customerList, setCustomerList] = useState(filteredCustomers);

  // update customerList to show 10 customers on page load
  // or on count changes
  useEffect(() => {
    setCustomerList(filteredCustomers?.slice(0, showCount));
  }, [customers, showCount]);

  // update customerList on search
  const handleSearch = () => {
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
      <div className="MainBox">
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
        <div>
          {/* data loader */}
          {status === "loading" && <PageLoader />}

          {/* Loans list  */}
          <div className="ListSec">
            <DashboardHeadline
              height="52px"
              mspacer="2rem 0 -2.25rem -1rem"
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
                    <th>Release Date</th>
                    <th>Applied Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sortByCreatedAt(customerList)?.length === 0 && (
                    <NoResult name="customer" />
                  )}
                  {customerList?.map((customer) => {
                    return (
                      <tr key={customer.id}>
                        <td>
                          {customer?.banking?.accountDetails?.Message?.Id ||
                            "N/A"}
                        </td>
                        <td>{customer?.loanProduct || "General Loan"}</td>
                        <td>
                          {customer?.banking?.accountDetails?.Message
                            ?.FullName ||
                            `${customer?.firstname} ${customer?.lastname}`}
                        </td>
                        <td>
                          {customer?.banking?.accountDetails?.Message
                            .AccountNumber || "N/A"}
                        </td>
                        <td>{getDateOnly(customer?.createdAt)}</td>
                        <td>N{customer?.loanamount}</td>
                        <td style={styles.padding}>
                          {capitalizeEachWord(customer?.kyc.loanstatus)}
                        </td>
                        {canUserManage && (
                          <td>
                            <div style={styles.btnBox}>
                              <BocButton
                                func={() => handleShow(customer._id)}
                                bradius="12px"
                                fontSize="14px"
                                margin="2px"
                                bgcolor="#ecaa00"
                              >
                                Details
                              </BocButton>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
            <NextPreBtn />
          </div>
        </div>
      </div>

      {/* show loan details model */}
      {show && (
        <LoanDetails show={show} handleClose={handleClose} loanObj={loanObj} />
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

export default OverdueLoans;

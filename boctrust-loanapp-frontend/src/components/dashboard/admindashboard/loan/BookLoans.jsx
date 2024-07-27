import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "react-bootstrap";
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
import TableOptionsDropdown from "../../shared/tableOptionsDropdown/TableOptionsDropdown";
import { GrView } from "react-icons/gr";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FcCancel } from "react-icons/fc";
import { toast } from "react-toastify";
import { fetchUnbookedOrBookedLoans } from "../../../../redux/reducers/loanReducer";

const BookLoans = () => {
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
  const { unbookedBookedLoans } = useSelector((state) => state.loanReducer);

  const status = useSelector((state) => state.customerReducer.status);

  // current login admin user
  const currentUser = useSelector((state) => state.adminAuth.user);

  const [show, setShow] = useState(false);
  const [loanObj, setLoanObj] = useState({});
  const [message, setMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [canUserManage, setCanUserManage] = useState(false);

  // handle search
  const [showCount, setShowCount] = useState(10);
  const [searchTerms, setSearchTerms] = useState("");

  useEffect(() => {
    setCanUserManage(currentUser?.userRole?.can.includes("loanManagement"));
  }, [currentUser]);

  useEffect(() => {
    const getData = async () => {
      await dispatch(fetchUnbookedOrBookedLoans());
    };

    getData();
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
    if (!unbookedBookedLoans) return;
    const loan = unbookedBookedLoans.find((loan) => loan._id === id);
    setLoanObj(loan);
    setShow(true);
  };

  // search customer list
  const [loansList, setLoansList] = useState(unbookedBookedLoans);

  // update loansList to show 10 customers on page load
  // or on count changes
  useEffect(() => {
    setLoansList(unbookedBookedLoans?.slice(0, showCount));
  }, [unbookedBookedLoans, showCount]);

  // update loansList on search
  const handleSearch = () => {
    const currSearch = searchList(
      unbookedBookedLoans,
      searchTerms,
      "agreefullname"
    );
    setLoansList(currSearch?.slice(0, showCount));
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerms]);

  const handleBookLoan = () => {
    try {
      console.log("Booked");
    } catch (error) {
      toast.error(error?.message || "Error Booking Loan");
    }
  };

  const tableOptions = [
    {
      className: "",
      icon: <GrView />,
      label: "View Details",
      func: (customer) => handleShow(customer._id),
    },
    {
      className: "text-primary",
      icon: <IoMdCheckmarkCircleOutline />,
      label: "Book Loan",
      func: (customer) => handleBookLoan(customer),
    },
    {
      className: "text-danger",
      icon: <FcCancel />,
      label: "Reject Loan",
      func: (customer) => handleShow(customer._id),
    },
  ];

  return (
    <>
      <div className="MainBox bookloan__container">
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

                    {canUserManage && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {loansList && sortByCreatedAt(loansList)?.length === 0 && (
                    <NoResult name="customer" />
                  )}
                  {loansList &&
                    loansList?.map((loan) => {
                      return (
                        <tr key={loan.id}>
                          <td>
                            {loan?.customer.banking?.accountDetails?.Message
                              ?.Id || "N/A"}
                          </td>
                          <td>
                            {loan?.loanproduct.productName || "General Loan"}
                          </td>
                          <td>
                            {loan?.customer.banking?.accountDetails?.Message
                              ?.FullName ||
                              `${loan?.customer.firstname} ${loan?.customer.lastname}`}
                          </td>
                          <td>
                            {loan?.banking?.accountDetails?.Message
                              .AccountNumber || "N/A"}
                          </td>
                          <td>{getDateOnly(loan?.createdAt)}</td>
                          <td>N{loan?.loanamount}</td>

                          <td style={styles.padding}>
                            {capitalizeEachWord(loan?.loanstatus)}
                          </td>

                          {canUserManage && (
                            <td>
                              <TableOptionsDropdown
                                loan={loan}
                                items={tableOptions}
                              />
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

export default BookLoans;

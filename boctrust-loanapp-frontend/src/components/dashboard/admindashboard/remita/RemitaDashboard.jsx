import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomer } from "../../../../redux/reducers/customerReducer";
import { Table } from "react-bootstrap";
import DashboardHeadline from "../../shared/DashboardHeadline";
import NextPreBtn from "../../shared/NextPreBtn";
import PageLoader from "../../shared/PageLoader";
import "./Remita.css";
import LoanDetailModel from "./LoanDetailModel";
import ViewBySection from "./ViewBySection.jsx";
import NoResult from "../../../shared/NoResult.jsx";

import getDateOnly from "../../../../../utilities/getDate";

// custom hook
import usePagination from "../../../../customHooks/usePagination";
import usePaginatedData from "../../../../customHooks/usePaginationData";

const RemitaDashboard = () => {
  const styles = {
    container: {
      margin: "0 4rem 0 0",
    },
    btnBox: {
      display: "flex",
      justifyContent: "center",
    },
    view: {
      backgroundColor: "#f5f5f7",
      padding: "0.3rem 0.9rem 4rem 0.9rem",
      marginTop: "3rem",
    },
    ref: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      margin: "1.9rem 4rem ",
    },
    inputBox: {
      color: "#145098",
    },
    spanIn: {
      paddingRight: "1.5rem",
    },
    head: {
      color: "#fff",
      fontSize: "14px",
    },
    approved: {
      color: "#5cc51c",
    },
    completed: {
      color: "#f64f4f",
    },
    pending: {
      color: "#ecaa00",
    },
  };

  const dispatch = useDispatch();

  // State variables
  const [openModel, setOpenModel] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ fromDate: "", toDate: "" });
  const [customerList, setCustomerList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filteredDateData, setFilteredDateData] = useState([]);

  // Redux selectors
  const customers = useSelector(
    (state) => state.customerReducer.customers.customer
  );
  const status = useSelector((state) => state.customerReducer.status);
  const currentUser = useSelector((state) => state.adminAuth.user);
  const userType = currentUser.userType;

  // Fetch all customers on component mount and when openModel changes
  useEffect(() => {
    dispatch(fetchAllCustomer());
  }, [dispatch, openModel]);

  // Search by date function
  const searchByDate = () => {
    setCustomerList(filteredDateData);
  };

  // handle search
  const [showCount, setShowCount] = useState(5);
  const [searchTerms, setSearchTerms] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  // custom hook destructuring
  const { currentPage, goToNextPage, goToPreviousPage, setPage } =
    usePagination(1, totalPages);
  const { paginatedData: paginatedAllLoans } = usePaginatedData(
    customers,
    showCount,
    currentPage
  );

  // update loansList to show 5 pendingLoans on page load
  // or on count changes
  useEffect(() => {
    setCustomerList(paginatedAllLoans); // Update local state with paginated data
  }, [paginatedAllLoans]);

  useEffect(() => {
    setTotalPages(totalPages); // Update total pages when it changes
  }, [totalPages, setTotalPages]);

  // Filter customers by remitaStatus
  const remitaCustomers = customers?.filter(
    (customer) => customer?.remita?.remitaStatus === "processed"
  );

  // Handle view details
  const handleView = (id) => {
    const customer = customers.find((customer) => customer._id === id);
    setCurrentCustomer(customer);
    setOpenModel(true);
  };

  // Filter customer list by search term
  useEffect(() => {
    setFilteredData(
      remitaCustomers?.filter((customer) =>
        customer.firstname.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  // Filter customer list by date
  useEffect(() => {
    setFilteredDateData(
      remitaCustomers?.filter(
        (customer) =>
          customer.createdAt >= dateRange.fromDate &&
          customer.createdAt <= dateRange.toDate
      )
    );
  }, [dateRange]);

  // Update customer list based on search term and date filters
  useEffect(() => {
    const filteredList =
      searchTerm && filteredData.length > 0 ? filteredData : filteredDateData;
    setCustomerList(filteredList);
  }, [searchTerm, filteredData, filteredDateData]);

  // Handle list reload
  const handleReload = () => {
    setDateRange({ fromDate: "", toDate: "" });
    // setStatus("loading");
    dispatch(fetchAllCustomer());
  };

  return (
    <>
      <div className="DetailSection DCard" style={styles.container}>
        {/* view by section */}
        <ViewBySection
          setSearch={setSearchTerm}
          setDateRange={setDateRange}
          dateRange={dateRange}
          searchDateFunc={searchByDate}
          handleReload={handleReload}
        />

        {/* data loader */}
        {status === "loading" && <PageLoader />}

        {/* table section */}
        <div className="RBox">
          <DashboardHeadline
            height="79px"
            mspacer="3.9rem -1rem -3.9rem -1rem"
            bgcolor="#145098"
          ></DashboardHeadline>
          <div style={styles.table}>
            <Table borderless hover responsive="sm">
              <thead style={styles.head}>
                <tr>
                  <th>Acc No</th>
                  <th>Name</th>
                  <th>Income from Employer</th>
                  <th>Loan Amount</th>
                  <th>Collection Amount</th>
                  <th>Date of Disbursement</th>
                  <th>Date of Collection </th>
                  <th>COO Approval</th>
                  <th>Booked Loan</th>
                  <th>View Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="10">
                    {customerList?.length === 0 && <NoResult name="Customer" />}
                  </td>
                </tr>

                {customerList?.map((customer) => {
                  return (
                    <tr key={customer._id}>
                      <td>
                        {customer.disbursementaccountnumber ||
                          customer.salaryaccountnumber}
                      </td>
                      <td>
                        {customer.firstname} {customer.lastname}
                      </td>
                      <td>N{customer.netmonthlyincome || "0.00"}</td>
                      <td>N{customer.loanamount}</td>
                      <td>N{customer.loantotalrepayment || "0.00"}</td>
                      <td>{getDateOnly(customer.updatedAt)}</td>
                      <td>
                        {customer?.remita?.remitaDetails?.data?.data?.firstPaymentDate?.slice(
                          0,
                          10
                        ) || "N/A"}
                        {/* Date */}
                      </td>
                      {customer?.remita.loanStatus === "approved" ? (
                        <td style={styles.approved}>Done</td>
                      ) : (
                        <td style={styles.pending}>Pending</td>
                      )}

                      {customer?.remita.loanStatus === "approved" ? (
                        <td style={styles.approved}>Processed</td>
                      ) : (
                        <td style={styles.completed}>Pending</td>
                      )}

                      <td
                        onClick={() => handleView(customer._id)}
                        className="startBtn"
                        style={styles.completed}
                      >
                        View
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
          <NextPreBtn
            currentPage={currentPage}
            totalPages={totalPages}
            goToNextPage={goToNextPage}
            goToPreviousPage={goToPreviousPage}
          />
        </div>

        {/* loan details model */}
        <LoanDetailModel
          customer={currentCustomer}
          usertype={userType}
          show={openModel}
          onHide={() => setOpenModel(false)}
        />
      </div>
    </>
  );
};

export default RemitaDashboard;

/* eslint-disable no-undef */

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "react-bootstrap";
import BocButton from "../../shared/BocButton";
import DashboardHeadline from "../../shared/DashboardHeadline";
import PageLoader from "../../shared/PageLoader";
import NextPreBtn from "../../shared/NextPreBtn";
import CheckSalaryDetails from "./CheckSalaryDetails";
import "./Remita.css";
import "../customers/Customer.css";
import updateSalaryHistory from "./updateSalaryHistory.js";
import ViewBySection from "./ViewBySection.jsx";
import NoResult from "../../../shared/NoResult.jsx";

import useSearch from "../../../../../utilities/useSearchName.js";
import useSearchByDate from "../../../../../utilities/useSearchByDate.js";
import useSearchByDateRange from "../../../../../utilities/useSearchByDateRange.js";
import sortByCreatedAt from "../../shared/sortedByDate.js";
import getDateOnly from "../../../../../utilities/getDate";
import { fetchLoans } from "../../../../redux/reducers/loanReducer.js";

// custom hook
import usePagination from "../../../../customHooks/usePagination";
import usePaginatedData from "../../../../customHooks/usePaginationData";

const CheckSalaryHistory = () => {
  const styles = {
    btnBox: {
      display: "flex",
      justifyContent: "center",
    },
    table: {
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
      color: "#f64f4f",
    },
    pending: {
      color: "#ecaa00",
    },
  };

  const dispatch = useDispatch();
  useEffect(() => {
    const getData = () => {
      dispatch(fetchLoans());
    };
    getData();
  }, [dispatch]);

  const { allLoans, status } = useSelector((state) => state.loanReducer);

  const [customerObj, setCustomerObj] = useState({});
  const [openDetails, setOpenDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loanList, setLoanList] = useState([]);

  // check if customer is kyc approved and deductions is remita
  // Update `loanList` whenever `allLoans` updates
  const [remitaLoans, setRemitaLoans] = useState([]);

  // handle search
  const [showCount, setShowCount] = useState(5);
  const [searchTerms, setSearchTerms] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  // custom hook destructuring
  const { currentPage, goToNextPage, goToPreviousPage, setPage } =
    usePagination(1, totalPages);
  const { paginatedData: paginatedAllLoans } = usePaginatedData(
    allLoans,
    showCount,
    currentPage
  );

  // update loansList to show 5 pendingLoans on page load
  // or on count changes
  useEffect(() => {
    setLoanList(paginatedAllLoans); // Update local state with paginated data
  }, [paginatedAllLoans]);

  useEffect(() => {
    setTotalPages(totalPages); // Update total pages when it changes
  }, [totalPages, setTotalPages]);

  const remLoans = allLoans.filter(
    (loan) => loan.deductions === "remita" && loan.customer.kyc.isKycApproved
  );

  const scrollToDetails = () => {
    if (openDetails) {
      const checkDetails = document.getElementById("checkDetails");
      checkDetails.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToDetails();
  }, [openDetails]);

  const handleCheck = async (id) => {
    setIsLoading(true);
    const apiUrl = import.meta.env.VITE_BASE_URL;
    const loan = remLoans.find((loan) => loan.customer._id === id);

    const customer = loan ? loan.customer : {};

    try {
      const response = await fetch(`${apiUrl}/api/remita/get-salary-history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authorisationCode: customer.bvnnumber,
          firstName: customer.firstname,
          lastName: customer.lastname,
          accountNumber: customer.salaryaccountnumber,
          bankCode: customer.bankcode,
          bvn: customer.bvnnumber,
          authorisationChannel: "WEB",
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch salary history");
      }
      const data = await response.json();
      setCustomerObj(data);
      await updateSalaryHistory(customer._id, data);
      setIsLoading(false);
      setOpenDetails(true);
      dispatch(fetchLoans());
    } catch (error) {
      console.error("Error checking salary:", error);
      setIsLoading(false);
    }
  };

  const handleView = (id) => {
    scrollToDetails();
    const loan = allLoans.find((loan) => loan.customer._id === id);

    const customer = loan ? loan.customer : {};
    setCustomerObj(customer);
    setOpenDetails(true);
  };

  const [updatedLoan, setUpdatedLoan] = useState({});

  const handleAction = async (e, id) => {
    e.preventDefault();
    const actionBtn = e.target.innerText;

    const loan = remLoans.find((loan) => loan.customer._id === id);
    const customer = loan ? loan.customer : {};

    const data = customer.remita;
    // console.log("Data", data);
    try {
      if (actionBtn === "Process") {
        await updateSalaryHistory(id, data, "processed");
      } else if (actionBtn === "Drop") {
        await updateSalaryHistory(id, data, "dropped");
      }
      dispatch(fetchLoans());
    } catch (error) {
      console.error("Error handling action:", error);
    }
  };

  const { searchTerm, setSearchTerm, filteredData } = useSearch(
    allLoans,
    "firstname"
  );

  const [dateRange, setDateRange] = useState({ fromDate: "", toDate: "" });

  useEffect(() => {
    setLoanList(filteredData);
  }, [searchTerm, filteredData]);

  // handle search by date
  const { filteredDateData } = useSearchByDate(loanList, "createdAt");

  const searchByDate = () => {
    setLoanList(filteredDateData);
  };

  // handle list reload
  const handleReload = () => {
    setDateRange({ fromDate: "", toDate: "" });
    dispatch(fetchLoans());
    setLoanList(loanList);
  };

  // // handle search by date range
  const { searchData } = useSearchByDateRange(loanList, dateRange, "createdAt");

  useEffect(() => {
    setLoanList(searchData);
  }, [searchData]);

  return (
    <div>
      {/* viewby section */}
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
          height="52px"
          mspacer="2rem 0 -2.55rem -1rem"
          bgcolor="#145098"
        ></DashboardHeadline>
        <div style={styles.table}>
          <Table borderless hover responsive="sm">
            <thead style={styles.head}>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Account Number</th>
                <th>BVN</th>
                <th>Date</th>
                <th>Do Check</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {remLoans?.length === 0 && (
                <NoResult name="Remita Loan Request" />
              )}
              {sortByCreatedAt(remLoans)?.map((loan) => (
                <tr key={loan.customer._id}>
                  <td>{loan.customer.firstname}</td>
                  <td>{loan.customer.lastname}</td>
                  <td>{loan.customer.salaryaccountnumber}</td>
                  <td>{loan.customer.bvnnumber}</td>
                  <td>{getDateOnly(loan.customer.createdAt)}</td>
                  {loan.customer.remita?.isRemitaCheck ? (
                    <td
                      style={styles.pending}
                      className="startBtn"
                      onClick={() => handleView(loan.customer._id)}
                    >
                      View
                    </td>
                  ) : (
                    <td
                      style={styles.pending}
                      className="startBtn"
                      onClick={() => handleCheck(loan.customer._id)}
                    >
                      Start
                    </td>
                  )}
                  <td>
                    {loan.customer.remita?.remitaStatus === "processed" && (
                      <div>
                        <BocButton
                          bradius="12px"
                          fontSize="14px"
                          width="100px"
                          margin="0 4px"
                          bgcolor="green"
                        >
                          Processed
                        </BocButton>
                      </div>
                    )}
                    {loan.customer.remita?.remitaStatus === "dropped" && (
                      <div>
                        <BocButton
                          bradius="12px"
                          fontSize="14px"
                          width="100px"
                          margin="0 4px"
                          bgcolor="#f64f4f"
                        >
                          Dropped
                        </BocButton>
                      </div>
                    )}
                    {loan.customer?.remita?.remitaStatus === "pending" && (
                      <div>
                        <BocButton
                          bradius="12px"
                          fontSize="14px"
                          width="90px"
                          margin="0 4px"
                          bgcolor="#145088"
                          func={(e) => handleAction(e, loan.customer._id)}
                        >
                          Process
                        </BocButton>
                        <BocButton
                          bradius="12px"
                          fontSize="14px"
                          width="90px"
                          margin="0 4px"
                          bgcolor="#f64f4f"
                          func={(e) => handleAction(e, loan.customer._id)}
                        >
                          Drop
                        </BocButton>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
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

      {/* details section */}
      {isLoading && <PageLoader />}
      {openDetails && (
        <div id="checkDetails">
          <CheckSalaryDetails
            customerObj={customerObj}
            setOpenDetails={setOpenDetails}
          />
        </div>
      )}
    </div>
  );
};

export default CheckSalaryHistory;

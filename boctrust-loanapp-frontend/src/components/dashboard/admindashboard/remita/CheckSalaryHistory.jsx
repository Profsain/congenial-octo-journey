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
import apiClient from "../../../../lib/axios.js";

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
  const { allLoans, status } = useSelector((state) => state.loanReducer);

  const [customerObj, setCustomerObj] = useState({});
  const [openDetails, setOpenDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loanList, setLoanList] = useState([]);

  useEffect(() => {
    const getData = async () => {
      await dispatch(fetchLoans());
    };
    getData();
  }, [dispatch]);

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
    try {
      const loan = allLoans.find((loan) => loan._id === id);
      const customer = loan ? loan.customer : {};

      const { data } = await apiClient.post(`/remita/get-salary-history`, {
        authorisationCode: customer.bvnnumber,
        firstName: customer.firstname,
        lastName: customer.lastname,
        accountNumber: customer.salaryaccountnumber,
        bankCode: customer.bankcode,
        bvn: customer.bvnnumber,
        authorisationChannel: "WEB",
      });

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
    const loan = allLoans.find((loan) => loan._id === id);

    const customer = loan ? loan.customer : {};
    setCustomerObj(customer);
    setOpenDetails(true);
  };

  const handleAction = async (e, id) => {
    e.preventDefault();
    const actionBtn = e.target.innerText;
    const loan = allLoans.find((loan) => loan._id === id);
    const customer = loan ? loan.customer : {};
    const data = customer.remita.remitaDetails;
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

  // check if customer is kyc approved and deductions is remita
  useEffect(() => {
    if (allLoans?.length > 0) {
      const result = allLoans.filter(
        (loan) =>
          loan?.customer?.kyc.isKycApproved && loan.deductions === "remita"
      );

      setLoanList(result);
    }
  }, [allLoans]);

  const { searchTerm, setSearchTerm, filteredData } = useSearch(
    loanList,
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

  // handle search by date range
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
              {loanList?.length === 0 && (
                <NoResult name="Remita Loan Request" />
              )}
              {sortByCreatedAt(loanList)?.map((loan) => (
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
                    {loan.customer.remita?.remitaStatus === "pending" && (
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
        <NextPreBtn />
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

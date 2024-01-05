/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomer } from "../../../../redux/reducers/customerReducer";
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


const CheckSalaryHistory = () => {
  const styles = {
    btnBox: {
      display: "flex",
      justifyContent: "center",
    },
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
      color: "#f64f4f",
    },
    pending: {
      color: "#ecaa00",
    },
  };

  // fetch all customer
  const dispatch = useDispatch();
  const customers = useSelector(
    (state) => state.customerReducer.customers.customer
  );
  const status = useSelector((state) => state.customerReducer.status);
  const [customerObj, setCustomerObj] = useState({});
  const [openDetails, setOpenDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAllCustomer());
  }, [dispatch]);

  // scroll to salary check details section
  const scrollToDetails = () => {
    if (openDetails) {
      const checkDetails = document.getElementById("checkDetails");
      checkDetails.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToDetails();
  }, [openDetails]);

  // handle salary check
  const handleCheck = async (id) => {
    const apiUrl = import.meta.env.VITE_BASE_URL;
    // find customer by id and update the customerObj
    const customer = customers.find((customer) => customer._id === id);

    setIsLoading(true);

    // get customer history from remita
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
        bvn: customer.bvnnumber || "041",
        authorisationChannel: "WEB",
      }),
    });

    const data = await response.json();
    // set customerObj to remita data
    setCustomerObj(data);

    // update customer history
    await updateSalaryHistory(customer._id, data);

    setIsLoading(false);
    setOpenDetails(true);

    // call dispatch to update list
    dispatch(fetchAllCustomer());
  };

  // handle view
  const handleView = (id) => {
    scrollToDetails();
    // find customer by id
    const customer = customers.find((customer) => customer._id === id);

    // set customerObj to customer
    setCustomerObj(customer);
    setOpenDetails(true);
  };

  const handleAction = async (e, id) => {
    e.preventDefault();
    const actionBtn = e.target.innerText;

    // find customer by id
    const customer = customers.find((customer) => customer._id === id);
    const data = customer.remita.remitaDetails;

    if (actionBtn === "Process") {
      // update remitaStatus to processed
      await updateSalaryHistory(id, data, "processed");
    } else if (actionBtn === "Drop") {
      // update remitaStatus to droped
      await updateSalaryHistory(id, data, "dropped");

      // send email notification to customer
    }

    // call dispatch to update list
    dispatch(fetchAllCustomer());
  };

  // handle search by
  const [customerList, setCustomerList] = useState(customers);
  const { searchTerm, setSearchTerm, filteredData } = useSearch(
    customers,
    "firstname"
  );

  const [dateRange, setDateRange] = useState({
    fromDate: "",
    toDate: "",
  });

  useEffect(() => {
    setCustomerList(filteredData);
  }, [searchTerm, filteredData]);

  // handle search by date
  const { filteredDateData } = useSearchByDate(customers, "createdAt");
  useEffect(() => {
    setCustomerList(filteredDateData);
  }, [filteredDateData]);

  // handle list reload
  const handleReload = () => {
    dispatch(fetchAllCustomer());
    setCustomerList(customers);
  };

  // handle search by date range
  const { searchData } = useSearchByDateRange(
    customers,
    dateRange,
    "createdAt"
  );

  useEffect(() => {
    setCustomerList(searchData);
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
                <th>Do Check</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {customerList?.length === 0 && <NoResult name="customer" />}
              {customerList?.map((customer) => {
                if (customer.kyc.isKycApproved) {
                  return (
                    <tr key={customer._id}>
                      <td>{customer.firstname}</td>
                      <td>{customer.lastname}</td>
                      <td>{customer.salaryaccountnumber}</td>
                      <td>{customer.bvnnumber}</td>

                      {customer.remita?.isRemitaCheck === true ? (
                        <td
                          style={styles.pending}
                          className="startBtn"
                          onClick={() => handleView(customer._id)}
                        >
                          View
                        </td>
                      ) : (
                        <td
                          style={styles.pending}
                          className="startBtn"
                          onClick={() => handleCheck(customer._id)}
                        >
                          Start
                        </td>
                      )}

                      <td>
                        {customer.remita?.remitaStatus === "processed" && (
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
                        {customer.remita?.remitaStatus === "dropped" && (
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
                        {customer.remita?.remitaStatus === "pending" && (
                          <div>
                            <BocButton
                              bradius="12px"
                              fontSize="14px"
                              width="90px"
                              margin="0 4px"
                              bgcolor="#145088"
                              func={(e) => handleAction(e, customer._id)}
                            >
                              Process
                            </BocButton>
                            <BocButton
                              bradius="12px"
                              fontSize="14px"
                              width="90px"
                              margin="0 4px"
                              bgcolor="#f64f4f"
                              func={(e) => handleAction(e, customer._id)}
                            >
                              Drop
                            </BocButton>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </Table>
        </div>
        <NextPreBtn />
      </div>

      {/* details section */}
      {isLoading ? <PageLoader /> : null}
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

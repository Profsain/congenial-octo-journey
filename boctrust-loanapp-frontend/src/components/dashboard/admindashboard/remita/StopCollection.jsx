import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomer } from "../../../../redux/reducers/customerReducer";
import { Table } from "react-bootstrap";
import BocButton from "../../shared/BocButton";
import DashboardHeadline from "../../shared/DashboardHeadline";
import NextPreBtn from "../../shared/NextPreBtn";
import PageLoader from "../../shared/PageLoader";
import ViewBySection from "./ViewBySection.jsx";
import NoResult from "../../../shared/NoResult.jsx";

import useSearch from "../../../../../utilities/useSearchName.js";
import useSearchByDate from "../../../../../utilities/useSearchByDate.js";
import useSearchByDateRange from "../../../../../utilities/useSearchByDateRange.js";

import stopLoanFunc from "./stopLoanFunc";
import sendSMS from "../../../../../utilities/sendSms.js";

const StopCollections = () => {
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
    padding: {
      color: "#ecaa00",
    },
  };

  // fetch all customer
  const dispatch = useDispatch();
  const customers = useSelector(
    (state) => state.customerReducer.customers.customer
  );
  const status = useSelector((state) => state.customerReducer.status);

  const [processLoader, setProcessLoader] = useState(false);

  useEffect(() => {
    dispatch(fetchAllCustomer());
  }, [dispatch]);

  // filter customer by remitaStatus
  const [remitaCustomers, setRemitaCustomers] = useState([]);
  // check if customer is not empty and filter by remitaStatus
  useEffect(() => {
    if (customers?.length > 0) {
      const remitaCustomers = customers.filter(
        (customer) => customer?.remita.loanStatus === "approved"
      );
      setRemitaCustomers(remitaCustomers);
    }
  }, [customers]);

  // handle stop collection
  const handleStopCollection = async (id) => {
    const apiUrl = import.meta.env.VITE_BASE_URL;

    setProcessLoader(true);

    // find customer by id
    const customer = remitaCustomers.find((customer) => customer._id === id);

    // extract details from customer object
    const { authorisationCode, customerId, mandateReference } =
      customer.remita.disbursementDetails.data;

    const raw = {
      authorisationCode,
      customerId,
      mandateReference,
    };

    // call stop collection api
    const response = await fetch(`${apiUrl}/api/remita/stop-loan-collection`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      // send customer details to remita
      body: JSON.stringify({
        ...raw,
      }),
    });
    const data = await response.json();

    // check if response is success
    if (data.data.status === "success") {
      setProcessLoader(false);
      // update stop loan status
      await stopLoanFunc(customer._id);

      // send sms notification to customer
      const message = `Dear customer, your loan collection has been stopped. Please contact us for more information.`;
      await sendSMS(customer.phone, message);
      
      // call dispatch
      dispatch(fetchAllCustomer());
    }
  };

  // handle search by
  // const [customerList, setCustomerList] = useState(remitaCustomers);
  const { searchTerm, setSearchTerm, filteredData } = useSearch(
    remitaCustomers,
    "firstname"
  );

  const [dateRange, setDateRange] = useState({
    fromDate: "",
    toDate: "",
  });

  useEffect(() => {
    setRemitaCustomers(filteredData);
  }, [searchTerm, filteredData]);

  // handle search by date
  const { filteredDateData } = useSearchByDate(remitaCustomers, "createdAt");
  const searchByDate = () => {
    setRemitaCustomers(filteredDateData);
  };

  // handle list reload
  const handleReload = () => {
    setDateRange({
      fromDate: "",
      toDate: "",
    });
    dispatch(fetchAllCustomer());
    setRemitaCustomers(remitaCustomers);
  };

  // handle search by date range
  const { searchData } = useSearchByDateRange(
    remitaCustomers,
    dateRange,
    "createdAt"
  );

  useEffect(() => {
    setRemitaCustomers(searchData);
  }, [searchData]);

  return (
    <>
      {/* view by section */}
      <ViewBySection
        firstBtn="Collections Today"
        setSearch={setSearchTerm}
        setDateRange={setDateRange}
        dateRange={dateRange}
        searchDateFunc={searchByDate}
        handleReload={handleReload}
      />
      {/* page loader */}
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
                <th>Customer ID</th>
                <th>Loan Product</th>
                <th>Amount</th>
                <th>Mandate Reference</th>
                <th>Authorized Code</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="10">
                  {remitaCustomers?.length === 0 && (
                    <NoResult name="Customer" />
                  )}
                </td>
              </tr>

              {remitaCustomers.map((customer) => (
                <tr key={customer._id}>
                  <td>{customer.remita.disbursementDetails.data.customerId}</td>
                  <td>{customer.loanproduct || "General Loan"}</td>
                  <td>{customer.loanamount}</td>
                  <td>
                    {customer.remita.disbursementDetails.data.mandateReference}
                  </td>
                  <td style={styles.padding}>
                    {customer.remita.disbursementDetails.data.authorisationCode}
                  </td>
                  <td>
                    {processLoader && <PageLoader width="25" />}
                    {customer.remita.stopLoanStatus === "stopped" ? (
                      <BocButton
                        bradius="12px"
                        fontSize="14px"
                        width="80px"
                        margin="0 4px"
                        bgcolor="#5cc51c"
                      >
                        Done
                      </BocButton>
                    ) : (
                      <BocButton
                        bradius="12px"
                        fontSize="14px"
                        width="80px"
                        margin="0 4px"
                        bgcolor="#f64f4f"
                        func={() => handleStopCollection(customer._id)}
                      >
                        Stop
                      </BocButton>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <NextPreBtn />
      </div>
    </>
  );
};

export default StopCollections;

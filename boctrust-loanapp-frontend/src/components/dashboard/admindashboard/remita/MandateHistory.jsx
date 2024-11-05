import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomer } from "../../../../redux/reducers/customerReducer";
import { Table } from "react-bootstrap";
import BocButton from "../../shared/BocButton";
import DashboardHeadline from "../../shared/DashboardHeadline";
import NextPreBtn from "../../shared/NextPreBtn";
import PageLoader from "../../shared/PageLoader";
import MandateHistoryDetailsModel from "./MandateHistoryDetailsModel";
import ViewBySection from "./ViewBySection.jsx";
import NoResult from "../../../shared/NoResult.jsx";

import useSearch from "../../../../../utilities/useSearchName.js";
import useSearchByDate from "../../../../../utilities/useSearchByDate.js";
import useSearchByDateRange from "../../../../../utilities/useSearchByDateRange.js";
import getNextMonthDate from "../../../../../utilities/getNextMonthDate";
import apiClient from "../../../../lib/axios.js";

const MandateHistory = () => {
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
      fontSize: "0.9rem",
    },
  };

  // fetch all customer
  const dispatch = useDispatch();
  const customers = useSelector(
    (state) => state.customerReducer.customers.customer
  );
  const status = useSelector((state) => state.customerReducer.status);
  useEffect(() => {
    dispatch(fetchAllCustomer());
  }, [dispatch]);

  // filter customer by remitaStatus
  const [remitaCustomers, setRemitaCustomers] = useState([]);
  useEffect(() => {
    if (customers?.length > 0) {
      const result = customers.filter(
        (customer) => customer?.remita.loanStatus === "approved"
      );
      setRemitaCustomers(result);
    }
  }, [customers]);

  // handle mandate view
  const [show, setShow] = useState(false);
  const [viewLoader, setViewLoader] = useState(false);
  const [mandateObj, setMandateObj] = useState({});

  const handleMandateView = async (id) => {
    setViewLoader(true);
    // find customer by id
    const customer = customers.find((customer) => customer._id === id);

    // call mandate history api
    const { data } = await apiClient.post(`/remita/mandate-history`, {
      customer: customer,
    });

    // update model object
    if (data.data.status === "success") {
      setMandateObj(data.data);
    }
    // open model
    setShow(true);

    setViewLoader(false);
  };

  // handle search by
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
        firstBtn="Today's Mandate"
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
          mspacer="2rem 0 -2.5rem -1rem"
          bgcolor="#145098"
        ></DashboardHeadline>
        <div style={styles.table}>
          <Table borderless hover responsive="sm">
            <thead style={styles.head}>
              <tr>
                <th>Salary Account Number</th>
                <th>Customer Name</th>
                <th>Employer Name</th>
                <th>Total Disbursed</th>
                <th>Date of Disbursement</th>
                <th>Collection Start Date</th>
                <th>Details</th>
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
                  <td>{customer.salaryaccountnumber}</td>
                  <td>
                    {customer.firstname} {customer.lastname}
                  </td>
                  <td>{customer.employer?.employersName || "N/A"}</td>
                  <td>N{customer.loantotalrepayment}</td>
                  <td>
                    {!customer.remita.remitaDetails.firstPaymentDate
                      ? customer.remita.remitaDetails.data.data.firstPaymentDate.slice(
                          0,
                          10
                        ) || "N/A"
                      : customer.remita.remitaDetails.firstPaymentDate.slice(
                          0,
                          10
                        )}
                  </td>
                  <td>
                    {!customer.remita.remitaDetails.firstPaymentDate
                      ? customer.remita.remitaDetails.data.data.firstPaymentDate.slice(
                          0,
                          10
                        ) || "N/A"
                      : getNextMonthDate(
                          customer.remita.remitaDetails.firstPaymentDate
                        )}
                  </td>
                  <td style={styles.padding}>
                    {viewLoader && <PageLoader width="25" />}
                    <BocButton
                      bradius="12px"
                      fontSize="14px"
                      width="90px"
                      margin="0 4px"
                      bgcolor="#7dd50e"
                      func={() => handleMandateView(customer._id)}
                    >
                      View
                    </BocButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <NextPreBtn />
      </div>

      {/* mandate view model */}
      <MandateHistoryDetailsModel
        show={show}
        onHide={() => setShow(false)}
        customer={mandateObj}
      />
    </>
  );
};

export default MandateHistory;

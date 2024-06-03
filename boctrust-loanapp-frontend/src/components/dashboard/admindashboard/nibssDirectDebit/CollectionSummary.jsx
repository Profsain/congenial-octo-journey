
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomer } from "../../../../redux/reducers/customerReducer";
import { Table } from "react-bootstrap";
import DashboardHeadline from "../../shared/DashboardHeadline";
import NextPreBtn from "../../shared/NextPreBtn";
import PageLoader from "../../shared/PageLoader";
import ViewBySection from "../remita/ViewBySection.jsx";
import NoResult from "../../../shared/NoResult.jsx";

import useSearch from "../../../../../utilities/useSearchName.js";
import useSearchByDate from "../../../../../utilities/useSearchByDate.js";
import useSearchByDateRange from "../../../../../utilities/useSearchByDateRange.js";
import getNextMonthDate from "../../../../../utilities/getNextMonthDate";
import "./debit.css";
import BocButton from "../../shared/BocButton.jsx";

const CollectionSummary = () => {
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
      backgroundColor: "#5cc51c",
    },
    approve: {
      backgroundColor: "#ecaa00",
    },
    pending: {
      backgroundColor: "red",
    },
    review: {
      backgroundColor: "#145098",
    },
    pendingTxt: {
      color: "red",
    },
    activeTxt: {
      color: "green",
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
  // check if customer is not empty and filter by remitaStatus
  useEffect(() => {
    if (customers?.length > 0) {
      const result = customers.filter(
        (customer) => customer?.remita.loanStatus === "approved"
      );
      setRemitaCustomers(result);
    }
  }, [customers]);

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
    <div>
      {/* view by section */}
      <ViewBySection
        firstBtn="Collections Today"
        setSearch={setSearchTerm}
        setDateRange={setDateRange}
        dateRange={dateRange}
        searchDateFunc={searchByDate}
        handleReload={handleReload}
        printBtn={
          <BocButton margin="8px 18px" bgcolor="#145098" bradius="25px" width="90px">
            Print
          </BocButton>
        }
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
                <th>Customer ID</th>
                <th>Debit Mandate</th>
                <th>Amount Debited</th>
                <th>Balance Due</th>
                <th>Mandate Reference</th>
                <th>Start Date</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              {/* <tr>
                <td colSpan="10">
                  {remitaCustomers?.length === 0 && (
                    <NoResult name="Customer" />
                  )}
                </td>
              </tr> */}
              <tr>
                <td>C001</td>
                <td>Weekly</td>
                <td>N2,000</td>
                <td>N7,500</td>
                <td>453366545512</td>
                <td style={styles.activeTxt}>03-03-2024</td>
                <td style={styles.pendingTxt}>21-06-2024</td>
              </tr>
              <tr>
                <td>C002</td>
                <td>Monthly</td>
                <td>N22,000</td>
                <td>N400,000</td>
                <td>4533665455999</td>
                <td style={styles.activeTxt}>01-04-2024</td>
                <td style={styles.pendingTxt}>30-02-2025</td>
              </tr>
              <tr>
                <td>C003</td>
                <td>Quarterly</td>
                <td>N35,000</td>
                <td>N200,900</td>
                <td>453366545111</td>
                <td style={styles.activeTxt}>02-05-2024</td>
                <td style={styles.pendingTxt}>30-09-2024</td>
              </tr>
              <tr>
                <td>C004</td>
                <td>Weekly</td>
                <td>N3,000</td>
                <td>N12,500</td>
                <td>453366545987</td>
                <td style={styles.activeTxt}>03-034-2024</td>
                <td style={styles.pendingTxt}>03-07-2024</td>
              </tr>
              <tr>
                <td>C005</td>
                <td>Annually</td>
                <td>N200,000</td>
                <td>N700,000</td>
                <td>4533665452222</td>
                <td style={styles.activeTxt}>03-03-2024</td>
                <td style={styles.pendingTxt}>21-06-2025</td>
              </tr>
              <tr>
                <td>C006</td>
                <td>Monthly</td>
                <td>N20,000</td>
                <td>N50,000</td>
                <td>4533665455982</td>
                <td style={styles.activeTxt}>01-05-2024</td>
                <td style={styles.pendingTxt}>29-09-2024</td>
              </tr>
             
            </tbody>
          </Table>
        </div>
        <NextPreBtn />
      </div>
    </div>
  );
};

export default CollectionSummary;
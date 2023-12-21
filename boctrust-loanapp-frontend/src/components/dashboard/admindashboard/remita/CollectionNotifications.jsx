import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomer } from "../../../../redux/reducers/customerReducer";
import { Table } from "react-bootstrap";
import Headline from "../../../shared/Headline";
import BocButton from "../../shared/BocButton";
import DashboardHeadline from "../../shared/DashboardHeadline";
import NextPreBtn from "../../shared/NextPreBtn";
import PageLoader from "../../shared/PageLoader";
import getNextMonthDate from "../../../../../utilities/getNextMonthDate";

const CollectionNotifications = () => {
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

  return (
    <div>
      <div>
        <Headline text="View by:" />
        <div style={styles.btnBox} className="VBox">
          <BocButton margin="8px 18px" bgcolor="#ecaa00" bradius="25px">
            Collections Today
          </BocButton>
          <BocButton margin="8px 18px" bgcolor="#ecaa00" bradius="25px">
            Date Range
          </BocButton>
          <BocButton margin="8px 18px" bgcolor="#ecaa00" bradius="25px">
            Specific User
          </BocButton>
        </div>
      </div>

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
                <th>Loan Product</th>
                <th>Amount</th>
                <th>Balance Due</th>
                <th>Mandate Ref</th>
                <th>Payment Date</th>
                <th>Notification Date</th>
              </tr>
            </thead>
            <tbody>
              {remitaCustomers.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No record found
                  </td>
                </tr>
              )}

              {remitaCustomers.map((customer) => (
                <tr key={customer._id}>
                  <td>{customer.remita.disbursementDetails.data.customerId}</td>
                  <td>{customer.loanproduct || "General Loan"}</td>
                  <td>N{customer.loanamount}</td>
                  <td>N{customer.loantotalrepayment}</td>
                  <td>
                    {customer.remita.disbursementDetails.data.mandateReference}
                  </td>
                  <td>
                    {!customer.remita.remitaDetails.firstPaymentDate ? ("N/A") : (customer.remita.remitaDetails.firstPaymentDate.slice(0, 10))}
                  </td>
                  <td>
                    {!customer.remita.remitaDetails.firstPaymentDate ? ("N/A") : (getNextMonthDate(customer.remita.remitaDetails.firstPaymentDate.slice(0, 10)))}
                  </td>
                </tr>
              ))}
              
            </tbody>
          </Table>
        </div>
        <NextPreBtn />
      </div>
    </div>
  );
};

export default CollectionNotifications;

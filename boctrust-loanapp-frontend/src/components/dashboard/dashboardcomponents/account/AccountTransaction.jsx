import { useSelector } from "react-redux";
import Table from "react-bootstrap/Table";
import BocButton from "../../shared/BocButton";
import "../../Dashboard.css";
import DashboardHeadline from "../../shared/DashboardHeadline";

const AccountTransaction = () => {
  const styles = {
    table: {
      margin: "0 2.9rem 0 0rem",
    },
    head: {
      color: "#fff",
      fontSize: "1.2rem",
    },
    booked: {
      color: "#145098",
    },
    completed: {
      color: "#5cc51c",
    },
    withcredit: {
      color: "#f64f4f",
    },
    withdisbursement: {
      color: "#ecaa00",
    },
  };

  // current user
  const user = useSelector((state) => state.adminAuth.user);

  const transactions = user?.transactions || [];

  return (
    <div className=" SecCon">
      <DashboardHeadline
        height="46px"
        mspacer="2rem 4rem -2.55rem -1.5rem"
        bgcolor="#145098"
      ></DashboardHeadline>
      <div style={styles.table}>
        <Table borderless hover responsive="sm">
          <thead style={styles.head}>
            <tr>
              <th>Date</th>
              <th>Acc Number</th>
              <th>Amount</th>
              <th>Dr/Cr</th>
              <th>Type</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No transactions record
                </td>
              </tr>
            ) : (
              transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.date}</td>
                  <td>{transaction.accountNumber}</td>
                  <td>{transaction.amount}</td>
                  <td>{transaction.drCr}</td>
                  <td>{transaction.type}</td>
                  <td
                    style={
                      transaction.status === "Booked"
                        ? styles.booked
                        : transaction.status === "Completed"
                        ? styles.completed
                        : transaction.status === "With Credit"
                        ? styles.withcredit
                        : transaction.status === "With Disbursement"
                        ? styles.withdisbursement
                        : ""
                    }
                  >
                    {transaction.status}
                  </td>
                  <td>
                    <BocButton
                      cursor="pointer"
                      bgcolor="#145098"
                      fontSize="1.6rem"
                      padding="0.5rem 1rem"
                    >
                      View
                    </BocButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AccountTransaction;

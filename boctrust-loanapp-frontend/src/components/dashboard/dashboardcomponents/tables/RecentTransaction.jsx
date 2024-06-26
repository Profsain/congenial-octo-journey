import PropTypes from "prop-types"
import BocButton from "../../shared/BocButton";
import DashboardHeadline from "../../shared/DashboardHeadline";
import Table from "react-bootstrap/Table";

const RecentTransaction = ({user}) => {
  const styles = {
    table: {
      marginLeft: "2rem",
    },
    th: {
      color: "#145098",
      fontWeight: "bold",
      fontSize: "1.2rem",
      },
      completed: {
        color: "#5cc51c",
      }
  };

  console.log("Recent Transaction", user);
  const recentTransaction = user?.recentTransaction || [];

  return (
    <div>
      <DashboardHeadline>Recent Transaction</DashboardHeadline>
      <Table
        borderless
        hover
        responsive="sm"
        style={styles.table}
        className="RBox"
      >
        <thead>
          <tr style={styles.th}>
            <th>Date</th>
            <th>AC Number</th>
            <th>Amount</th>
            <th>Dr/Cr</th>
            <th>Type</th>
            <th>Status</th>
            <th>Details</th>
          </tr>
        </thead>
        {/* <tbody>
          <tr>
            <td>2023-25-03</td>
            <td>1234567891</td>
            <td>N2134</td>
            <td>Dr</td>
            <td>Loan Repayment</td>
            <td style={styles.completed}>Completed</td>
            <td>
              <BocButton cursor="pointer" bgcolor="#145098" bradius="18px">
                View
              </BocButton>
            </td>
          </tr>
          <tr>
            <td>2023-25-03</td>
            <td>1234567891</td>
            <td>N2134</td>
            <td>Dr</td>
            <td>Loan Repayment</td>
            <td style={styles.completed}>Completed</td>
            <td>
              <BocButton cursor="pointer" bgcolor="#145098" bradius="18px">
                View
              </BocButton>
            </td>
          </tr>
          <tr>
            <td>2023-25-05</td>
            <td>1234567891</td>
            <td>N1134</td>
            <td>Cr</td>
            <td>Loan Repayment</td>
            <td style={styles.completed}>Completed</td>
            <td>
              <BocButton cursor="pointer" bgcolor="#145098" bradius="18px">
                View
              </BocButton>
            </td>
          </tr>
        </tbody> */}
        <tbody>
          {recentTransaction.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No recent transactions
              </td>
            </tr>
          ) : (
            recentTransaction.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.date}</td>
                <td>{transaction.accountNumber}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.drCr}</td>
                <td>{transaction.type}</td>
                <td style={styles.completed}>{transaction.status}</td>
                <td>
                  <BocButton cursor="pointer" bgcolor="#145098" bradius="18px">
                    View
                  </BocButton>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

RecentTransaction.propTypes = {
  user: PropTypes.any
}

export default RecentTransaction;

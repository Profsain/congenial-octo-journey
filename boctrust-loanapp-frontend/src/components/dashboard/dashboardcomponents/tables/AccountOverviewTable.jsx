import PropTypes from "prop-types";
import DashboardHeadline from "../../shared/DashboardHeadline";
import Table from "react-bootstrap/Table";

const AccountOverviewTable = ({ user }) => {
  const styles = {
    table: {
      marginLeft: "2rem",
    },
    head: { color: "#145098", fontWeight: "bold", fontSize: "1.2rem" },
  };

  // all loans record
  const allLoans = user?.allLoans || [];

  return (
    <div>
      <DashboardHeadline>Account Overview</DashboardHeadline>
      <Table
        borderless
        hover
        responsive="sm"
        style={styles.table}
        className="RBox"
      >
        <thead>
          <tr style={styles.head}>
            <th>Account Number</th>
            <th>Account Type</th>
            <th>Balance</th>
            <th>Loan</th>
            <th>Current Balance</th>
          </tr>
        </thead>
        <tbody>
          {allLoans.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No account overview
              </td>
            </tr>
          ) : (
            // allLoans.map((loan) => (
            //   <tr key={loan.id}>
            //     <td>{loan.accountNumber}</td>
            //     <td>{loan.accountType}</td>
            //     <td>{loan.balance}</td>
            //     <td>{loan.loan}</td>
            //     <td>{loan.currentBalance}</td>
            //   </tr>
            // ))
            <div>
              <tr>
                <td>7657547661</td>
                <td>Current Account</td>
                <td>N12123</td>
                <td>N2134</td>
                <td>N132900</td>
              </tr>
              <tr>
                <td>7647676673</td>
                <td>Savings Account</td>
                <td>N12123</td>
                <td>N2134</td>
                <td>N132900</td>
              </tr>
              <tr>
                <td>7647676689</td>
                <td>Fixed Deposit</td>
                <td>N12123</td>
                <td>N2134</td>
                <td>N132900</td>
              </tr>
            </div>
          )}
        </tbody>
      </Table>
    </div>
  );
};

AccountOverviewTable.propTypes = {
  user: PropTypes.any,
};

export default AccountOverviewTable;
